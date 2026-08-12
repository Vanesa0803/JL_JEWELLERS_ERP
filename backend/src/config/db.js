import 'dotenv/config';
import mysql from 'mysql2/promise';

const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'jl_jewellers',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

const connectDB = async () => {
    try {
        const connection = await pool.getConnection();
        console.log(`\nMySQL Database Connected successfully on host: ${connection.config.host}`);
        connection.release();
    } catch (error) {
        console.error('\nMySQL Database Connection Failed!');
        console.error(error.message);
        process.exit(1);
    }
};

export { pool, connectDB };
