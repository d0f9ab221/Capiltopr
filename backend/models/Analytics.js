const mongoose = require('mongoose');

const analyticsSchema = new mongoose.Schema({
  linkId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Link',
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  clickTimestamp: {
    type: Date,
    default: Date.now
  },
  deviceInfo: {
    os: String,
    browser: String,
    deviceType: String
  },
  location: {
    country: String,
    city: String,
    latitude: Number,
    longitude: Number
  },
  referrer: String,
  ipAddress: String,
  userAgent: String
});

module.exports = mongoose.model('Analytics', analyticsSchema);
