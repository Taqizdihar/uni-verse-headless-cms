const express = require('express');
const archiver = require('archiver');

const cors = require('cors');
require('dotenv').config();
const db = require('./db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { v2: cloudinary } = require('cloudinary');
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const app = express();

// Middleware — CORS must come FIRST, before all routes
app.use(cors({
    origin: function (origin, callback) {
        const allowedOrigins = ['http://localhost:3000', 'http://localhost:5173'];
        if (process.env.FRONTEND_URL) allowedOrigins.push(process.env.FRONTEND_URL);
        
        if (!origin || allowedOrigins.indexOf(origin) !== -1 || origin.endsWith('.netlify.app')) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());

// Verbose Request Logging
app.use((req, res, next) => {
    console.log(`[REQUEST] ${req.method} ${req.path}`, req.body && Object.keys(req.body).length ? req.body : '');
    next();
});

// Multer & Cloudinary Storage Configuration
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'uni-inside-cms',
    allowedFormats: ['jpeg', 'png', 'jpg', 'gif', 'svg', 'webp'],
  },
});

const upload = multer({ storage: storage });
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// =============================================================
// ★ PUBLIC PREVIEW ROUTE — MUST STAY BEFORE authenticateToken ★
// Express runs app.use('/api', authMiddleware) on ALL /api/*
// requests. The only escape is to register this handler BEFORE
// that middleware is ever loaded into the stack.
// =============================================================
app.get(['/api/public/site/:subdomain', '/api/public/site/:subdomain/:slug'], async (req, res) => {
    const { subdomain } = req.params;
    const cleanSlug = (req.params.slug || 'home').replace(/^\/+/, '');

    console.log(`[PREVIEW] Domain lookup: ${subdomain}, View slug: ${cleanSlug}`);

    try {
        // 1. Resolve Tenant first
        const [tenants] = await db.execute('SELECT id FROM tenants WHERE subdomain = ?', [subdomain]);
        if (tenants.length === 0) return res.status(404).json({ error: 'Tenant tidak ditemukan.' });
        const tenantId = tenants[0].id;

        // 2. Resolve Page or Post for that specific tenant
        // Page lookup
        const [pages] = await db.execute(
            `SELECT p.*, s.site_name, s.tagline, s.active_template, s.global_options, s.logo_url
             FROM pages p
             LEFT JOIN settings s ON p.tenant_id = s.tenant_id
             WHERE p.slug = ? AND p.tenant_id = ?
             LIMIT 1`,
            [cleanSlug, tenantId]
        );

        if (pages.length > 0) {
            const row = pages[0];
            const [navPages] = await db.execute(
                'SELECT title, slug FROM pages WHERE tenant_id = ? AND status = "published" ORDER BY id ASC',
                [tenantId]
            );

            if (row.content && typeof row.content === 'string') {
                try { row.content = JSON.parse(row.content); } catch(e) {}
            }
            let globalOptions = {};
            if (row.global_options) {
                try { globalOptions = typeof row.global_options === 'string' ? JSON.parse(row.global_options) : row.global_options; } catch(e) {}
            }

            return res.json({
                type: 'page',
                page: { id: row.id, title: row.title, slug: row.slug, page_type: row.page_type, content: row.content, status: row.status, tenant_id: tenantId },
                settings: { site_name: row.site_name || 'Uni-Inside', tagline: row.tagline || '', active_template: row.active_template || 'minimalist', logo_url: row.logo_url || null, global_options: globalOptions },
                navPages
            });
        }

        // Post lookup (if no page matches)
        const [posts] = await db.execute(
            `SELECT p.*, s.site_name, s.tagline, s.active_template, s.global_options, s.logo_url
             FROM posts p
             LEFT JOIN settings s ON p.tenant_id = s.tenant_id
             WHERE p.slug = ? AND p.tenant_id = ?
             LIMIT 1`,
            [cleanSlug, tenantId]
        );

        if (posts.length > 0) {
            const row = posts[0];
            const [navPages] = await db.execute(
                'SELECT title, slug FROM pages WHERE tenant_id = ? AND status = "published" ORDER BY id ASC',
                [tenantId]
            );

            let globalOptions = {};
            if (row.global_options) {
                try { globalOptions = typeof row.global_options === 'string' ? JSON.parse(row.global_options) : row.global_options; } catch(e) {}
            }
            if (row.content && typeof row.content === 'string') {
                try { row.content = JSON.parse(row.content); } catch(e) {}
            }

            return res.json({
                type: 'post',
                page: { id: row.id, title: row.title, slug: row.slug, category: row.category, content: row.content, created_at: row.created_at, tenant_id: tenantId },
                settings: { site_name: row.site_name || 'Uni-Inside', tagline: row.tagline || '', active_template: row.active_template || 'minimalist', logo_url: row.logo_url || null, global_options: globalOptions },
                navPages
            });
        }

        res.status(404).json({ error: `Not found: ${cleanSlug} for site ${subdomain}` });
    } catch (error) {
        console.error('[PREVIEW] Critical error:', error);
        res.status(500).json({ error: 'Data resolution failure' });
    }
});

app.get('/api/public/posts', async (req, res) => {
    try {
        // ✅ SECURITY FIX: Scope posts to a specific tenant via ?tenant_id query param
        // Also supports fetching all published posts for single-tenant use (no param)
        const tenantId = req.query.tenant_id ? parseInt(req.query.tenant_id) : null;
        let query = 'SELECT id, title, slug, category, excerpt, created_at, content FROM posts WHERE status = "published"';
        const params = [];
        if (tenantId) {
            query += ' AND tenant_id = ?';
            params.push(tenantId);
        }
        query += ' ORDER BY created_at DESC';
        const [posts] = await db.execute(query, params);
        res.json(posts.map(p => {
            if (p.content && typeof p.content === 'string') {
                try { p.content = JSON.parse(p.content); } catch(e) {}
            }
            return p;
        }));
    } catch (error) {
        console.error('[API ERROR] Get public posts:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get('/api/public/posts/:slug', async (req, res) => {
    try {
        const cleanSlug = (req.params.slug || '').replace(/^\/+/, '');
        const [posts] = await db.execute('SELECT * FROM posts WHERE slug = ? AND status = "published" LIMIT 1', [cleanSlug]);
        if (posts.length === 0) return res.status(404).json({ error: 'Post not found' });
        const post = posts[0];
        if (post.content && typeof post.content === 'string') {
            try { post.content = JSON.parse(post.content); } catch(e) {}
        }
        res.json(post);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Auth Middleware
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Unauthorized' });

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ error: 'Forbidden' });
        req.user = user;
        next();
    });
};


app.post('/api/auth/register', async (req, res) => {
    console.log('[AUTH] Register request received:', req.body);
    const { name, email, password } = req.body;
    try {
        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }
        console.log(`[AUTH] Checking for existing user: ${email}`);
        const [existing] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
        if (existing.length > 0) {
            console.log(`[AUTH] Registration rejected: Email ${email} already registered`);
            return res.status(400).json({ error: 'Email already registered' });
        }
        
        console.log(`[AUTH] Hashing password for: ${email}`);
        const hashedPassword = await bcrypt.hash(password, 10);
        console.log(`[AUTH] Inserting user into database: ${email}`);
        const [result] = await db.execute(
            'INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)',
            [name, email, hashedPassword]
        );
        console.log(`[AUTH] Success. New User ID: ${result.insertId}`);
        res.status(201).json({ message: 'User created', userId: result.insertId });
    } catch (error) {
        console.error('DATABASE ERROR:', error);
        res.status(500).json({ error: error.message || 'Internal Server Error' });
    }
});

