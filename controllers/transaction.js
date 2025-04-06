const { getUserBalance, updateUserBalance } = require('../models/user');
const db = require('../config/db');

// Add funds to user's balance
const addFunds = async (req, res) => {
    const { userId, amount } = req.body;

    if (amount <= 0) {
        return res.status(400).json({ error: 'Amount must be greater than zero' });
    }

    try {
        const currentBalance = await getUserBalance(userId);
        const newBalance = currentBalance + amount;
        await updateUserBalance(userId, newBalance);
        
        // Log the transaction
        await db.execute(
            'INSERT INTO transactions (user_id, type, amount, created_at) VALUES (?, ?, ?, ?)',
            [userId, 'credit', amount, new Date()]
        );
        
        return res.status(200).json({ message: 'Funds added successfully', newBalance });
    } catch (error) {
        console.error('Error adding funds:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

// Remove funds from user's balance (for transactions)
const removeFunds = async (req, res) => {
    const { userId, amount } = req.body;

    if (amount <= 0) {
        return res.status(400).json({ error: 'Amount must be greater than zero' });
    }

    try {
        const currentBalance = await getUserBalance(userId);
        if (currentBalance < amount) {
            return res.status(400).json({ error: 'Insufficient funds' });
        }
        
        const newBalance = currentBalance - amount;
        await updateUserBalance(userId, newBalance);
        
        // Log the transaction
        await db.execute(
            'INSERT INTO transactions (user_id, type, amount, created_at) VALUES (?, ?, ?, ?)',
            [userId, 'debit', amount, new Date()]
        );
        
        return res.status(200).json({ message: 'Funds removed successfully', newBalance });
    } catch (error) {
        console.error('Error removing funds:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = { addFunds, removeFunds };
