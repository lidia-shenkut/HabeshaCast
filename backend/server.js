const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
const MONGODB_URI = process.env.MONGODB_URI;

if (MONGODB_URI) {
  mongoose.connect(MONGODB_URI)
    .then(() => console.log('✅ Connected to MongoDB Cloud'))
    .catch((err) => console.error('❌ MongoDB Connection Error:', err));
} else {
  console.log('⚠️ MONGODB_URI not found in .env file. Database is not connected.');
}

// Basic Route for Testing
app.get('/', (req, res) => {
  res.send('HabeshaCast Backend API is running!');
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
