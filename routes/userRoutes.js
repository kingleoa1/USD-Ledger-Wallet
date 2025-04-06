const express = require('express');
const { register, login, authenticate } = require('../controllers/auth');

const router = express.Router();

// User registration
router.post('/register', register);

// User login
router.post('/login', login);

// Middleware to protect routes requiring authentication
router.use(authenticate);

// Protected route example (you can add other protected routes as needed)
router.get('/profile', (req, res) => {
  res.status(200).json({ message: 'User profile data', user: req.user });
});

module.exports = router;
