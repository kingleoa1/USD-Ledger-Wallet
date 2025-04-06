const db = require('../config/db');

// Create a new virtual card for the user
const createVirtualCard = async (req, res) => {
    const { userId, amount } = req.body;

    if (amount <= 0) {
        return res.status(400).json({ error: 'Amount must be greater than zero' });
    }

    try {
        // Generate a virtual card using MasterCard or Finicity API (placeholder for now)
        const virtualCardNumber = '4111111111111111'; // Dummy card number (replace with API logic)
        const virtualCardExpiration = '12/25'; // Dummy expiration date

        // Store virtual card info in the database
        await db.execute(
            'INSERT INTO virtual_cards (user_id, card_number, expiration, balance) VALUES (?, ?, ?, ?)',
            [userId, virtualCardNumber, virtualCardExpiration, amount]
        );

        return res.status(201).json({ message: 'Virtual card created successfully', cardNumber: virtualCardNumber });
    } catch (error) {
        console.error('Error creating virtual card:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

// Perform a payment with a virtual card
const makePayment = async (req, res) => {
    const { userId, cardId, amount } = req.body;

    if (amount <= 0) {
        return res.status(400).json({ error: 'Amount must be greater than zero' });
    }

    try {
        // Check if the virtual card exists and has sufficient balance
        const [rows] = await db.execute(
            'SELECT * FROM virtual_cards WHERE user_id = ? AND id = ?',
            [userId, cardId]
        );

        if (rows.length === 0) {
            return res.status(404).json({ error: 'Card not found' });
        }

        const virtualCard = rows[0];
        if (virtualCard.balance < amount) {
            return res.status(400).json({ error: 'Insufficient balance on virtual card' });
        }

        // Process payment (this would involve integration with an external payment provider like MasterCard)
        const newBalance = virtualCard.balance - amount;
        await db.execute(
            'UPDATE virtual_cards SET balance = ? WHERE id = ?',
            [newBalance, cardId]
        );

        // Log the transaction
        await db.execute(
            'INSERT INTO transactions (user_id, type, amount, created_at, card_id) VALUES (?, ?, ?, ?, ?)',
            [userId, 'payment', amount, new Date(), cardId]
        );

        return res.status(200).json({ message: 'Payment successful', newBalance });
    } catch (error) {
        console.error('Error making payment:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = { createVirtualCard, makePayment };
