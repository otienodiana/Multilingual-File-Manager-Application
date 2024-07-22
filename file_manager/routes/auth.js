const express = require('express');
const passport = require('../config/passport');
const User = require('../models/User');
const router = express.Router();

router.post('/register', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.create({ username, password });
        res.status(201).json(user);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

router.post('/login', passport.authenticate('local'), (req, res) => {
    res.json(req.user);
});

router.get('/logout', (req, res) => {
    req.logout();
    res.status(200).send('Logged out');
});

module.exports = router;
