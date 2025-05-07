const express = require('express');
const crypto = require('crypto');
const User = require('../models/User');
const router = express.Router();

router.post('/', async (req, res) => {
  const email = req.body.email?.trim().toLowerCase();

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const token = crypto.randomBytes(32).toString('hex');
    user.resetToken = token;
    user.resetTokenExpiry = Date.now() + 1000 * 60 * 2; // ✅ 2 minutes
    await user.save();

    const resetLink = `https://tasktracker-backendnpm-install.onrender.com/reset-password.html?token=${token}`;

    res.json({ message: 'Reset link generated', resetLink });

  } catch (err) {
    console.error('❌ Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
