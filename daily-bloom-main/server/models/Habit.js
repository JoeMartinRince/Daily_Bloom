const mongoose = require('mongoose');

const habitSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  category: { type: String, required: true },
  icon: { type: String, required: true },
  reminderTime: { type: String, default: null }, // format: 'HH:mm'
  completions: [{ type: String }], // array of 'YYYY-MM-DD' dates
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Habit', habitSchema);
