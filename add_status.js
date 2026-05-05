const db = require('./backend/server/lib/db');
(async () => {
    try {
        await db.execute("ALTER TABLE media ADD COLUMN status VARCHAR(50) DEFAULT 'ready'");
        console.log("Column added");
    } catch(e) {
        if(e.code === 'ER_DUP_FIELDNAME') {
            console.log("Column already exists");
        } else {
            console.error(e);
        }
    }
    process.exit();
})();
