// =============================================================
// Database Connection Pool (Centralized)
// =============================================================
// Single source of truth for the MySQL connection pool.
// Import this module from anywhere in the backend:
//   const db = require('../server/lib/db');
// =============================================================

const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: parseInt(process.env.DB_PORT) || 3306,
    ssl: {
        rejectUnauthorized: false
    },
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    connectTimeout: 20000 // 20 seconds
});

// Verify connection on startup
pool.getConnection()
    .then(connection => {
        console.log(`[DB] ✓ Connected to ${process.env.DB_HOST}:${process.env.DB_PORT || 3306}/${process.env.DB_NAME}`);
        connection.release();
    })
    .catch(err => {
        console.error(`[DB] ✗ Connection failed → ${process.env.DB_HOST}:${process.env.DB_PORT || 3306}`);
        console.error(err);
    });

module.exports = pool;
