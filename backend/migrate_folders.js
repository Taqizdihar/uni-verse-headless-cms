const db = require('./server/lib/db');

async function migrate() {
    try {
        await db.execute(`
            CREATE TABLE IF NOT EXISTS media_folders (
                id INT AUTO_INCREMENT PRIMARY KEY,
                tenant_id INT NOT NULL,
                parent_id INT DEFAULT NULL,
                name VARCHAR(255) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE,
                FOREIGN KEY (parent_id) REFERENCES media_folders(id) ON DELETE CASCADE
            )
        `);
        console.log("media_folders table created");

        // Try to add folder_id to media table
        try {
            await db.execute('ALTER TABLE media ADD COLUMN folder_id INT DEFAULT NULL');
            await db.execute('ALTER TABLE media ADD FOREIGN KEY (folder_id) REFERENCES media_folders(id) ON DELETE SET NULL');
            console.log("folder_id added to media table");
        } catch(e) {
            if (e.code === 'ER_DUP_FIELDNAME') {
                console.log("folder_id already exists in media");
            } else {
                throw e;
            }
        }
    } catch (error) {
        console.error("Migration failed:", error);
    } finally {
        process.exit();
    }
}

migrate();
