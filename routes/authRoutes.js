const express = require('express');
const router = express.Router();
const db = require('../config/db');

// REGISTER
router.post('/register', async (req, res) => {
    const { name, email, password } = req.body;
    try {
        // In your teammate's DB, the columns are name, email, password, role
        const sql = 'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, "customer")';
        await db.query(sql, [name, email, password]);
        res.json({ message: "User registered successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// LOGIN
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const [users] = await db.query('SELECT * FROM users WHERE email = ? AND password = ?', [email, password]);
        
        if (users.length > 0) {
            const user = users[0];
            res.json({ 
                message: "Login Successful", 
                user_id: user.user_id, 
                name: user.name,
                role: user.role 
            });
        } else {
            res.status(401).json({ message: "Invalid email or password" });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;