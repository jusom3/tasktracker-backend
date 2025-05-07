const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
  deadline: Date,
  category: String,
  createdAt: { type: Date, default: Date.now },
  assignedTo: String,
  status: { type: String, enum: ['pending', 'approved', 'denied'], default: 'pending' },
  leaderComment: { type: String, default: "" },  // ✅ Add this!
  submittedFile: String
});

module.exports = mongoose.model('Task', TaskSchema);
