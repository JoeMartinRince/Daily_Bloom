const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Routes will be imported here
const authRoutes = require('./routes/auth');
const habitRoutes = require('./routes/habits');
const statsRoutes = require('./routes/stats');

app.use('/api/auth', authRoutes);
app.use('/api/habits', habitRoutes);
app.use('/api/stats', statsRoutes);

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI || MONGODB_URI === 'your_mongodb_connection_string_here') {
  console.error("CRITICAL: MONGODB_URI is not set correctly in server/.env");
}

let isConnected = false;
const connectToDB = async () => {
  if (isConnected) return;
  try {
    await mongoose.connect(MONGODB_URI);
    isConnected = true;
    console.log("Connected to MongoDB!");
  } catch (err) {
    console.error("Failed to connect to MongoDB:", err.message);
  }
};

if (process.env.NODE_ENV !== 'production') {
  connectToDB().then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  });
} else {
  app.use(async (req, res, next) => {
    await connectToDB();
    next();
  });
}

module.exports = app;
