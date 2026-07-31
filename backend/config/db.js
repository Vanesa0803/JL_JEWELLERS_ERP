const mysql = require("mysql2/promise");  // ✅ FIX

const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

console.log("MySQL Connected ✅");

module.exports = db;