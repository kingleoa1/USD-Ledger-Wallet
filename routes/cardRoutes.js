const express = require('express');
const { createVirtualCard, makePayment } = require('../controllers/virtualCard');

const router = express.Router();

// Route to create a virtual card
router.post('/create', createVirtualCard);

// Route to make a payment using the virtual card
router.post('/payment', makePayment);

module.exports = router;
