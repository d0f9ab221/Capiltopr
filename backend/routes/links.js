const express = require('express');
const router = express.Router();
const Link = require('../models/Link');
const { authenticateUser, authorizeUser } = require('../middleware/auth');
const validator = require('validator');
const QRCode = require('qrcode');
const crypto = require('crypto');

// Generate short code
const generateShortCode = () => {
  return crypto.randomBytes(3).toString('hex').toUpperCase();
};

// Create short link
router.post('/create', authenticateUser, authorizeUser, async (req, res) => {
  try {
    let { originalUrl, customAlias, password, expiresAt } = req.body;

    // Validate URL
    if (!originalUrl || !validator.isURL(originalUrl)) {
      return res.status(400).json({ error: 'Valid URL is required' });
    }

    let shortCode = customAlias || generateShortCode();

    // Check if custom alias already exists
    if (customAlias) {
      const existingLink = await Link.findOne({ customAlias });
      if (existingLink) {
        return res.status(400).json({ error: 'Custom alias already in use' });
      }
    }

    // Create QR code
    const shortUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/${shortCode}`;
    const qrCode = await QRCode.toDataURL(shortUrl);

    const newLink = new Link({
      shortCode,
      originalUrl,
      userId: req.user.id,
      customAlias: customAlias || null,
      password: password || null,
      expiresAt: expiresAt || null,
      qrCode
    });

    await newLink.save();

    res.json({
      message: 'Short link created successfully',
      link: {
        id: newLink._id,
        shortCode: newLink.shortCode,
        shortUrl,
        originalUrl: newLink.originalUrl,
        customAlias: newLink.customAlias,
        qrCode: newLink.qrCode,
        createdAt: newLink.createdAt
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create short link' });
  }
});

// Get user's links
router.get('/my-links', authenticateUser, authorizeUser, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const links = await Link.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Link.countDocuments({ userId: req.user.id });

    res.json({
      links,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch links' });
  }
});

// Edit link
router.put('/edit/:id', authenticateUser, authorizeUser, async (req, res) => {
  try {
    const link = await Link.findById(req.params.id);

    if (!link || link.userId.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const { originalUrl, password, expiresAt } = req.body;

    if (originalUrl) link.originalUrl = originalUrl;
    if (password) link.password = password;
    if (expiresAt) link.expiresAt = expiresAt;

    await link.save();

    res.json({ message: 'Link updated successfully', link });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update link' });
  }
});

// Delete link
router.delete('/delete/:id', authenticateUser, authorizeUser, async (req, res) => {
  try {
    const link = await Link.findById(req.params.id);

    if (!link || link.userId.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    await Link.findByIdAndDelete(req.params.id);

    res.json({ message: 'Link deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete link' });
  }
});

// Search links
router.get('/search', authenticateUser, authorizeUser, async (req, res) => {
  try {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({ error: 'Search query required' });
    }

    const links = await Link.find({
      userId: req.user.id,
      $or: [
        { shortCode: new RegExp(query, 'i') },
        { originalUrl: new RegExp(query, 'i') },
        { customAlias: new RegExp(query, 'i') }
      ]
    });

    res.json({ links });
  } catch (error) {
    res.status(500).json({ error: 'Search failed' });
  }
});

module.exports = router;
