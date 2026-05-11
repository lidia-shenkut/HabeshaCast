const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const multer = require('multer');
const path = require('path');
const User = require('../models/User');

// Multer Storage for Avatars
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/avatars/'),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

// Register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'Email already exists' });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const role = email.toLowerCase() === 'admin@habeshacast.com' ? 'admin' : 'user';

    const user = new User({ name, email, password: hashedPassword, role });
    await user.save();
    
    res.status(201).json({ 
      id: user._id, name: user.name, email: user.email, role: user.role,
      avatar: user.avatar, bio: user.bio, phone: user.phone, 
      location: user.location, interests: user.interests 
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    if (user.isBlocked) return res.status(403).json({ message: 'Account blocked. Please contact support.' });

    res.json({ 
      id: user._id, name: user.name, email: user.email, role: user.role,
      avatar: user.avatar, bio: user.bio, phone: user.phone, 
      location: user.location, interests: user.interests 
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Block User (Admin)
router.patch('/block/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    user.isBlocked = true;
    await user.save();
    res.json({ message: 'User blocked successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update Profile
router.patch('/profile/:id', upload.single('avatar'), async (req, res) => {
  try {
    const { bio, phone, location, interests } = req.body;
    const updateData = { bio, phone, location };
    if (interests) updateData.interests = JSON.parse(interests);
    if (req.file) updateData.avatar = `/uploads/avatars/${req.file.filename}`;

    const user = await User.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json({ 
      id: user._id, name: user.name, email: user.email, role: user.role,
      avatar: user.avatar, bio: user.bio, phone: user.phone, 
      location: user.location, interests: user.interests 
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Change Password
router.patch('/change-password/:id', async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Current password incorrect' });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    res.json({ message: 'Password updated successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
