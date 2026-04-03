const express = require('express');
const jwt = require('jsonwebtoken');
const UserStats = require('../models/UserStats');

const router = express.Router();

const authMiddleware = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'No token' });
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

router.use(authMiddleware);

router.get('/', async (req, res) => {
  try {
    let stats = await UserStats.findOne({ userId: req.userId });
    if (!stats) {
      stats = new UserStats({ userId: req.userId, totalXp: 0, level: 1 });
      await stats.save();
    }
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/', async (req, res) => {
  try {
    const { totalXp, level } = req.body;
    const stats = await UserStats.findOneAndUpdate(
      { userId: req.userId },
      { totalXp, level },
      { new: true, upsert: true }
    );
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
