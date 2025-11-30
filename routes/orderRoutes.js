const express = require('express');
const router = express.Router();
const db = require('../config/db');

// PLACE ORDER
router.post('/', async (req, res) => {
    // Frontend must send: { user_id: 1, total_price: 50.00, cart: [{item_id: 1, quantity: 2, price: 10.00}] }
    const { user_id, total_price, cart } = req.body; 

    const connection = await db.getConnection(); 

    try {
        await connection.beginTransaction();

        // 1. Insert Order
        const [orderResult] = await connection.query(
            'INSERT INTO orders (user_id, total_price, status) VALUES (?, ?, "preparing")',
            [user_id, total_price]
        );
        const newOrderId = orderResult.insertId;

        // 2. Insert Items
        for (const item of cart) {
            await connection.query(
                'INSERT INTO order_items (order_id, item_id, quantity, price) VALUES (?, ?, ?, ?)',
                [newOrderId, item.item_id, item.quantity, item.price]
            );
        }

        await connection.commit();
        res.json({ message: "Order Placed Successfully", order_id: newOrderId });

    } catch (error) {
        await connection.rollback();
        console.error(error);
        res.status(500).json({ message: "Order Failed" });
    } finally {
        connection.release();
    }
});

// TRACK ORDER
router.get('/track/:id', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT status, date FROM orders WHERE order_id = ?', [req.params.id]);
        if (rows.length > 0) {
            res.json(rows[0]);
        } else {
            res.status(404).json({ message: "Order not found" });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
);
// GET /api/orders/user/:userId
// Returns all past orders for a specific customer
router.get('/user/:userId', async (req, res) => {
    try {
        // We join with order_items to show what they bought
        const sql = `
            SELECT o.order_id, o.total_price, o.status, o.date
            FROM orders o 
            WHERE o.user_id = ? 
            ORDER BY o.date DESC
        `;
        const [orders] = await db.query(sql, [req.params.userId]);
        res.json(orders);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});  /////لحد هنا

module.exports = router;