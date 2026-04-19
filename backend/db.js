const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    connectTimeout: 20000 // 20 seconds
});

pool.getConnection()
    .then(connection => {
        console.log('DATABASE CONNECTED SUCCESSFULLY');
        connection.release();
    })
    .catch(err => {
        console.error('DATABASE CONNECTION ERROR:', err);
    });

module.exports = pool;
