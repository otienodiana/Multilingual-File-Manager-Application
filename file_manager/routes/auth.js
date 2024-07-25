const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../models/User');

// Registration route
router.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ where: { username } });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create a new user
    await User.create({ username, password });

    // Redirect to the login page
    res.redirect('/login');
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ message: 'Error registering user', error: error.message });
  }
});


// Login route
router.post('/login', passport.authenticate('local', { session: true }), (req, res) => {
  res.json(req.user);
});

// Logout route
router.post('/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      console.error('Error logging out:', err);
      return res.status(500).json({ message: 'Error logging out', error: err.message });
    }
    res.status(200).json({ message: 'Logged out successfully' });
  });
});

module.exports = router;
