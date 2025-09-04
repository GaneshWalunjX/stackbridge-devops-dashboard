// backend/src/routes/authRoutes.js

const express = require('express');
const { register, login } = require('../controllers/project/authController');
const { findUserByEmail } = require('../models/User');

const router = express.Router();

// 🔐 Auth routes
router.post('/register', register);
router.post('/login', login);

// 🧪 Temporary debug route to check if a user exists
router.get('/debug/users', async (req, res) => {
  const testEmail = 'generika.se@gmail.com'; // change this if needed
  try {
    const user = await findUserByEmail(testEmail);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({
      id: user.id,
      email: user.email,
      passwordHash: user.password, // for debugging only—remove in production
    });
  } catch (err) {
    console.error('Debug route error:', err.stack || err.message || err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
