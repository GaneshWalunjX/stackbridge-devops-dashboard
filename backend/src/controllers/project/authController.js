// backend/src/controllers/project/authController.js

const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { createUser, findUserByEmail } = require('../../models/User');

const register = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await createUser(email, password);
    res.status(201).json(user);
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ error: 'Registration failed' });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  // 🔍 Logging for debugging
  console.log('Login attempt:', { email, password });

  try {
    const user = await findUserByEmail(email);
    console.log('User found:', !!user);

    if (!user) {
      console.warn('No user found for email:', email);
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    console.log('Stored hash:', user.password);

    const match = await bcrypt.compare(password, user.password);
    console.log('Password match:', match);

    if (!match) {
      console.warn('Password mismatch for user:', email);
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    if (!process.env.JWT_SECRET) {
      console.error('JWT_SECRET is missing in .env');
      return res.status(500).json({ error: 'Server misconfigured' });
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    console.log('JWT generated:', token);

    res.json({ token });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Login failed' });
  }
};

module.exports = { register, login };
