const express = require('express');
const archiver = require('archiver');

const cors = require('cors');
require('dotenv').config();
const JWT_SECRET = process.env.JWT_SECRET || 'uni-inside-secret-key-2026';
if (!process.env.JWT_SECRET) {
    console.warn('[WARNING] JWT_SECRET is not defined in environment variables. Using fallback key for development.');
}
const db = require('./server/lib/db');
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

app.use((req, res, next) => {
  const origin = req.headers.origin;

  // Allow any origin for testing purposes
  res.setHeader('Access-Control-Allow-Origin', origin || '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, x-api-key');
  res.setHeader('Access-Control-Expose-Headers', 'Content-Disposition');
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  console.log('CORS Bypass active for:', req.method, req.url);

  // Immediate response for Preflight (OPTIONS)
  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  next();
});

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
            `SELECT p.*, s.site_name, s.tagline, s.global_options, s.logo_url
             FROM pages p
             LEFT JOIN settings s ON p.tenant_id = s.tenant_id
             WHERE p.slug = ? AND p.tenant_id = ?
             LIMIT 1`,
            [cleanSlug, tenantId]
        );

        if (pages.length > 0) {
            const row = pages[0];
            const [navPages] = await db.execute(
                "SELECT title, slug FROM pages WHERE tenant_id = ? AND status = 'published' ORDER BY id ASC",
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
                settings: { site_name: row.site_name || 'Uni-Inside', tagline: row.tagline || '', logo_url: row.logo_url || null, global_options: globalOptions },
                navPages
            });
        }

        // Post lookup (if no page matches)
        const [posts] = await db.execute(
            `SELECT p.*, s.site_name, s.tagline, s.global_options, s.logo_url
             FROM posts p
             LEFT JOIN settings s ON p.tenant_id = s.tenant_id
             WHERE p.slug = ? AND p.tenant_id = ?
             LIMIT 1`,
            [cleanSlug, tenantId]
        );

        if (posts.length > 0) {
            const row = posts[0];
            const [navPages] = await db.execute(
                "SELECT title, slug FROM pages WHERE tenant_id = ? AND status = 'published' ORDER BY id ASC",
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
                settings: { site_name: row.site_name || 'Uni-Inside', tagline: row.tagline || '', logo_url: row.logo_url || null, global_options: globalOptions },
                navPages
            });
        }

        res.status(404).json({ error: `Not found: ${cleanSlug} for site ${subdomain}` });
    } catch (error) {
        console.error('[PREVIEW ERROR] Database failure during site resolution:', error);
        res.status(500).json({ error: 'Data resolution failure', details: error.message });
    }
});

app.get('/api/public/updates', async (req, res) => {
    try {
        // Task 1: Identify and Sanitize Parameters
        const tenantIdVal = req.query.tenant_id;
        let safeTenantId = parseInt(tenantIdVal, 10);
        if (isNaN(safeTenantId)) {
            safeTenantId = null;
        }

        const limitVal = req.query.limit;
        let safeLimit = parseInt(limitVal, 10);
        if (isNaN(safeLimit) || safeLimit <= 0) {
            safeLimit = 10;
        }

        // Task 2: Defensive Query Construction
        let query = 'SELECT * FROM update_history';
        const params = [];

        query += ` ORDER BY update_date DESC LIMIT ${safeLimit}`;

        const [updates] = await db.execute(query, params);
        
        // Task 3: Response Integrity (Ensure [] if empty)
        if (!updates || updates.length === 0) {
            return res.json([]);
        }

        // Fetch images for each update
        const updatesWithImages = await Promise.all(updates.map(async (update) => {
            // DEFENSIVE FIX: Ensure update_id is never undefined
            // We check both 'id' and 'update_id' column possibilities
            const currentId = update.id || update.id_update || 0;
            
            const [images] = await db.execute(
                'SELECT image_url FROM update_images WHERE update_id = ?', 
                [currentId || null]
            );

            return {
                id: currentId,
                title: update.update_title || '',
                description: update.update_description || '',
                version: update.update_version || '',
                created_at: update.update_date || null,
                images: Array.isArray(images) ? images.map(img => img.image_url) : []
            };
        }));

        res.json(updatesWithImages);
    } catch (error) {
        console.error('[API ERROR] Get public updates:', error);
        res.status(500).json({ error: 'Internal Server Error', detail: error.message });
    }
});


