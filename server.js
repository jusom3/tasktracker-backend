require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();

// ✅ Middleware
app.use(cors());
app.use(express.json());

// ✅ Serve static frontend files from 'frontend' folder
app.use(express.static(path.join(__dirname, 'frontend')));

// ✅ Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ Connected to MongoDB'))
.catch(err => console.error('❌ MongoDB connection error:', err.message));

// ✅ Import routes
const authRoutes = require('./routes/auth');
const taskRoutes = require('./routes/tasks');
const userRoutes = require('./routes/users');
const requestReset = require('./routes/request-reset');
const resetPassword = require('./routes/reset-password');

// ✅ API routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/request-reset', requestReset);
app.use('/api/reset-password', resetPassword);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


// ✅ Serve index.html by default
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'index.html'));
});

// ✅ Start server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
});
