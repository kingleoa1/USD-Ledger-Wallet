const express = require('express');
const { addFunds, removeFunds } = require('../controllers/transaction');
const router = express.Router();

// Add funds to user's balance
router.post('/addFunds', addFunds);

// Remove funds from user's balance
router.post('/removeFunds', removeFunds);

// Export the routes
module.exports = router;