// Auth Middleware
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Unauthorized' });

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ error: 'Forbidden' });
        req.user = user;
        next();
    });
};

// Super Admin Middleware (Strict check for user_id === 1)
const verifySuperAdmin = (req, res, next) => {
    if (req.user && req.user.userId === 1) {
        return next();
    }
    return res.status(403).json({ error: 'Access Denied: Super Admin privileges required.' });
};

// =============================================================
// ★ SUPER ADMIN PRIVILEGED ROUTES ★
// =============================================================
app.get('/api/super-admin/stats', authenticateToken, verifySuperAdmin, async (req, res) => {
    try {
        const [userCount] = await db.execute('SELECT COUNT(*) as total FROM users');
        const [tenantCount] = await db.execute('SELECT COUNT(*) as total FROM tenants');
        res.json({
            totalUsers: userCount[0].total,
            totalTenants: tenantCount[0].total
        });
    } catch (error) {
        console.error('[SUPER ADMIN ERROR] Stats fetch failed:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.post('/api/super-admin/updates', authenticateToken, verifySuperAdmin, async (req, res) => {
    // 1. Explicit destructuring
    const { title, description, version, update_date, update_images, images } = req.body;
    
    // Support both 'images' and 'update_images' from frontend just in case
    const imageArray = update_images || images || [];

    // Step 1: Strict Validation of Mandatory Fields
    if (!title || !description || !version || !update_date) {
        return res.status(400).json({ error: 'Title, description, version, and update_date are required.' });
    }

    // The Filter: Create a New Object specifically for the first query containing ONLY the 4 fields
    const filteredUpdateData = {
        title: title,
        description: description,
        version: version,
        created_at: update_date
    };

    // Verification: Log the filtered object
    console.log('[SUPER ADMIN] Filtered Data for update_history insert:', filteredUpdateData);

    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();

        // Step 2: Main Data Insertion into update_history (using the explicit mapped values from our filtered object)
        const [historyResult] = await connection.execute(
            'INSERT INTO update_history (update_title, update_description, update_version, update_date) VALUES (?, ?, ?, ?)',
            [filteredUpdateData.title, filteredUpdateData.description, filteredUpdateData.version, filteredUpdateData.created_at]
        );
        
        const updateId = historyResult.insertId;

        // Step 3: Conditional Images Data Insertion
        if (imageArray && Array.isArray(imageArray) && imageArray.length > 0) {
            const placeholders = imageArray.map(() => '(?, ?)').join(', ');
            const flattenedParameters = [];
            imageArray.forEach(url => {
                flattenedParameters.push(updateId, url);
            });

            await connection.execute(
                `INSERT INTO update_images (update_id, image_url) VALUES ${placeholders}`,
                flattenedParameters
            );
        }

        await connection.commit();
        res.status(201).json({ message: 'Update history and images recorded successfully', updateId });
    } catch (error) {
        await connection.rollback();
        console.error('[SUPER ADMIN ERROR] Transactional history write failed:', error);
        res.status(500).json({ error: 'Internal Server Error', detail: error.message });
    } finally {
        connection.release();
    }
});


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
        
        console.log(`[AUTH] Generating placeholder tenant`);
        const subdomain = 'tenant-' + Date.now();
        const [tenant] = await db.execute('INSERT INTO tenants (name, subdomain) VALUES (?, ?)', ['My Site', subdomain]);
        const tenantId = tenant.insertId;

        console.log(`[AUTH] Hashing password for: ${email}`);
        const hashedPassword = await bcrypt.hash(password, 10);
        console.log(`[AUTH] Inserting user into database: ${email}`);
        const [result] = await db.execute(
            'INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)',
            [name, email, hashedPassword]
        );
        const userId = result.insertId;

        console.log(`[AUTH] Linking user and tenant`);
        await db.execute('INSERT INTO tenant_users (tenant_id, user_id, role) VALUES (?, ?, ?)', [tenantId, userId, 'admin']);

        // Task 1: Auto-generate API Key for new tenant
        const crypto = require('crypto');
        const apiKey = 'uni_' + crypto.randomBytes(24).toString('hex');
        await db.execute('INSERT INTO api_keys (tenant_id, api_key) VALUES (?, ?)', [tenantId, apiKey]);

        // Create default settings registry
        await db.execute(
            'INSERT INTO settings (tenant_id, site_name, tagline, logo_url, global_options) VALUES (?, ?, ?, ?, ?)',
            [tenantId, 'My Site', '', null, JSON.stringify({
                copyright_text: `© ${new Date().getFullYear()} My Site. All rights reserved.`,
                social_links: [],
                frontend_url: ''
            })]
        );

        const token = jwt.sign({ userId, email, tenant_id: tenantId, role: 'admin' }, JWT_SECRET, { expiresIn: '1d' });

        res.status(201).json({ 
            message: 'Success', 
            token,
            tenant_id: tenantId,
            user: { id: userId, name, email, tenant_id: tenantId, role: 'admin', site_name: 'My Site' } 
        });
    } catch (error) {
        console.error('DATABASE ERROR:', error);
        res.status(500).json({ error: error.message || 'Internal Server Error' });
    }
});

