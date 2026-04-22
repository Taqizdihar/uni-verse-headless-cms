const express = require('express');
const router = express.Router();
const db = require('../db');
const apiAuth = require('../middleware/apiAuth');

// Apply middleware to all routes in this router
router.use(apiAuth);

const normalizeUrl = (url) => {
    if (!url || typeof url !== 'string') return url;
    if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:')) {
        return url;
    }
    const baseUrl = process.env.BASE_URL ? process.env.BASE_URL.replace(/\/$/, '') : '';
    const path = url.startsWith('/') ? url : `/${url}`;
    return `${baseUrl}${path}`;
};

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

// GET /api/v1/public/posts
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

// GET /api/v1/public/pages
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

// GET /api/v1/public/settings
router.get('/settings', async (req, res) => {
    try {
        const tenantId = req.publicTenantId;
        const [settingsRows] = await db.execute(
            "SELECT site_name as title, tagline, logo_url FROM settings WHERE tenant_id = ? LIMIT 1",
            [tenantId]
        );

        if (settingsRows.length === 0) {
            return res.status(404).json({ error: 'Settings not found for this tenant' });
        }

        const settings = settingsRows[0];
        if (settings.logo_url) {
            settings.logo_url = normalizeUrl(settings.logo_url);
        }

        res.json(settings);
    } catch (error) {
        console.error('[PUBLIC API ERROR] Get settings:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
