const express = require('express');
const { register, login, authenticate } = require('../controllers/auth');
const router = express.Router();

// Register a new user
router.post('/register', register);

// Login user and generate JWT token
router.post('/login', login);

// Middleware for routes that require authentication
router.use(authenticate);

// Export the routes
module.exports = router;
