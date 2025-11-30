const express = require('express');
const router = express.Router();
const db = require('../config/db');

// GET /api/menu
router.get('/', async (req, res) => {
    try {
        // Query the real database table "items"
        const [rows] = await db.query('SELECT * FROM items');
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
});

module.exports = router;