const mongoose = require('mongoose');

const linkSchema = new mongoose.Schema({
  shortCode: {
    type: String,
    unique: true,
    required: true,
    trim: true,
    lowercase: true
  },
  originalUrl: {
    type: String,
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  customAlias: {
    type: String,
    default: null,
    unique: true,
    sparse: true
  },
  password: {
    type: String,
    default: null
  },
  expiresAt: {
    type: Date,
    default: null
  },
  isActive: {
    type: Boolean,
    default: true
  },
  clicks: {
    type: Number,
    default: 0
  },
  analytics: {
    devices: [
      {
        os: String,
        browser: String,
        deviceType: String,
        count: { type: Number, default: 1 }
      }
    ],
    countries: [
      {
        country: String,
        count: { type: Number, default: 1 }
      }
    ],
    referrers: [
      {
        referrer: String,
        count: { type: Number, default: 1 }
      }
    ]
  },
  qrCode: {
    type: String,
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  lastClicked: {
    type: Date,
    default: null
  }
});

module.exports = mongoose.model('Link', linkSchema);
