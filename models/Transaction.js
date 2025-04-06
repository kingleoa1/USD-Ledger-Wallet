const db = require('../config/db');

const Transaction = {
  async create({ userId, type, amount, description }) {
    await db.execute(
      'INSERT INTO transactions (user_id, type, amount, description) VALUES (?, ?, ?, ?)',
      [userId, type, amount, description]
    );
    const [result] = await db.execute(
      'UPDATE balances SET balance = balance + ? WHERE user_id = ?',
      [type === 'credit' ? amount : -amount, userId]
    );
    return result;
  }
};

module.exports = Transaction;

