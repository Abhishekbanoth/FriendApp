const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const friends = require('./routes/friends');
const app = express();
const PORT = process.env.PORT || 5000;

// MongoDB URI
const MONGO_URI = 'mongodb://localhost:27017/friendapp';

// Middleware
app.use(express.json());
app.use(cors()); // Enable CORS

// Routes
app.use('/auth', require('./routes/auth'));
app.use('/friends', friends);

// Connect to MongoDB (without deprecated options)
mongoose.connect(MONGO_URI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
