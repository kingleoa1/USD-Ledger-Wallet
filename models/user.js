const db = require('../config/db');
const { encrypt, decrypt } = require('../utils/encrypt');

// Register a new user (with encryption for sensitive data)
const registerUser = async (username, email, password) => {
    const encryptedPassword = encrypt(password); // Encrypt password before storing
    const [rows] = await db.execute(
        'INSERT INTO users (username, email, password) VALUES (?, ?, ?)', 
        [username, email, encryptedPassword]
    );
    return rows;
};

// Get user by email (for login)
const getUserByEmail = async (email) => {
    const [rows] = await db.execute(
        'SELECT * FROM users WHERE email = ?',
        [email]
    );
    return rows[0]; // Returns the first matching user
};

// Get user balance
const getUserBalance = async (userId) => {
    const [rows] = await db.execute(
        'SELECT balance FROM accounts WHERE user_id = ?',
        [userId]
    );
    return rows[0]?.balance || 0; // Return balance or 0 if not found
};

// Update user balance
const updateUserBalance = async (userId, newBalance) => {
    const [rows] = await db.execute(
        'UPDATE accounts SET balance = ? WHERE user_id = ?',
        [newBalance, userId]
    );
    return rows;
};

// Get last 5 transactions of the user
const getUserTransactions = async (userId) => {
    const [rows] = await db.execute(
        'SELECT * FROM transactions WHERE user_id = ? ORDER BY created_at DESC LIMIT 5',
        [userId]
    );
    return rows; // Return the last 5 transactions
};

module.exports = {
    registerUser,
    getUserByEmail,
    getUserBalance,
    updateUserBalance,
    getUserTransactions,
};
