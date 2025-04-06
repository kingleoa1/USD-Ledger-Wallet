const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { getUserByEmail } = require('../models/user');
const { encrypt, decrypt } = require('../utils/encrypt');
const dotenv = require('dotenv');
dotenv.config();

// Register a new user
const register = async (req, res) => {
    const { username, email, password } = req.body;
    
    // Check if email already exists
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
        return res.status(400).json({ error: 'Email is already in use' });
    }
    
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        await registerUser(username, email, hashedPassword);
        return res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error('Error during registration:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

// Login user and generate JWT token
const login = async (req, res) => {
    const { email, password } = req.body;
    
    try {
        const user = await getUserByEmail(email);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        
        const token = jwt.sign({ userId: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
        return res.status(200).json({ message: 'Login successful', token });
    } catch (error) {
        console.error('Error during login:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

// Middleware to verify JWT token and authenticate user
const authenticate = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ error: 'Authentication required' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Attach user info to request
        next();
    } catch (error) {
        return res.status(401).json({ error: 'Invalid or expired token' });
    }
};

module.exports = { register, login, authenticate };
