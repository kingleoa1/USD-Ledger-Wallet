const db = require('../config/db');
const { encrypt, decrypt } = require('../utils/encryption');

const VirtualCard = {
  async create({ userId, cardNumber, expiry, cvv }) {
    const [result] = await db.execute(
      'INSERT INTO virtual_cards (user_id, card_number, expiry, cvv) VALUES (?, ?, ?, ?)',
      [userId, encrypt(cardNumber), encrypt(expiry), encrypt(cvv)]
    );
    return result.insertId;
  },

  async getByUser(userId) {
    const [rows] = await db.execute('SELECT * FROM virtual_cards WHERE user_id = ?', [userId]);
    return rows.map(card => ({
      ...card,
      card_number: decrypt(card.card_number),
      expiry: decrypt(card.expiry),
      cvv: decrypt(card.cvv)
    }));
  },

  async fundCard(userId, amount) {
    const [updateResult] = await db.execute(
      'UPDATE virtual_cards SET balance = balance + ? WHERE user_id = ?',
      [amount, userId]
    );
    return updateResult;
  }
};

module.exports = VirtualCard;
