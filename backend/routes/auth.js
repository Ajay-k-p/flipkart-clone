const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Register
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({ name, email, password: hashedPassword });
  await user.save();
  res.status(201).json({ message: 'User registered' });
});

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  // Hardcoded admin
  if (email === 'ajaykp@gmail.com' && password === 'adminAjay') {
    const user = { _id: 'admin', name: 'Admin', email, role: 'admin', isAdmin: true };
    const token = jwt.sign({ id: user._id, role: user.role, isAdmin: true }, process.env.JWT_SECRET, { expiresIn: '7d' });
    return res.json({ token, user });
  }

  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ message: 'Invalid credentials' });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

  const token = jwt.sign({ id: user._id, role: user.role, isAdmin: user.role === 'admin' }, process.env.JWT_SECRET, { expiresIn: '7d' });
  res.json({ token, user });
});

// Get profile
router.get('/profile', auth, async (req, res) => {
  const user = await User.findById(req.user.id);
  res.json(user);
});

module.exports = router;