app.post('/api/auth/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        console.log(`[AUTH] Login attempt: ${email}`);
        const [users] = await db.execute('SELECT id, name, email, password_hash FROM users WHERE email = ?', [email]);
        if (users.length === 0) {
            console.log(`[AUTH] Login failed: User ${email} not found`);
            return res.status(400).json({ error: 'User not found' });
        }
        
        const user = users[0];
        const validPassword = await bcrypt.compare(password, user.password_hash);
        if (!validPassword) {
            console.log(`[AUTH] Login failed: Invalid password for ${email}`);
            return res.status(400).json({ error: 'Invalid password' });
        }
        
        // Find if user has a tenant
        const [tenantUsers] = await db.execute('SELECT tenant_id, role FROM tenant_users WHERE user_id = ?', [user.id]);
        const tenant_id = tenantUsers.length > 0 ? tenantUsers[0].tenant_id : null;
        const role = tenantUsers.length > 0 ? tenantUsers[0].role : null;

        const token = jwt.sign({ userId: user.id, email: user.email, tenant_id, role }, process.env.JWT_SECRET, { expiresIn: '1d' });
        console.log(`[AUTH] Login successful for ${email}. Tenant ID: ${tenant_id || 'NONE'}`);
        res.json({ token, user: { id: user.id, name: user.name, email: user.email, tenant_id, role } });
    } catch (error) {
        console.error('[AUTH ERROR] Login Registry Failure:', error);
        res.status(500).json({ error: error.message || 'Internal Server Error' });
    }
});

