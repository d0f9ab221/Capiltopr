const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { authenticateUser, authorizeUser } = require('../middleware/auth');
const validator = require('validator');

// Get user profile
router.get('/profile', authenticateUser, authorizeUser, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ user });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

// Update user profile
router.put('/profile', authenticateUser, authorizeUser, async (req, res) => {
  try {
    const { name, email } = req.body;
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (name) user.name = name;
    if (email && email !== user.email) {
      if (!validator.isEmail(email)) {
        return res.status(400).json({ error: 'Invalid email' });
      }
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ error: 'Email already in use' });
      }
      user.email = email;
    }

    await user.save();

    res.json({ message: 'Profile updated successfully', user: { id: user._id, name: user.name, email: user.email } });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// Change password
router.put('/change-password', authenticateUser, authorizeUser, async (req, res) => {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body;

    if (!currentPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ error: 'New passwords do not match' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    const user = await User.findById(req.user.id);
    const isPasswordValid = await user.comparePassword(currentPassword);

    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Current password is incorrect' });
    }

    user.password = newPassword;
    await user.save();

    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to change password' });
  }
});

// Get user dashboard stats
router.get('/stats', authenticateUser, authorizeUser, async (req, res) => {
  try {
    const Link = require('../models/Link');
    
    const totalLinks = await Link.countDocuments({ userId: req.user.id });
    const totalClicks = await Link.aggregate([
      { $match: { userId: require('mongoose').Types.ObjectId(req.user.id) } },
      { $group: { _id: null, total: { $sum: '$clicks' } } }
    ]);

    const recentLinks = await Link.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      stats: {
        totalLinks,
        totalClicks: totalClicks[0]?.total || 0,
        recentLinks
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

module.exports = router;
