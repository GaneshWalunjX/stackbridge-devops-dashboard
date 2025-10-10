/**
 * src/models/authController.js
 * Replaced legacy helper usage with direct Sequelize model methods
 */
const bcrypt = require('bcryptjs');
const { User } = require('../../models/User');

const createUser = async (email, plainPassword) => {
  if (!email || !plainPassword) throw new Error('email and password required');

  if (typeof User.create !== 'function') {
    throw new Error('User model not available');
  }

  const hashedPassword = await bcrypt.hash(plainPassword, 10);
  const user = await User.create({ email, password: hashedPassword });
  return user;
};

const findUserByEmail = async (email) => {
  if (!email) return null;
  if (typeof User.findOne !== 'function') throw new Error('User model not available');
  return User.findOne({ where: { email } });
};

module.exports = { createUser, findUserByEmail };
