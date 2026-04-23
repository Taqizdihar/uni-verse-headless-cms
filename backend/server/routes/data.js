// =============================================================
// Public Data Routes — Content Delivery API
// =============================================================
// Serves published content to frontend consumers.
//   GET  /posts                       → Published posts
//   POST /posts/:post_id/comments     → Submit a comment
//   GET  /posts/:post_id/comments     → Approved comments
//   GET  /pages                       → Published pages
//   GET  /navigation                  → Navbar-visible pages
//   GET  /settings                    → Site identity & branding
//
// All routes are protected by the apiAuth middleware which
// validates the x-api-key header and resolves req.publicTenantId.
// =============================================================

const express = require('express');
const router = express.Router();
const db = require('../lib/db');
const apiAuth = require('../../middleware/apiAuth');

// Apply API-key authentication to all data routes
router.use(apiAuth);

// =============================================================
// Utility: Absolute Media URL Normalization
// =============================================================
// Ensures all relative media URLs (from uploads or local paths)
// are converted to fully-qualified absolute URLs using BASE_URL.
// Already-absolute URLs (http/https/data:) are passed through.
// =============================================================

const normalizeUrl = (url) => {
    if (!url || typeof url !== 'string') return url;
    if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:')) {
        return url;
    }
    const baseUrl = process.env.BASE_URL ? process.env.BASE_URL.replace(/\/$/, '') : '';
    const path = url.startsWith('/') ? url : `/${url}`;
    return `${baseUrl}${path}`;
};

// =============================================================
// Utility: Deep Content Image Normalization
// =============================================================
// Recursively traverses Block Builder JSON content and normalizes
// any keys containing 'image', 'url', or 'src' to absolute URLs.
// Handles both string and pre-parsed JSON content.
// =============================================================

const normalizeContentImages = (content) => {
    if (!content) return content;
    
    let parsed = content;
    if (typeof content === 'string') {
        try {
            parsed = JSON.parse(content);
        } catch (e) {
            return content;
        }
    }

    const traverse = (obj) => {
        if (Array.isArray(obj)) {
            for (let i = 0; i < obj.length; i++) {
                if (typeof obj[i] === 'object' && obj[i] !== null) traverse(obj[i]);
            }
        } else if (typeof obj === 'object' && obj !== null) {
            for (const key in obj) {
                if (Object.prototype.hasOwnProperty.call(obj, key)) {
                    if (
                       (key.includes('image') || key.includes('url') || key === 'src') 
                       && typeof obj[key] === 'string'
                    ) {
                        obj[key] = normalizeUrl(obj[key]);
                    } else if (typeof obj[key] === 'object' && obj[key] !== null) {
                        traverse(obj[key]);
                    }
                }
            }
        }
    };

    if (typeof parsed === 'object' && parsed !== null) {
        traverse(parsed);
    }
    
    return parsed;
};