app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body || {};
        
        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        console.log(`[AUTH] Login attempt for email: ${email}`);

        // 1. Search for user by email
        const [users] = await db.execute('SELECT id, name, email, profile_picture_url, password_hash FROM users WHERE email = ?', [email]);
        
        if (!users || users.length === 0) {
            console.log(`[AUTH] Login failed: User ${email} not found`);
            return res.status(401).json({ error: 'Kredensial tidak valid' });
        }
        
        const user = users[0];

        // 2. Compare password with hashed version from DB
        const validPassword = await bcrypt.compare(password, user.password_hash);
        if (!validPassword) {
            console.log(`[AUTH] Login failed: Invalid password for ${email}`);
            return res.status(401).json({ error: 'Kredensial tidak valid' });
        }
        
        // 3. Retrieve tenant_id and role from tenant_users
        const [tenantUsers] = await db.execute('SELECT tenant_id, role FROM tenant_users WHERE user_id = ?', [user.id]);
        const tenant_id = tenantUsers.length > 0 ? tenantUsers[0].tenant_id : null;
        const role = tenantUsers.length > 0 ? tenantUsers[0].role : null;

        // 4. Fetch site_name for frontend redirection logic
        let site_name = 'My Site';
        if (tenant_id) {
            const [settings] = await db.execute('SELECT site_name FROM settings WHERE tenant_id = ?', [tenant_id]);
            if (settings && settings.length > 0) {
                site_name = settings[0].site_name;
            }
        }

        const token = jwt.sign({ userId: user.id, email: user.email, tenant_id, role }, JWT_SECRET, { expiresIn: '1d' });
        
        console.log(`[AUTH] Login successful for ${email}. Tenant: ${tenant_id || 'NONE'}`);

        // 5. Response Payload: return token, user object, and top-level tenant_id
        res.json({ 
            token, 
            user: { 
                id: user.id, 
                name: user.name, 
                email: user.email, 
                profile_picture_url: user.profile_picture_url,
                tenant_id, 
                role, 
                site_name 
            },
            tenant_id 
        });

    } catch (error) {
        console.error('[AUTH CRITICAL ERROR] Login logic failure:', error);
        // Ensure we send a proper JSON response to prevent CORS issues on client browser
        if (!res.headersSent) {
            res.status(500).json({ error: 'Internal Server Error', details: error.message });
        }
    }
});


