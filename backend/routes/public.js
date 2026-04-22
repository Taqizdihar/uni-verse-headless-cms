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
            title: row.title,
            tagline: row.tagline,
            logo_url: row.logo_url ? normalizeUrl(row.logo_url) : null,
            frontend_url: globalOptions.frontend_url || '',
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
