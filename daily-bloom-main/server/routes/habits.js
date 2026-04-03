const express = require('express');
const jwt = require('jsonwebtoken');
const Habit = require('../models/Habit');

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
    const habits = await Habit.find({ userId: req.userId }).sort({ createdAt: 1 });
    res.json(habits);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const habit = new Habit({ ...req.body, userId: req.userId });
    await habit.save();
    res.json(habit);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const habit = await Habit.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      req.body,
      { new: true }
    );
    res.json(habit);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await Habit.findOneAndDelete({ _id: req.params.id, userId: req.userId });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/:id/toggle', async (req, res) => {
  try {
    const { date } = req.body;
    const habit = await Habit.findOne({ _id: req.params.id, userId: req.userId });
    if (!habit) return res.status(404).json({ error: 'Not found' });
    
    let isCompleted = habit.completions.includes(date);
    if (isCompleted) {
      habit.completions = habit.completions.filter(d => d !== date);
    } else {
      habit.completions.push(date);
    }
    
    await habit.save();
    res.json(habit);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