app.post('/api/auth/setup', authenticateToken, async (req, res) => {
    const { site_name, tagline, subdomain } = req.body;
    const userId = req.user.userId;
    try {
        console.log(`[AUTH] Setting up tenant for User ID: ${userId}, Subdomain: ${subdomain}`);
        // Validation
        const [existing] = await db.execute('SELECT * FROM tenants WHERE subdomain = ?', [subdomain]);
        if (existing.length > 0) {
            console.log(`[AUTH] Setup failed: Subdomain ${subdomain} already exists`);
            return res.status(400).json({ error: 'Subdomain already exists' });
        }

        // a. Create tenant
        const [tenant] = await db.execute('INSERT INTO tenants (name, subdomain) VALUES (?, ?)', [site_name, subdomain]);
        const tenantId = tenant.insertId;

        // b. Create tenant_users
        await db.execute('INSERT INTO tenant_users (tenant_id, user_id, role) VALUES (?, ?, ?)', [tenantId, userId, 'admin']);

        // c. Create default settings
        await db.execute(
            'INSERT INTO settings (tenant_id, site_name, tagline, active_template) VALUES (?, ?, ?, ?)',
            [tenantId, site_name, tagline, 'minimalist']
        );

        // Sign new token with tenant_id included
        const token = jwt.sign({ userId, email: req.user.email, tenant_id: tenantId, role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '1d' });
        
        console.log(`[AUTH] Setup completed. New Tenant ID: ${tenantId}`);
        res.status(201).json({ message: 'Setup completed', token, user: { id: userId, email: req.user.email, tenant_id: tenantId, role: 'admin'} });
    } catch (error) {
        console.error('[AUTH ERROR] Setup Transaction Failure:', error);
        res.status(500).json({ error: error.message || 'Internal Server Error' });
    }
});

app.get('/', (req, res) => res.send('Server is running'));

// ========================================================
// PROTECTED ROUTES BELOW
// ========================================================
app.use('/api', authenticateToken);

// Override the hardcoded tenant_id = 1 dynamically based on req.user.tenant_id
const getTenantId = (req) => req.user.tenant_id;

