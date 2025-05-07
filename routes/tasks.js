const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const User = require('../models/User'); // ✅ validate assignedTo email
const multer = require('multer');
const path = require('path');

// ✅ File Upload Setup
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + ext);
  }
});
const upload = multer({ storage });


// ✅ CREATE Task - Must assign to a registered member
router.post('/', async (req, res) => {
  try {
    const { assignedTo } = req.body;

    // Must be assigned to a registered MEMBER by email
    const userExists = await User.findOne({ email: assignedTo, role: 'member' });
    if (!userExists) {
      return res.status(400).json({ error: 'Assigned user must be a registered member' });
    }

    const newTask = new Task(req.body);
    const savedTask = await newTask.save();
    res.status(201).json(savedTask);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ✅ GET All Tasks
router.get('/', async (req, res) => {
  try {
    const tasks = await Task.find();
    res.status(200).json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ✅ UPDATE Task (approve/deny/comments/edit)
router.put('/:id', async (req, res) => {
  try {
    const updateFields = { ...req.body };

    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      updateFields,
      { new: true }
    );

    if (!updatedTask) return res.status(404).json({ error: 'Task not found' });
    res.json(updatedTask);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ✅ DELETE Task
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Task.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Task not found' });
    res.json({ message: 'Task deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ✅ Upload File to Task
router.post('/upload/:id', upload.single('file'), async (req, res) => {
  try {
    const filePath = '/uploads/' + req.file.filename;

    const task = await Task.findByIdAndUpdate(
      req.params.id,
      {
        submittedFile: filePath,
        status: 'pending',
        leaderComment: '',
        submissionDate: new Date()
      },
      { new: true }
    );

    if (!task) return res.status(404).json({ error: 'Task not found' });

    res.json({ message: 'File uploaded', file: filePath });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;


