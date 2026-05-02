const express = require('express');
const router = express.Router();
const Episode = require('../models/Episode');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Configure Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

// Get all approved episodes (for home/category screens)
router.get('/approved', async (req, res) => {
  try {
    const episodes = await Episode.find({ approved: true }).sort({ createdAt: -1 });
    res.json(episodes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get all pending episodes (for Admin screen)
router.get('/pending', async (req, res) => {
  try {
    const episodes = await Episode.find({ approved: false })
      .populate('creator', 'name email avatar isBlocked')
      .sort({ createdAt: -1 });
    res.json(episodes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a new episode (Upload screen)
router.post('/', upload.single('audio'), async (req, res) => {
  const episode = new Episode({
    title: req.body.title,
    description: req.body.description,
    category: req.body.category,
    author: req.body.author,
    creator: req.body.creatorId,
    audioUrl: req.file ? `/uploads/${req.file.filename}` : '',
    duration: req.body.duration || '0:00',
    color: req.body.color || 'linear-gradient(135deg, #10ac84, #1dd1a1)',
    approved: false
  });

  try {
    const newEpisode = await episode.save();
    res.status(201).json(newEpisode);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Approve an episode (Admin)
router.patch('/:id/approve', async (req, res) => {
  try {
    const episode = await Episode.findById(req.params.id);
    if (!episode) return res.status(404).json({ message: 'Episode not found' });
    
    episode.approved = true;
    const updatedEpisode = await episode.save();
    res.json(updatedEpisode);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete an episode (Admin reject)
router.delete('/:id', async (req, res) => {
  try {
    const episode = await Episode.findById(req.params.id);
    if (!episode) return res.status(404).json({ message: 'Episode not found' });

    // Try deleting associated file
    if (episode.audioUrl) {
      const filePath = path.join(__dirname, '..', episode.audioUrl);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    await episode.deleteOne();
    res.json({ message: 'Episode deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
