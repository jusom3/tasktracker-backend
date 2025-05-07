const express = require('express');
const bcrypt = require('bcryptjs'); // ✅ right

const jwt = require('jsonwebtoken');
const router = express.Router();
const User = require('../models/User');

// Replace with your own secret for real production
const JWT_SECRET = 'your_jwt_secret_key';

// ✅ Fetch all registered members
router.get('/', async (req, res) => {
  try {
    const role = req.query.role;
    const query = role ? { role } : {};
    const users = await User.find(query).select('email -_id');
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ LOGIN Route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '2h' }
    );

    res.json({
      token,
      email: user.email,
      role: user.role
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// ✅ RESET PASSWORD Route
router.post('/reset-password', async (req, res) => {
  const { email, newPassword } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: 'User not found' });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);

    await user.save();

    res.json({ message: 'Password reset successfully' });
  } catch (error) {
    console.error('Reset error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
