const mongoose = require('mongoose');

const episodeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  category: { type: String, required: true },
  author: { type: String, required: true },
  audioUrl: { type: String },
  duration: { type: String, default: '0:00' },
  color: { type: String, default: 'linear-gradient(135deg, #10ac84, #1dd1a1)' },
  approved: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Episode', episodeSchema);
