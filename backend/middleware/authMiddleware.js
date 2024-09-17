const jwt = require('jsonwebtoken');
const JWT_SECRET = 'Abhi$goodboy';

const authMiddleware = (req, res, next) => {
    // Extract token from Authorization header
    const token = req.header('Authorization')?.replace('Bearer ', '');
    // console.log('Authorization Header:', req.header('Authorization')); // Log the Authorization header
    // console.log('Extracted Token:', token); // Log the extracted token

    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        console.log('Decoded Token:', decoded); // Log the decoded token
        req.user = decoded;
        next();
    } catch (err) {
        console.error('JWT Verification Error:', err.message); // Log the error message
        res.status(401).json({ message: 'Invalid token' });
    }
};

module.exports = authMiddleware;
