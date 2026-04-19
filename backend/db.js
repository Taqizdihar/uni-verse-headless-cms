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

pool.getConnection()
    .then(connection => {
        console.log(`DATABASE CONNECTED SUCCESSFULLY to ${process.env.DB_HOST}:${process.env.DB_PORT || 3306}`);
        connection.release();
    })
    .catch(err => {
        console.error(`DATABASE CONNECTION ERROR attempting to reach ${process.env.DB_HOST}:${process.env.DB_PORT || 3306}`);
        console.error(err);
    });

module.exports = pool;
