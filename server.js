require('dotenv').config();
const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Serve static files from the root and images folder
app.use(express.static(path.join(__dirname, './')));
app.use('/images', express.static(path.join(__dirname, 'images')));

// TiDB CLOUD CONNECTION
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 4000,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    ssl: {
        minVersion: 'TLSv1.2',
        rejectUnauthorized: true 
    },
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 10000
});

// --- API ROUTES (FIXED FOR MYSQL) ---

app.get('/api/jerseys', async (req, res) => {
    try {
        // MySQL returns an array where the first element [rows] is your data
        const [rows] = await pool.query('SELECT * FROM jerseys');
        res.json(rows); 
    } catch (err) {
        console.error("JERSEYS ERROR:", err.message);
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/boots', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM boots');
        res.json(rows);
    } catch (err) {
        console.error("BOOTS ERROR:", err.message);
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/balls', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM balls');
        res.json(rows);
    } catch (err) {
        console.error("BALLS ERROR:", err.message);
        res.status(500).json({ error: err.message });
    }
});

app.listen(port, () => {
    console.log(`🚀 ULTRAKICK Server live on port ${port}`);
});