app.post('/api/auth/setup', authenticateToken, async (req, res) => {
    const { site_name, tagline, subdomain } = req.body;
    const userId = req.user.userId;
    const tenantId = req.user.tenant_id;
    try {
        console.log(`[AUTH] Setting up tenant for User ID: ${userId}, Site Name: ${site_name}`);
        if (!tenantId) return res.status(400).json({ error: 'Tenant context is missing.' });

        // Generate Subdomain automatically from Site Name
        const generatedSubdomain = site_name
            .toLowerCase()
            .trim()
            .replace(/[^\w\s-]/g, '')
            .replace(/[\s_]+/g, '-')
            .replace(/^-+|-+$/g, '') || `site-${Date.now()}`;

        // Validation for uniqueness (excluding self)
        const [existing] = await db.execute('SELECT * FROM tenants WHERE subdomain = ? AND id != ?', [generatedSubdomain, tenantId]);
        if (existing.length > 0) {
            console.log(`[AUTH] Setup failed: Generated subdomain ${generatedSubdomain} already exists`);
            return res.status(400).json({ error: 'Nama website sudah digunakan. Silakan pilih nama lain.' });
        }

        // a. Update tenant
        await db.execute('UPDATE tenants SET name = ?, subdomain = ? WHERE id = ?', [site_name, generatedSubdomain, tenantId]);

        // b. Update settings
        await db.execute(
            'UPDATE settings SET site_name = ?, tagline = ? WHERE tenant_id = ?',
            [site_name, tagline, tenantId]
        );

        // Sign fresh token
        const token = jwt.sign({ userId, email: req.user.email, tenant_id: tenantId, role: 'admin' }, JWT_SECRET, { expiresIn: '1d' });
        
        console.log(`[AUTH] Setup finalized. Tenant ID: ${tenantId}, Subdomain: ${generatedSubdomain}`);
        res.status(200).json({ 
            message: 'Setup completed', 
            token, 
            user: { id: userId, email: req.user.email, tenant_id: tenantId, role: 'admin', site_name: site_name } 
        });
    } catch (error) {
        console.error('[AUTH ERROR] Setup Transaction Failure:', error);
        res.status(500).json({ error: error.message || 'Internal Server Error' });
    }
});

app.get('/', (req, res) => res.send('Server is running'));

// ========================================================
// PUBLIC V1 API GATEWAY — Content Delivery (Data Routes)
// ========================================================
const dataRoutes = require('./server/routes/data');
app.use('/api/v1/public', dataRoutes);

// ========================================================
// HEALTH CHECK ENDPOINT (Public — no auth required)
// ========================================================
const healthRoutes = require('./server/routes/health');
app.use('/api/v1/health', healthRoutes);

// ========================================================
// PROTECTED ROUTES BELOW
// ========================================================
app.use('/api', authenticateToken);

// Override the hardcoded tenant_id = 1 dynamically based on req.user.tenant_id
const getTenantId = (req) => req.user.tenant_id;

// ========================================================
// AUTH & API KEY MANAGEMENT (Protected — JWT required)
// ========================================================
const { router: authRoutes } = require('./server/routes/auth');
app.use('/api/settings', authRoutes);

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

app.put(['/api/settings', '/api/site-settings/:tenantId'], async (req, res) => {
    const { 
        site_name, tagline, 
        support_email, 
        logo_url, footer_config, frontend_url 
    } = req.body;
    // Prefer explicitly passed param, otherwise fallback to jwt
    const tid = req.params.tenantId ? parseInt(req.params.tenantId) : getTenantId(req);
    try {
        const globalOptions = JSON.stringify({
            support_email: support_email || '',
            footer_config: footer_config || null,
            frontend_url: frontend_url || ''
        });

        await db.execute(
            'UPDATE settings SET site_name = ?, tagline = ?, logo_url = ?, global_options = ? WHERE tenant_id = ?',
            [site_name, tagline, logo_url || null, globalOptions, tid]
        );
        res.json({ message: 'Configuration synchronized successfully' });
    } catch (error) {
        console.error('[API ERROR] Update Settings:', error);
        res.status(500).json({ error: 'Registry write failure' });
    }
});

