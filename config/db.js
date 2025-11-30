// config/db.js
const mysql = require('mysql2');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'Yahya100@', // <--- IMPORTANT: Type the password you set in the Installer!
    database: 'food_ordering', // This must match the name in Workbench exactly
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// This line is the magic fix. It exports the "Promise" version.
module.exports = pool.promise();