// =============================================================
// GET /posts — Published posts with Dynamic Block content
// =============================================================
router.get('/posts', async (req, res) => {
    try {
        const tenantId = req.publicTenantId;
        const [posts] = await db.execute(
            "SELECT * FROM posts WHERE tenant_id = ? AND status = 'published' ORDER BY created_at DESC", 
            [tenantId]
        );
        
        const normalizedPosts = posts.map(post => {
            if (post.featured_image) {
                post.featured_image = normalizeUrl(post.featured_image);
            }
            if (post.content) {
                post.content = normalizeContentImages(post.content);
            }
            return post;
        });

        res.json(normalizedPosts);
    } catch (error) {
        console.error('[PUBLIC API ERROR] Get posts:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// =============================================================
// POST /posts/:post_id/comments — Submit a new comment
// =============================================================
// Inserts a comment with status 'pending' (requires moderation).
// Validates author_name, author_email, and content.
// =============================================================

router.post('/posts/:post_id/comments', async (req, res) => {
    try {
        const tenantId = req.publicTenantId;
        const { post_id } = req.params;
        const { author_name, author_email, content } = req.body;

        // Input validation
        if (!author_name || !author_name.trim()) {
            return res.status(400).json({ error: 'author_name is required.' });
        }
        if (!author_email || !author_email.trim()) {
            return res.status(400).json({ error: 'author_email is required.' });
        }
        if (!content || !content.trim()) {
            return res.status(400).json({ error: 'content is required.' });
        }

        // Basic email format check
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(author_email.trim())) {
            return res.status(400).json({ error: 'author_email format is invalid.' });
        }

        // Verify the post exists and belongs to this tenant
        const [posts] = await db.execute(
            'SELECT id FROM posts WHERE id = ? AND tenant_id = ?',
            [post_id, tenantId]
        );
        if (posts.length === 0) {
            return res.status(404).json({ error: 'Post not found.' });
        }

        const [result] = await db.execute(
            `INSERT INTO comments (post_id, tenant_id, author_name, author_email, content, status)
             VALUES (?, ?, ?, ?, ?, 'pending')`,
            [post_id, tenantId, author_name.trim(), author_email.trim(), content.trim()]
        );

        res.status(201).json({
            message: 'Comment submitted successfully. It will appear after moderation.',
            id: result.insertId
        });
    } catch (error) {
        console.error('[PUBLIC API ERROR] Submit comment:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// =============================================================
// GET /posts/:post_id/comments — Approved comments for a post
// =============================================================
// Returns only comments with status = 'approved', sorted by
// creation date ascending (oldest first, like a conversation).
// =============================================================

router.get('/posts/:post_id/comments', async (req, res) => {
    try {
        const tenantId = req.publicTenantId;
        const { post_id } = req.params;

        const [comments] = await db.execute(
            `SELECT id, author_name, content, created_at
             FROM comments
             WHERE post_id = ? AND tenant_id = ? AND status = 'approved'
             ORDER BY created_at ASC`,
            [post_id, tenantId]
        );

        res.json(comments);
    } catch (error) {
        console.error('[PUBLIC API ERROR] Get comments:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// =============================================================
// GET /pages — Published pages with slug filtering
// =============================================================
router.get('/pages', async (req, res) => {
    try {
        const tenantId = req.publicTenantId;
        const [pages] = await db.execute(
            "SELECT * FROM pages WHERE tenant_id = ? AND status = 'published'", 
            [tenantId]
        );
        
        const normalizedPages = pages.map(page => {
            if (page.featured_image) {
                page.featured_image = normalizeUrl(page.featured_image);
            }
            if (page.content) {
                page.content = normalizeContentImages(page.content);
            }
            return page;
        });

        res.json(normalizedPages);
    } catch (error) {
        console.error('[PUBLIC API ERROR] Get pages:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// =============================================================
// GET /navigation — Pages visible in the navbar
// =============================================================
// Returns title and slug for pages where is_in_navbar = 1 and
// status = 'published'. Used to render the site's header nav.
// =============================================================

router.get('/navigation', async (req, res) => {
    try {
        const tenantId = req.publicTenantId;
        const [navItems] = await db.execute(
            `SELECT title, slug
             FROM pages
             WHERE tenant_id = ? AND is_in_navbar = 1 AND status = 'published'
             ORDER BY priority ASC`,
            [tenantId]
        );


        res.json(navItems);
    } catch (error) {
        console.error('[PUBLIC API ERROR] Get navigation:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// =============================================================
// GET /settings — Site identity, branding & footer configuration
// =============================================================
router.get('/settings', async (req, res) => {
    try {
        const tenantId = req.publicTenantId;
        const [settingsRows] = await db.execute(
            "SELECT site_name as title, tagline, logo_url, global_options FROM settings WHERE tenant_id = ? LIMIT 1",
            [tenantId]
        );

        if (settingsRows.length === 0) {
            return res.status(404).json({ error: 'Settings not found for this tenant' });
        }

        const row = settingsRows[0];
        let globalOptions = {};
        if (row.global_options) {
            try { 
                globalOptions = typeof row.global_options === 'string' ? JSON.parse(row.global_options) : row.global_options; 
            } catch (e) {
                console.error('[PUBLIC API] Failed to parse global_options:', e);
            }
        }

        const settings = {
            // Header Branding
            site_name: row.title,
            title: row.title,
            tagline: row.tagline,
            logo_url: row.logo_url ? normalizeUrl(row.logo_url) : null,
            // Frontend
            frontend_url: globalOptions.frontend_url || '',
            // Footer
            copyright_text: globalOptions.footer_config?.copyright_text || '',
            social_links: globalOptions.footer_config?.social_links || []
        };

        res.json(settings);
    } catch (error) {
        console.error('[PUBLIC API ERROR] Get settings:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