// --- API Keys → Moved to server/routes/auth.js ---

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
    const { title, slug, content, status } = req.body;
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
            'INSERT INTO pages (tenant_id, title, slug, content, status) VALUES (?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE title = VALUES(title), content = VALUES(content)',
            [tid, title.trim(), finalSlug, jsonContent, status || 'published']
        );

        const pageId = result.insertId;

        // 2. Layout Sync
        await db.execute(
            "INSERT IGNORE INTO layouts (tenant_id, page_identifier, blocks_order) VALUES (?, ?, '[]')",
            [tid, 'index']
        );

        res.status(201).json({ message: 'Page saved successfully', id: pageId });
    } catch (error) {
        console.error('Save Page Error:', error);
        res.status(500).json({ error: 'Internal Server Error', detail: error.message });
    }
});

app.put('/api/pages/:id', async (req, res) => {
    const { title, slug, content } = req.body;
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
            'UPDATE pages SET title = ?, slug = ?, content = ? WHERE id = ? AND tenant_id = ?',
            [title.trim(), finalSlug, jsonContent, id, tid]
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

    // Mandatory Validation: strictly allow only published or draft
    if (status !== 'published' && status !== 'draft') {
        return res.status(400).json({ error: 'Invalid status. Must be strictly "published" or "draft".' });
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
            [tid, title, slug, jsonContent, excerpt || '', category || 'Berita', status || 'published']
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
            [title, slug, jsonContent, excerpt || '', category || 'Berita', status || 'published', id, tid]
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
    const validStatuses = ['published', 'draft'];
    const finalStatus = validStatuses.includes(status) ? status : 'draft';

    try {
        console.log(`[REQUEST] Incoming Status Toggle for Post ID: ${id} -> ${finalStatus} (tenant: ${tid})`);
        
        // Ensure the SQL query uses single quotes for string values as requested
        const [result] = await db.execute(`UPDATE posts SET status = '${finalStatus}' WHERE id = ? AND tenant_id = ?`, [id, tid]);
        
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
            'INSERT INTO media (tenant_id, filename, file_url, file_type, uploaded_by, file_name) VALUES (?, ?, ?, ?, ?, ?)',
            [tid, filename, file_url, file_type, uploaded_by, filename]
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

app.patch('/api/media/:id', async (req, res) => {
    const { id } = req.params;
    const { file_name } = req.body;
    const tid = getTenantId(req);

    if (!file_name) return res.status(400).json({ error: 'file_name is required' });

    try {
        const [result] = await db.execute(
            'UPDATE media SET file_name = ? WHERE id = ? AND tenant_id = ?',
            [file_name, id, tid]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Media not found or unauthorized' });
        }

        res.json({ message: 'Media renamed successfully' });
    } catch (error) {
        console.error('Rename Error:', error);
        res.status(500).json({ error: 'Internal system rename failure' });
    }
});

// --- Dashboard ---
app.get('/api/dashboard/stats', async (req, res) => {
    try {
        const [rows] = await db.execute('SELECT COUNT(*) as total FROM users');
        res.json({ totalUsers: rows[0].total });
    } catch (error) {
        console.error('[API ERROR] Get Dashboard Stats:', error);
        res.status(500).json({ error: 'Internal Server Error' });
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

// --- Profile ---
app.get('/api/user/profile', async (req, res) => {
    try {
        const userId = req.user.userId;
        const [rows] = await db.execute('SELECT name, email, profile_picture_url FROM users WHERE id = ?', [userId]);
        if (rows.length === 0) return res.status(404).json({ error: 'User not found' });
        res.json(rows[0]);
    } catch (error) {
        console.error('[PROFILE ERROR] Get profile:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.put('/api/user/profile', async (req, res) => {
    const { name, email } = req.body;
    const userId = req.user.userId;
    try {
        await db.execute('UPDATE users SET name = ?, email = ? WHERE id = ?', [name, email, userId]);
        res.json({ message: 'Profil diperbarui' });
    } catch (error) {
        console.error('[PROFILE ERROR] Update profile:', error);
        res.status(500).json({ error: 'Gagal memperbarui profil' });
    }
});

app.post('/api/user/upload-avatar', upload.single('avatar'), async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ error: 'Tidak ada file yang diunggah' });
        const avatarUrl = req.file.path; // Cloudinary secure_url
        const userId = req.user.userId;
        await db.execute('UPDATE users SET profile_picture_url = ? WHERE id = ?', [avatarUrl, userId]);
        res.json({ url: avatarUrl });
    } catch (error) {
        console.error('[PROFILE ERROR] Upload avatar:', error);
        res.status(500).json({ error: 'Gagal mengunggah foto profil' });
    }
});

app.put('/api/user/change-password', async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.userId;
    try {
        const [users] = await db.execute('SELECT password_hash FROM users WHERE id = ?', [userId]);
        if (users.length === 0) return res.status(404).json({ error: 'Pengguna tidak ditemukan' });
        
        const validPassword = await bcrypt.compare(currentPassword, users[0].password_hash);
        if (!validPassword) return res.status(400).json({ error: 'Kata sandi saat ini salah' });
        
        const hashedNewPassword = await bcrypt.hash(newPassword, 10);
        await db.execute('UPDATE users SET password_hash = ? WHERE id = ?', [hashedNewPassword, userId]);
        res.json({ message: 'Kata sandi berhasil diubah' });
    } catch (error) {
        console.error('[PROFILE ERROR] Change password:', error);
        res.status(500).json({ error: 'Gagal mengubah kata sandi' });
    }
});

// --- Export ---
app.get('/api/export/zip', async (req, res) => {
    try {
        const tid = getTenantId(req);
        if (!tid) return res.status(400).json({ error: 'No tenant assignment found for current user.' });

        console.log(`[EXPORT] Initiating full project ZIP export for tenant: ${tid}`);

        const https = require('https');
        const http = require('http');
        const path = require('path');
        const fs = require('fs');

        const fetchImage = (url) => {
            return new Promise((resolve) => {
                if (!url) return resolve(null);
                const client = url.startsWith('https') ? https : http;
                client.get(url, (response) => {
                    if (response.statusCode === 200) {
                        const data = [];
                        response.on('data', (chunk) => data.push(chunk));
                        response.on('end', () => resolve(Buffer.concat(data)));
                    } else {
                        resolve(null);
                    }
                }).on('error', () => resolve(null));
            });
        };

        const archive = archiver('zip', { zlib: { level: 9 } });

        const downloadAndProcessImage = async (url) => {
            if (!url) return null;
            try {
                let filename = `image_${Date.now()}.png`;
                if (url.startsWith('http')) {
                    filename = path.basename(new URL(url).pathname);
                } else if (url.startsWith('/uploads') || url.startsWith('uploads/')) {
                    filename = path.basename(url);
                }
                if (!filename || filename === '') filename = `image_${Date.now()}.png`;

                let buffer = null;
                if (url.startsWith('http')) {
                    buffer = await fetchImage(url);
                } else {
                    const localPath = path.join(__dirname, 'uploads', filename);
                    if (fs.existsSync(localPath)) {
                        buffer = fs.readFileSync(localPath);
                    }
                }
                if (buffer) {
                    archive.append(buffer, { name: `public/assets/media/${filename}` });
                    return `./assets/media/${filename}`;
                }
            } catch (e) {
                console.error(`[EXPORT] Error processing image: ${url}`, e);
            }
            return url;
        };

        // 1. Fetch data
        const [tenantRows] = await db.execute('SELECT name FROM tenants WHERE id = ?', [tid]);
        const tenantName = tenantRows[0]?.name || 'Site';

        const [settingsRows] = await db.execute('SELECT * FROM settings WHERE tenant_id = ?', [tid]);
        const [postsRows] = await db.execute("SELECT * FROM posts WHERE tenant_id = ? AND status = 'published'", [tid]);
        const [pagesRows] = await db.execute("SELECT * FROM pages WHERE tenant_id = ? AND status = 'published'", [tid]);

        if (settingsRows.length === 0) return res.status(404).json({ error: 'Settings not found.' });
        
        const settings = settingsRows[0];
        if (settings.global_options && typeof settings.global_options === 'string') {
            try { settings.global_options = JSON.parse(settings.global_options); } catch(e) {}
        }

        // Process Settings Logo
        if (settings.logo_url) {
            settings.logo_url = await downloadAndProcessImage(settings.logo_url) || settings.logo_url;
        }

        // Process pages and posts content
        const pages = [];
        for (const p of pagesRows) {
            if (p.content && typeof p.content === 'string') {
                try { p.content = JSON.parse(p.content); } catch(e) {}
            }
            if (p.content?.hero_image) {
                p.content.hero_image = await downloadAndProcessImage(p.content.hero_image) || p.content.hero_image;
            }
            if (p.content?.featured_image) {
                p.content.featured_image = await downloadAndProcessImage(p.content.featured_image) || p.content.featured_image;
            }
            if (p.content?.main_image) {
                p.content.main_image = await downloadAndProcessImage(p.content.main_image) || p.content.main_image;
            }
            pages.push(p);
        }

        const posts = [];
        for (const p of postsRows) {
            if (p.content && typeof p.content === 'string') {
                try { p.content = JSON.parse(p.content); } catch(e) {}
            }
            if (p.content?.featured_image) {
            p.content.featured_image = await downloadAndProcessImage(p.content.featured_image) || p.content.featured_image;
            }
            if (p.content?.main_image) {
                p.content.main_image = await downloadAndProcessImage(p.content.main_image) || p.content.main_image;
            }
            posts.push(p);
        }

        // 2. Prepare Headers
        const safeName = tenantName.replace(/[^\w\s-]/g, '').trim().replace(/\s+/g, '-');
        res.setHeader('Content-Disposition', 'attachment; filename="' + safeName + '.zip"');

        // 3. Initialize Archiver
        archive.pipe(res);

        // --- Task 1: Generate Modular data/ ---
        const navPages = pages.map(p => ({ title: p.title, slug: p.slug }));
        const settingsData = {
            settings,
            navPages,
            exported_at: new Date().toISOString()
        };
        
        archive.append(JSON.stringify(settingsData, null, 2), { name: 'src/data/config/settings.json' });

        // Export each page
        pages.forEach(page => {
            archive.append(JSON.stringify(page, null, 2), { name: `src/data/pages/${page.slug}.json` });
        });

        // Export each post
        posts.forEach(post => {
            archive.append(JSON.stringify(post, null, 2), { name: `src/data/posts/${post.slug}.json` });
        });

        // Add a helper for posts metadata (for the blog list)
        const postsMetadata = posts.map(p => ({
            id: p.id,
            title: p.title,
            slug: p.slug,
            category: p.category,
            excerpt: p.excerpt,
            created_at: p.created_at
        }));
        archive.append(JSON.stringify(postsMetadata, null, 2), { name: 'src/data/config/posts.json' });

        // --- Task 2: Scaffolding Files ---
        const packageJson = {
            name: safeName.toLowerCase(),
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
                "framer-motion": "^11.0.8",
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

        const readmeMd = `# ${settings.site_name}
        
## Local Development
1. \`npm install\`
2. \`npm run dev\`

## Hosting / Production
1. \`npm run build\`
2. Deploy the \`dist\` folder.
`;
        archive.append(readmeMd, { name: 'README.md' });

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
}

.rich-text-content {
  font-family: inherit;
}`;
        archive.append(indexCss, { name: 'src/index.css' });

        const appTsx = `import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useParams } from 'react-router-dom';
import settingsData from './data/config/settings.json';
import postsList from './data/config/posts.json';
import Template from './templates/Template';

function PageLoader() {
  const { slug = 'home' } = useParams();
  const [data, setData] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    setData(null);
    setError(false);
    
    import(\`./data/pages/\${slug}.json\`)
      .then(m => setData(m.default))
      .catch((err) => {
        console.error('Failed to load page:', err);
        setError(true);
      });
  }, [slug]);

  if (error) return <Navigate to="/" replace />;
  if (!data) return <div className="flex items-center justify-center min-h-screen">Loading...</div>;

  const { settings, navPages } = settingsData;
  const themeColor = settings.global_options?.theme_color || '#fbbf24';
  const palette = settings.global_options?.branding_palette;

  return (
    <Template 
      pageData={data} 
      settings={settings} 
      posts={postsList} 
      themeColor={themeColor} 
      palette={palette} 
      navPages={navPages}
      currentSlug={slug}
    />
  );
}

function PostLoader() {
  const { slug } = useParams();
  const [data, setData] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    setData(null);
    setError(false);
    
    import(\`./data/posts/\${slug}.json\`)
      .then(m => setData(m.default))
      .catch(() => setError(true));
  }, [slug]);

  if (error) return <Navigate to="/" replace />;
  if (!data) return <div className="flex items-center justify-center min-h-screen">Loading...</div>;

  const { settings, navPages } = settingsData;
  const themeColor = settings.global_options?.theme_color || '#fbbf24';
  const palette = settings.global_options?.branding_palette;

  return (
    <Template 
      pageData={{}} 
      postData={data}
      settings={settings} 
      posts={postsList} 
      themeColor={themeColor} 
      palette={palette} 
      navPages={navPages}
      currentSlug={slug}
    />
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PageLoader />} />
        <Route path="/:slug" element={<PageLoader />} />
        <Route path="/post/:slug" element={<PostLoader />} />
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
                templateContent = templateContent.split('../../../components/').join('../components/');
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

// Catch-All for 404
app.use((req, res) => {
    console.log('404 Route Not Found:', req.url);
    res.status(404).send('Route not found');
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, '0.0.0.0', async () => {
    console.log(`Server running on port ${PORT}`);
    
    // Auto-migration for user profile field
    try {
        const [columns] = await db.execute("SHOW COLUMNS FROM users LIKE 'profile_picture_url'");
        if (columns.length === 0) {
            console.log('[MIGRATION] Adding profile_picture_url to users table...');
            await db.execute('ALTER TABLE users ADD COLUMN `profile_picture_url` VARCHAR(255) DEFAULT NULL');
        }
    } catch (e) {
        console.warn('[MIGRATION ERROR] Could not verify/add profile_picture_url column:', e.message);
    }

    // Auto-migration for media display name field
    try {
        const [columns] = await db.execute("SHOW COLUMNS FROM media LIKE 'file_name'");
        if (columns.length === 0) {
            console.log('[MIGRATION] Adding file_name to media table...');
            await db.execute('ALTER TABLE media ADD COLUMN `file_name` VARCHAR(255) DEFAULT NULL');
            // Backfill: Set file_name equal to filename for all existing entries
            await db.execute('UPDATE media SET `file_name` = filename WHERE `file_name` IS NULL');
        }
    } catch (e) {
        console.warn('[MIGRATION ERROR] Could not verify/add file_name column to media:', e.message);
    }
});
