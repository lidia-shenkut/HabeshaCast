const express = require('express');
const router = express.Router();
const Episode = require('../models/Episode');

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
    const episodes = await Episode.find({ approved: false }).sort({ createdAt: -1 });
    res.json(episodes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a new episode (Upload screen)
router.post('/', async (req, res) => {
  const episode = new Episode({
    title: req.body.title,
    description: req.body.description,
    category: req.body.category,
    author: req.body.author,
    audioUrl: req.body.audioUrl,
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

    await episode.deleteOne();
    res.json({ message: 'Episode deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
