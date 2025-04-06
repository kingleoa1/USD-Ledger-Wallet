const express = require('express');
const { createVirtualCard, makePayment } = require('../controllers/virtualCard');
const router = express.Router();

// Create a virtual card for the user
router.post('/create', createVirtualCard);

// Make a payment with the virtual card
router.post('/payment', makePayment);

// Export the routes
module.exports = router;
