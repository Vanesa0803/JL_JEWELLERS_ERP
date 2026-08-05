const mysql = require("mysql2/promise");

const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: Number(process.env.DB_PORT) || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

db.query("SELECT 1")
  .then(() => console.log("MySQL Connected"))
  .catch((error) => {
    console.error("MySQL connection failed:", error.code || error.message);
  });

module.exports = db;
