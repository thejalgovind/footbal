require('dotenv').config(); // Essential for Render deployment
const express = require('express');
const mysql = require('mysql2/promise'); // MySQL driver for TiDB
const cors = require('cors');
const path = require('path');

const app = express();
// Uses Render's port or 3000 for local testing
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Serve your HTML, CSS, and JS from the main folder
app.use(express.static(path.join(__dirname, './')));
// Serve your product images
app.use('/images', express.static(path.join(__dirname, 'images')));

// TiDB CLOUD CONNECTION - Uses your .env variables
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    ssl: {
        minVersion: 'TLSv1.2',
        rejectUnauthorized: true 
    },
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// --- API ROUTES ---

// Fixed: Using [rows] destructuring for MySQL results
app.get('/api/jerseys', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM jerseys');
        res.json(rows); 
    } catch (err) { 
        console.error("Jerseys Error:", err.message);
        res.status(500).json({ error: err.message }); 
    }
});

app.get('/api/boots', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM boots');
        res.json(rows);
    } catch (err) { 
        console.error("Boots Error:", err.message);
        res.status(500).json({ error: err.message }); 
    }
});

app.get('/api/balls', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM balls');
        res.json(rows);
    } catch (err) { 
        console.error("Balls Error:", err.message);
        res.status(500).json({ error: err.message }); 
    }
});

app.listen(port, () => {
    console.log(`🚀 ULTRAKICK Server live on port ${port}`);
});