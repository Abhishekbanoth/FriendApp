const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

// Define JWT secret from environment variables
const JWT_SECRET ='Abhi$goodboy';

// Sign up route
router.post('/signup', async (req, res) => {
    const { username, password } = req.body;

    try {
        // Check if the user already exists
        const existingUser = await User.findOne({ username });
        if (existingUser) return res.status(400).json({ msg: 'User already exists' });

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create and save the new user
        const user = new User({ username, password: hashedPassword });
        await user.save();

        // Generate a JWT token
        const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1h' });

        // Respond with the token and user info
        res.status(201).json({ token, user });
    } catch (err) {
        console.error('Signup Error:', err); // Log the error to the console
        res.status(500).json({ error: 'Server error' });
    }
});

// Login route
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username });
        if (!user) return res.status(400).json({ msg: 'User does not exist' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

        const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1h' });
        res.json({ token, user });
    } catch (err) {
        console.error('Login Error:', err); // Log the error to the console
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
