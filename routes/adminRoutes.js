const express = require('express');
const router = express.Router();
const db = require('../config/db');

// GET /api/admin/orders (View ALL orders for the dashboard)
router.get('/orders', async (req, res) => {
    try {
        const [orders] = await db.query('SELECT * FROM orders ORDER BY date DESC');
        res.json(orders);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// PUT /api/admin/order-status (Update status: Preparing -> Delivered)
router.put('/order-status', async (req, res) => {
    const { order_id, status } = req.body; // status must be 'preparing', 'on_the_way', or 'delivered'
    try {
        await db.query('UPDATE orders SET status = ? WHERE order_id = ?', [status, order_id]);
        res.json({ message: `Order #${order_id} updated to ${status}` });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET /api/admin/stats (Sales Report)
router.get('/stats', async (req, res) => {
    try {
        // Calculate Total Revenue and Total Orders
        const [rows] = await db.query('SELECT SUM(total_price) as total_revenue, COUNT(*) as total_orders FROM orders');
        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;