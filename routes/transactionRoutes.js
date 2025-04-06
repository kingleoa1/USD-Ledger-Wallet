const express = require('express');
const { addFunds, removeFunds } = require('../controllers/transaction');

const router = express.Router();

// Route to add funds to user balance
router.post('/add', addFunds);

// Route to remove funds from user balance
router.post('/remove', removeFunds);

module.exports = router;
