const express = require('express');
const router = express.Router();
const db = require('../config/db');

// POST /api/reviews
router.post('/', async (req, res) => {
    const { user_id, item_id, rating, comment } = req.body;
    try {
        const sql = 'INSERT INTO reviews (user_id, item_id, rating, comment) VALUES (?, ?, ?, ?)';
        await db.query(sql, [user_id, item_id, rating, comment]);
        res.json({ message: "Review submitted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET /api/reviews/:itemId (See reviews for a specific food)
router.get('/:itemId', async (req, res) => {
    try {
        const sql = 'SELECT * FROM reviews WHERE item_id = ?';
        const [rows] = await db.query(sql, [req.params.itemId]);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;