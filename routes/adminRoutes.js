const express = require('express');
const db = require('../config/db');

const router = express.Router();

// Route to get all transactions for admin (for viewing)
router.get('/transactions', async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM transactions ORDER BY created_at DESC');
    res.status(200).json(rows);
  } catch (error) {
    console.error('Error fetching transactions:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Route to get all users (for admin management)
router.get('/users', async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM users ORDER BY created_at DESC');
    res.status(200).json(rows);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
