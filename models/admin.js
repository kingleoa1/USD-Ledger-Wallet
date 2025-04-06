const db = require('../config/db');

const Admin = {
  async getLedgerSummary() {
    const [balanceRows] = await db.execute('SELECT SUM(balance) as total_liability FROM balances');
    const [bankRows] = await db.execute('SELECT SUM(balance) as bank_account_balance FROM bank_accounts');
    return {
      total_liability: balanceRows[0].total_liability || 0,
      bank_account_balance: bankRows[0].bank_account_balance || 0
    };
  }
};

module.exports = Admin;
