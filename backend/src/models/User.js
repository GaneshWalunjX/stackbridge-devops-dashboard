// backend/src/models/User.js

const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db'); 

// 🧬 Define User model
const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  email: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  tableName: 'Users', // ensure this matches your DB table
  timestamps: false,  // disable if you're not using createdAt/updatedAt
});

// 🔍 Utility function to find user by email
async function findUserByEmail(email) {
  try {
    return await User.findOne({ where: { email } });
  } catch (err) {
    console.error('findUserByEmail error:', err.stack || err.message || err);
    throw err;
  }
}

module.exports = {
  User,
  findUserByEmail,
};
