const db = require('../server/lib/db');

async function logActivity(tenantId, userId, actorName, actorRole, action, status) {
    try {
        if (!tenantId) return;

        // Ensure table exists just in case
        await db.execute(`
            CREATE TABLE IF NOT EXISTS activity_logs (
                id INT AUTO_INCREMENT PRIMARY KEY,
                tenant_id INT NOT NULL,
                user_id INT,
                actor_name VARCHAR(255),
                actor_role VARCHAR(50),
                action VARCHAR(255),
                status VARCHAR(50),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                INDEX (tenant_id)
            )
        `);

        await db.execute(
            'INSERT INTO activity_logs (tenant_id, user_id, actor_name, actor_role, action, status) VALUES (?, ?, ?, ?, ?, ?)',
            [tenantId, userId, actorName, actorRole, action, status]
        );
    } catch (error) {
        console.error('[LOGGER ERROR] Failed to insert activity log:', error);
    }
}

module.exports = { logActivity };
