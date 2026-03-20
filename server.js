const express = require('express');
const mysql = require('mysql2/promise'); // Switched to MySQL for TiDB
const cors = require('cors');
const path = require('path');
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// Serve static files (your HTML, CSS, JS)
app.use(express.static(path.join(__dirname, './')));
app.use('/images', express.static(path.join(__dirname, 'images')));

// TiDB CLOUD CONNECTION
const pool = mysql.createPool({
    host: 'gateway01.ap-southeast-1.prod.aws.tidbcloud.com',
    port: 4000,
    user: '3K19aH5r9hz9jne.root',
    password: 'U54NI2wVB99xdceO',
    database: 'test',
    ssl: {
        minVersion: 'TLSv1.2',
        rejectUnauthorized: true // TiDB Cloud requires SSL
    },
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// API Routes
app.get('/api/jerseys', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM jerseys');
        res.json(rows);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/boots', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM boots');
        res.json(rows);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/balls', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM balls');
        res.json(rows);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.listen(port, () => {
    console.log(`🚀 TiDB Connected! Server running at http://localhost:${port}`);
});