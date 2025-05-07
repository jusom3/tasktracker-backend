const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

// Register
router.post('/register', async (req, res) => {
  try {
    const name = req.body.name?.trim();
    const email = req.body.email?.trim();
    const password = req.body.password?.trim();
    const role = req.body.role;

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ error: 'Email already registered' });

    // ✅ Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({ name, email, password: hashedPassword, role });
    await user.save();

    res.status(201).json({ message: 'User created successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// Login
router.post('/login', async (req, res) => {
  try {
    const email = req.body.email?.trim();
    const password = req.body.password?.trim();

    console.log('LOGIN ATTEMPT:', email, `"${password}"`);

    const user = await User.findOne({ email });
    console.log('USER FOUND:', user);

    if (!user) {
      console.log('❌ No user found');
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    console.log('🔐 PASSWORD MATCH:', isMatch);

    if (!isMatch) {
      console.log('❌ Password mismatch');
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.json({ token, role: user.role });

  } catch (err) {
    console.error('LOGIN ERROR:', err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
