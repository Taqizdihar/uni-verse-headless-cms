const db = require('../db');

const apiAuth = async (req, res, next) => {
    const apiKey = req.headers['x-api-key'];

    if (!apiKey) {
        return res.status(401).json({ error: 'x-api-key header is missing' });
    }

    try {
        const [keys] = await db.execute('SELECT tenant_id FROM api_keys WHERE api_key = ? LIMIT 1', [apiKey]);
        
        if (keys.length === 0) {
            return res.status(401).json({ error: 'Invalid API Key' });
        }

        req.publicTenantId = keys[0].tenant_id;
        next();
    } catch (error) {
        console.error('[API AUTH ERROR]:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

module.exports = apiAuth;
