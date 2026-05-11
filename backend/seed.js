const mongoose = require('mongoose');
require('dotenv').config();
const Episode = require('./models/Episode');

const MONGODB_URI = process.env.MONGODB_URI;

const episodes = [
  {
    title: "The Future of Habesha Tech",
    description: "Discussing the startup ecosystem in Addis.",
    category: "Podcasts",
    author: "Dawit Moges",
    duration: "45:20",
    color: "linear-gradient(135deg, #6366f1, #a855f7)",
    approved: true
  },
  {
    title: "Ethio-Jazz Modern Mix",
    description: "A blend of traditional jazz and modern beats.",
    category: "Music",
    author: "Mulatu Astatke Fan",
    duration: "12:15",
    color: "linear-gradient(135deg, #f43f5e, #fb923c)",
    approved: true
  },
  {
    title: "Echoes of Axum",
    description: "Historical deep dive into the Axumite Empire.",
    category: "African Voices",
    author: "History Channel Ethio",
    duration: "30:00",
    color: "linear-gradient(135deg, #10b981, #3b82f6)",
    approved: true
  },
  {
    title: "Weekly Viral Rundown",
    description: "What's trending in Ethiopia this week.",
    category: "Trending",
    author: "HabeshaCast News",
    duration: "15:45",
    color: "linear-gradient(135deg, #f59e0b, #ef4444)",
    approved: true
  },
  {
    title: "Meet the Digital Creators",
    description: "Interviews with Ethiopia's top influencers.",
    category: "Creators",
    author: "Creator Hub",
    duration: "25:30",
    color: "linear-gradient(135deg, #8b5cf6, #ec4899)",
    approved: true
  },
  {
    title: "Rainy Day in Addis",
    description: "Lo-fi beats for studying and relaxing.",
    category: "Chill Space",
    author: "Lofi Habesha",
    duration: "60:00",
    color: "linear-gradient(135deg, #0ea5e9, #6366f1)",
    approved: true
  },
  {
    title: "Oromo Cultural Music",
    description: "Traditional Oromo songs collection.",
    category: "Music",
    author: "Oromo Heritage",
    duration: "18:20",
    color: "linear-gradient(135deg, #22c55e, #10b981)",
    approved: true
  },
  {
    title: "Tigrinya Poetry Night",
    description: "Beautiful Tigrinya poems narrated.",
    category: "African Voices",
    author: "Tigray Arts",
    duration: "10:00",
    color: "linear-gradient(135deg, #facc15, #f59e0b)",
    approved: true
  }
];

async function seedDB() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to DB for seeding...");
    
    // Check if episodes already exist to avoid duplicates if needed, 
    // but for now let's just add them.
    for (const ep of episodes) {
      const exists = await Episode.findOne({ title: ep.title });
      if (!exists) {
        await new Episode(ep).save();
        console.log(`Seeded: ${ep.title}`);
      }
    }
    
    console.log("Seeding complete!");
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

seedDB();
