const express = require('express');
const User = require('../models/User');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();
const mongoose = require('mongoose');

// Search users
router.get('/search', authMiddleware, async (req, res) => {
    const searchQuery = req.query.q || '';
    try {
        const users = await User.find({ username: new RegExp(searchQuery, 'i') });
        res.json(users);
    } catch (err) {
        console.error('Error searching users:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Send friend request
router.post('/add/:id', authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        const friend = await User.findById(req.params.id);

        if (!friend) return res.status(404).json({ msg: 'User not found' });
        if (user.friends.includes(friend._id)) return res.status(400).json({ msg: 'Already friends' });
        if (user.friendRequests.includes(friend._id)) return res.status(400).json({ msg: 'Friend request already sent' });

        friend.friendRequests.push(user._id);
        await friend.save();

        res.json({ msg: 'Friend request sent' });
    } catch (err) {
        console.error('Error sending friend request:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Get user's incoming friend requests
router.get('/requests', authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).populate('friendRequests', 'username');

        if (!user) return res.status(404).json({ msg: 'User not found' });

        const requests = await User.find({ _id: { $in: user.friendRequests } }).select('username');

        res.json(requests);
    } catch (err) {
        console.error('Error getting friend requests:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Accept/Reject friend request
router.post('/requests/:id', authMiddleware, async (req, res) => {
    const { accept } = req.body;
    try {
        const user = await User.findById(req.user.id);
        const friend = await User.findById(req.params.id);

        if (!user || !friend) return res.status(404).json({ msg: 'User not found' });

        if (accept) {
            user.friends.push(friend._id);
            friend.friends.push(user._id);
        }

        user.friendRequests = user.friendRequests.filter(id => id.toString() !== req.params.id);
        await user.save();
        await friend.save();

        res.json({ msg: accept ? 'Friend request accepted' : 'Friend request rejected' });
    } catch (err) {
        console.error('Error handling friend request:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Get user's friends
router.get('/', authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).populate('friends');
        res.json(user.friends);
    } catch (err) {
        console.error('Error getting friends:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Unfriend a user
router.post('/unfriend/:id', authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        const friend = await User.findById(req.params.id);

        if (!user || !friend) return res.status(404).json({ msg: 'User not found' });

        user.friends = user.friends.filter(friendId => friendId.toString() !== friend._id.toString());
        friend.friends = friend.friends.filter(friendId => friendId.toString() !== user._id.toString());

        await user.save();
        await friend.save();

        res.json({ msg: 'Unfriended successfully' });
    } catch (err) {
        console.error('Error unfriending user:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Friend recommendation based on mutual friends
router.get('/recommendations', authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).populate('friends');

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        if (user.friends.length === 0) {
            return res.json([]); // No friends, no recommendations
        }

        const recommendations = await User.aggregate([
            {
                $match: {
                    _id: { $in: user.friends.map(friendId => new mongoose.Types.ObjectId(friendId)) }
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'friends',
                    foreignField: '_id',
                    as: 'mutualFriends'
                }
            },
            { $unwind: '$mutualFriends' },
            { $match: { 'mutualFriends._id': { $ne: user._id } } },
            {
                $group: {
                    _id: '$mutualFriends._id',
                    mutualCount: { $sum: 1 }
                }
            },
            { $sort: { mutualCount: -1 } },
            { $limit: 10 }
        ]);

        const recommendedUserIds = recommendations.map(r => r._id);
        const recommendedUsers = await User.find({ _id: { $in: recommendedUserIds } }).select('username');

        res.json(recommendedUsers);
    } catch (err) {
        console.error('Error fetching recommendations:', err.message, err.stack);
        res.status(500).json({ error: 'Server error', details: err.message });
    }
});

module.exports = router;