// --- Settings ---
app.get('/api/settings', async (req, res) => {
    try {
        const tid = getTenantId(req);
        if (!tid) return res.status(400).json({ error: 'No tenant assignment' });
        
        const [rows] = await db.execute(`
            SELECT s.*, t.subdomain 
            FROM settings s
            JOIN tenants t ON s.tenant_id = t.id
            WHERE s.tenant_id = ?
        `, [tid]);
        
        if (rows.length === 0) return res.status(404).json({ error: 'Settings not found' });
        
        const settings = rows[0];
        // Parse global_options if it's a string
        if (settings.global_options && typeof settings.global_options === 'string') {
            try { settings.global_options = JSON.parse(settings.global_options); } catch(e) {}
        }
        res.json(settings);
    } catch (error) {
        console.error('[API ERROR] Get Settings:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.put('/api/settings', async (req, res) => {
    const { site_name, tagline, active_template, support_email, theme_color, branding_palette, logo_url, footer_config } = req.body;
    const tid = getTenantId(req);
    try {
        const globalOptions = JSON.stringify({
            support_email: support_email || '',
            theme_color: theme_color || '#fbbf24',
            branding_palette: branding_palette || null,
            footer_config: footer_config || null
        });

        await db.execute(
            'UPDATE settings SET site_name = ?, tagline = ?, active_template = ?, logo_url = ?, global_options = ? WHERE tenant_id = ?',
            [site_name, tagline, active_template, logo_url || null, globalOptions, tid]
        );
        res.json({ message: 'Configuration synchronized successfully' });
    } catch (error) {
        console.error('[API ERROR] Update Settings:', error);
        res.status(500).json({ error: 'Registry write failure' });
    }
});

// --- Pages ---
app.get('/api/pages', async (req, res) => {
    try {
        const tid = getTenantId(req);
        const [rows] = await db.execute('SELECT * FROM pages WHERE tenant_id = ?', [tid]);
        const pages = rows.map(row => {
            if (row.content && typeof row.content === 'string') {
                try { row.content = JSON.parse(row.content); } catch(e) {}
            }
            return row;
        });
        res.json(pages);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get('/api/pages/:id', async (req, res) => {
    try {
        const tid = getTenantId(req);
        const [rows] = await db.execute('SELECT * FROM pages WHERE id = ? AND tenant_id = ?', [req.params.id, tid]);
        if (rows.length === 0) return res.status(404).json({ error: 'Page not found' });
        const page = rows[0];
        if (page.content && typeof page.content === 'string') {
            try { page.content = JSON.parse(page.content); } catch(e) {}
        }
        res.json(page);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.post('/api/pages', async (req, res) => {
    const { title, slug, page_type, content, status } = req.body;
    const tid = getTenantId(req);

    // Validate mandatory fields
    if (!title || !title.trim()) return res.status(400).json({ error: 'Judul halaman wajib diisi.' });
    const finalSlug = (slug || title).toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
    if (!finalSlug) return res.status(400).json({ error: 'Slug tidak valid.' });

    try {
        // Safely serialize content — default to '{}' if missing or not serializable
        let jsonContent = '{}';
        if (content !== undefined && content !== null) {
            jsonContent = typeof content === 'object' ? JSON.stringify(content) : content;
        }

        // 1. Save or Update the Page
        const [result] = await db.execute(
            'INSERT INTO pages (tenant_id, title, slug, page_type, content, status) VALUES (?, ?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE title = VALUES(title), page_type = VALUES(page_type), content = VALUES(content)',
            [tid, title.trim(), finalSlug, page_type || 'home', jsonContent, status || 'published']
        );

        const pageId = result.insertId;

        // 2. Layout Sync
        await db.execute(
            "INSERT IGNORE INTO layouts (tenant_id, page_identifier, blocks_order) VALUES (?, ?, '[]')",
            [tid, page_type || 'home']
        );

        res.status(201).json({ message: 'Page saved successfully', id: pageId });
    } catch (error) {
        console.error('Save Page Error:', error);
        res.status(500).json({ error: 'Internal Server Error', detail: error.message });
    }
});

app.put('/api/pages/:id', async (req, res) => {
    const { title, slug, page_type, content } = req.body;
    const { id } = req.params;
    const tid = getTenantId(req);

    // Validate mandatory fields
    if (!title || !title.trim()) return res.status(400).json({ error: 'Judul halaman wajib diisi.' });
    const finalSlug = (slug || title).toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

    try {
        // Safely serialize content — default to '{}' if missing
        let jsonContent = '{}';
        if (content !== undefined && content !== null) {
            jsonContent = typeof content === 'object' ? JSON.stringify(content) : content;
        }
        await db.execute(
            'UPDATE pages SET title = ?, slug = ?, page_type = ?, content = ? WHERE id = ? AND tenant_id = ?',
            [title.trim(), finalSlug, page_type || 'home', jsonContent, id, tid]
        );
        res.json({ message: 'Page updated successfully' });
    } catch (error) {
        console.error('Update Page Error:', error);
        res.status(500).json({ error: 'Internal Server Error', detail: error.message });
    }
});

app.delete('/api/pages/:id', async (req, res) => {
    const { id } = req.params;
    const tid = getTenantId(req);
    try {
        await db.execute('DELETE FROM pages WHERE id = ? AND tenant_id = ?', [id, tid]);
        res.json({ message: 'Page deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.patch('/api/pages/:id/status', async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    const tid = getTenantId(req);

    console.log(`[TOGGLE] Attempting to update page ID ${id} to status: ${status} (tenant: ${tid})`);

    // Mandatory Validation: strictly allow only published or hidden
    if (status !== 'published' && status !== 'hidden') {
        return res.status(400).json({ error: 'Invalid status. Must be strictly "published" or "hidden".' });
    }

    try {
        // ✅ SECURITY FIX: Scope update to the authenticated tenant
        const [result] = await db.execute('UPDATE pages SET status = ? WHERE id = ? AND tenant_id = ?', [status, id, tid]);
        
        if (result.affectedRows === 0) {
            console.warn('[WARN]: No row updated. Check if ID exists or belongs to this tenant.');
            return res.status(404).json({ message: 'Page not found or access denied' });
        }
        res.json({ message: 'Status updated successfully' });
    } catch (error) {
        console.error('[DATABASE ERROR]:', error);
        res.status(500).json({ error: error.message });
    }
});

// --- Layouts ---
app.get('/api/layout', async (req, res) => {
    try {
        const tid = getTenantId(req);
        const [rows] = await db.execute("SELECT blocks_order FROM layouts WHERE tenant_id = ? AND page_identifier = 'index'", [tid]);
        res.json(rows.length > 0 ? rows[0] : { blocks_order: [] });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.put('/api/layout', async (req, res) => {
    const { blocks_order } = req.body;
    const tid = getTenantId(req);
    try {
        const jsonOrder = typeof blocks_order === 'object' ? JSON.stringify(blocks_order) : blocks_order;
        await db.execute(
            "INSERT INTO layouts (tenant_id, page_identifier, blocks_order) VALUES (?, 'index', ?) ON DUPLICATE KEY UPDATE blocks_order = ?",
            [tid, jsonOrder, jsonOrder]
        );
        res.json({ message: 'Layout updated successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// --- Posts ---
app.get('/api/posts', async (req, res) => {
    try {
        const tid = getTenantId(req);
        const [rows] = await db.execute('SELECT * FROM posts WHERE tenant_id = ?', [tid]);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.post('/api/posts', async (req, res) => {
    const { title, slug, content, excerpt, category, status } = req.body;
    const tid = getTenantId(req);
    try {
        const jsonContent = typeof content === 'object' ? JSON.stringify(content) : content;
        const [result] = await db.execute(
            'INSERT INTO posts (tenant_id, title, slug, content, excerpt, category, status) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [tid, title, slug, jsonContent, excerpt || '', category || 'News', status || 'published']
        );
        res.status(201).json({ message: 'Post created successfully', id: result.insertId });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.put('/api/posts/:id', async (req, res) => {
    const { title, slug, content, excerpt, category, status } = req.body;
    const { id } = req.params;
    const tid = getTenantId(req);
    try {
        const jsonContent = typeof content === 'object' ? JSON.stringify(content) : content;
        await db.execute(
            'UPDATE posts SET title = ?, slug = ?, content = ?, excerpt = ?, category = ?, status = ? WHERE id = ? AND tenant_id = ?',
            [title, slug, jsonContent, excerpt || '', category || 'News', status || 'published', id, tid]
        );
        res.json({ message: 'Post updated successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.delete('/api/posts/:id', async (req, res) => {
    const { id } = req.params;
    const tid = getTenantId(req);
    try {
        await db.execute('DELETE FROM posts WHERE id = ? AND tenant_id = ?', [id, tid]);
        res.json({ message: 'Post deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.patch('/api/posts/:id/status', async (req, res) => {
    const { id } = req.params;
    const tid = getTenantId(req);
    // ✅ BUG FIX: Read status from req.body (was referencing undefined `status` variable)
    const { status } = req.body;
    const validStatuses = ['published', 'hidden'];
    const finalStatus = validStatuses.includes(status) ? status : 'hidden';

    try {
        console.log(`[REQUEST] Incoming Status Toggle for Post ID: ${id} -> ${finalStatus} (tenant: ${tid})`);
        // ✅ SECURITY FIX: Scope update to the authenticated tenant
        const [result] = await db.execute('UPDATE posts SET status = ? WHERE id = ? AND tenant_id = ?', [finalStatus, id, tid]);
        
        if (result.affectedRows === 0) {
            console.warn(`[WARN] No post found with ID: ${id} for tenant: ${tid}`);
            return res.status(404).json({ success: false, message: 'Post tidak ditemukan atau akses ditolak' });
        }

        console.log('[SUCCESS] Post status updated in DB');
        res.json({ success: true, message: 'Status diperbarui' });
    } catch (error) {
        console.error('[DATABASE ERROR]:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// --- Media ---
app.get('/api/media', async (req, res) => {
    try {
        const tid = getTenantId(req);
        const [rows] = await db.execute('SELECT * FROM media WHERE tenant_id = ?', [tid]);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.post('/api/media', upload.single('file'), async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
        
        const tid = getTenantId(req);
        const filename = req.file.filename; // Cloudinary public_id
        const file_url = req.file.path; // Cloudinary secure_url
        const file_type = req.file.mimetype;
        const uploaded_by = req.user?.userId || 1;

        const [result] = await db.execute(
            'INSERT INTO media (tenant_id, filename, file_url, file_type, uploaded_by) VALUES (?, ?, ?, ?, ?)',
            [tid, filename, file_url, file_type, uploaded_by]
        );

        res.status(201).json({ 
            message: 'Media synchronized with storage', 
            id: result.insertId,
            url: file_url 
        });
    } catch (error) {
        console.error('Upload Error:', error);
        res.status(500).json({ error: 'Storage synchronization failure' });
    }
});

app.delete('/api/media/:id', async (req, res) => {
    const { id } = req.params;
    const tid = getTenantId(req);
    try {
        // Find file identity first
        const [rows] = await db.execute('SELECT filename FROM media WHERE id = ? AND tenant_id = ?', [id, tid]);
        if (rows.length === 0) return res.status(404).json({ error: 'Resource not found or unauthorized' });
        
        const filename = rows[0].filename;

        // Physical Deletion from Cloudinary
        try {
            await cloudinary.uploader.destroy(filename);
        } catch(e) { 
            console.error('Cloudinary delete failed:', e); 
        }

        // Registry Deletion
        await db.execute('DELETE FROM media WHERE id = ? AND tenant_id = ?', [id, tid]);
        res.json({ message: 'Media asset successfully purged' });
    } catch (error) {
        console.error('Purge Error:', error);
        res.status(500).json({ error: 'Internal system purge failure' });
    }
});

// --- Users (Tenant Users) ---
app.get('/api/users', async (req, res) => {
    try {
        const tid = getTenantId(req);
        const [rows] = await db.execute(`
            SELECT u.id as user_id, u.name, u.email, tu.role 
            FROM tenant_users tu
            JOIN users u ON tu.user_id = u.id
            WHERE tu.tenant_id = ?
        `, [tid]);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.post('/api/users', async (req, res) => {
    const { user_id, role } = req.body;
    const tid = getTenantId(req);
    try {
        await db.execute(
            'INSERT INTO tenant_users (tenant_id, user_id, role) VALUES (?, ?, ?)',
            [tid, user_id, role || 'Guest']
        );
        res.status(201).json({ message: 'User added successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.delete('/api/users/:user_id', async (req, res) => {
    const { user_id } = req.params;
    const tid = getTenantId(req);
    try {
        await db.execute('DELETE FROM tenant_users WHERE user_id = ? AND tenant_id = ?', [user_id, tid]);
        res.json({ message: 'User removed successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// --- Export ---
app.get('/api/export/zip', async (req, res) => {
    try {
        const tid = getTenantId(req);
        if (!tid) return res.status(400).json({ error: 'No tenant assignment found for current user.' });

        console.log(`[EXPORT] Initiating full project ZIP export for tenant: ${tid}`);

        // 1. Fetch data
        const [settingsRows] = await db.execute('SELECT * FROM settings WHERE tenant_id = ?', [tid]);
        const [postsRows] = await db.execute('SELECT * FROM posts WHERE tenant_id = ? AND status = "published"', [tid]);
        const [pagesRows] = await db.execute('SELECT * FROM pages WHERE tenant_id = ? AND status = "published"', [tid]);

        if (settingsRows.length === 0) return res.status(404).json({ error: 'Settings not found.' });
        
        const settings = settingsRows[0];
        // Parse global_options if it's a string
        if (settings.global_options && typeof settings.global_options === 'string') {
            try { settings.global_options = JSON.parse(settings.global_options); } catch(e) {}
        }

        // Process pages and posts content
        const pages = pagesRows.map(p => {
            if (p.content && typeof p.content === 'string') {
                try { p.content = JSON.parse(p.content); } catch(e) {}
            }
            return p;
        });
        const posts = postsRows.map(p => {
            if (p.content && typeof p.content === 'string') {
                try { p.content = JSON.parse(p.content); } catch(e) {}
            }
            return p;
        });

        // 2. Prepare Headers
        res.attachment(`${settings.site_name.replace(/\s+/g, '_').toLowerCase()}-source.zip`);

        // 3. Initialize Archiver
        const archive = archiver('zip', { zlib: { level: 9 } });
        archive.pipe(res);

        // --- Task 1: Generate data.json ---
        const exportData = {
            settings,
            pages,
            posts,
            exported_at: new Date().toISOString()
        };
        archive.append(JSON.stringify(exportData, null, 2), { name: 'src/data.json' });

        // --- Task 2: Scaffolding Files ---
        const packageJson = {
            name: "exported-cms-site",
            private: true,
            version: "1.0.0",
            type: "module",
            scripts: {
                "dev": "vite",
                "build": "vite build",
                "preview": "vite preview"
            },
            dependencies: {
                "react": "^18.2.0",
                "react-dom": "^18.2.0",
                "react-router-dom": "^6.22.3",
                "lucide-react": "^0.344.0",
                "clsx": "^2.1.0",
                "tailwind-merge": "^2.2.1"
            },
            devDependencies: {
                "@types/react": "^18.2.66",
                "@types/react-dom": "^18.2.22",
                "@vitejs/plugin-react": "^4.2.1",
                "autoprefixer": "^10.4.18",
                "postcss": "^8.4.35",
                "tailwindcss": "^3.4.1",
                "typescript": "^5.2.2",
                "vite": "^5.2.2"
            }
        };
        archive.append(JSON.stringify(packageJson, null, 2), { name: 'package.json' });

        const viteConfig = `import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
})`;
        archive.append(viteConfig, { name: 'vite.config.ts' });

        const indexHtml = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${settings.site_name}</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>`;
        archive.append(indexHtml, { name: 'index.html' });

        const mainTsx = `import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)`;
        archive.append(mainTsx, { name: 'src/main.tsx' });

        const indexCss = `@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  font-family: Inter, system-ui, Avenir, Helvetica, Arial, sans-serif;
}

body {
  margin: 0;
  display: flex;
  place-content: center;
  min-width: 320px;
  min-height: 100vh;
}`;
        archive.append(indexCss, { name: 'src/index.css' });

        const appTsx = `import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import data from './data.json';
import Template from './templates/Template';

export default function App() {
  const { settings, pages, posts } = data;
  const themeColor = settings.global_options?.theme_color || '#fbbf24';
  const palette = settings.global_options?.branding_palette;
  const navPages = pages.filter(p => p.status === 'published');

  return (
    <BrowserRouter>
      <Routes>
        {pages.map(page => (
          <Route 
            key={page.id} 
            path={page.slug === 'home' ? '/' : \`/\${page.slug}\`} 
            element={
              <Template 
                pageData={page} 
                settings={settings} 
                posts={posts} 
                themeColor={themeColor} 
                palette={palette} 
                navPages={navPages}
                currentSlug={page.slug}
              />
            } 
          />
        ))}
        {posts.map(post => (
          <Route 
            key={post.id} 
            path={\`/post/\${post.slug}\`} 
            element={
              <Template 
                pageData={{}} 
                postData={post}
                settings={settings} 
                posts={posts} 
                themeColor={themeColor} 
                palette={palette} 
                navPages={navPages}
                currentSlug={post.slug}
              />
            } 
          />
        ))}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}`;
        archive.append(appTsx, { name: 'src/App.tsx' });

        // --- Task 3: Template & Component Injection ---
        const activeTemplate = settings.active_template || 'minimalist';
        const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);
        
        let templatePath = '';
        const possiblePaths = [
            path.join(__dirname, '..', 'src', 'templates', activeTemplate, `${capitalize(activeTemplate)}Template.tsx`),
            path.join(__dirname, '..', 'src', 'templates', `${capitalize(activeTemplate)}Template.tsx`)
        ];

        for (const p of possiblePaths) {
            if (fs.existsSync(p)) {
                templatePath = p;
                break;
            }
        }

        if (templatePath) {
            let templateContent = fs.readFileSync(templatePath, 'utf8');
            // Fix imports if depth changed
            if (templatePath.includes(`${path.sep}${activeTemplate}${path.sep}`)) {
                templateContent = templateContent.replace(/\.\.\/\.\.\/components\//g, '../components/');
            }
            archive.append(templateContent, { name: 'src/templates/Template.tsx' });
        } else {
            console.error(`[EXPORT] Template not found for: ${activeTemplate}`);
            // Fallback to a dummy or error page if template missing?
        }

        const componentPath = path.join(__dirname, '..', 'src', 'components', 'UnifiedPostLayout.tsx');
        if (fs.existsSync(componentPath)) {
            const componentContent = fs.readFileSync(componentPath, 'utf8');
            archive.append(componentContent, { name: 'src/components/UnifiedPostLayout.tsx' });
        }

        // --- Task 4: Public Assets ---
        if (settings.logo_url) {
            const logoFilename = path.basename(settings.logo_url);
            const logoFilePath = path.join(__dirname, 'uploads', logoFilename);
            if (fs.existsSync(logoFilePath)) {
                archive.file(logoFilePath, { name: `public/uploads/${logoFilename}` });
            }
        }

        // Finalize
        await archive.finalize();
        console.log(`[EXPORT] ZIP export completed for tenant: ${tid}`);

    } catch (error) {
        console.error('[EXPORT ERROR]:', error);
        if (!res.headersSent) {
            res.status(500).json({ error: 'Export failed', detail: error.message });
        }
    }
});



// --- Plugins ---
app.get('/api/plugins', async (req, res) => {
    try {
        const tid = getTenantId(req);
        const [rows] = await db.execute('SELECT * FROM plugins WHERE tenant_id = ?', [tid]);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.put('/api/plugins/:id', async (req, res) => {
    const { is_active } = req.body;
    const { id } = req.params;
    const tid = getTenantId(req);
    try {
        await db.execute(
            'UPDATE plugins SET is_active = ? WHERE id = ? AND tenant_id = ?',
            [is_active, id, tid]
        );
        res.json({ message: 'Plugin updated successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
    console.log('CORS enabled for dynamically configured origins');
});
