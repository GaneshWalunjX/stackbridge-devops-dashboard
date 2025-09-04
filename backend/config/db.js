// backend/config/db.js

const { Sequelize } = require('sequelize');
require('dotenv').config();

// 🔌 Initialize Sequelize with .env credentials
const sequelize = new Sequelize(
  process.env.DB_NAME,     // stackbridge
  process.env.DB_USER,     // postgres
  process.env.DB_PASSWORD, // yourpassword
  {
    host: process.env.DB_HOST, // localhost
    port: process.env.DB_PORT, // 5432
    dialect: 'postgres',
    logging: false, // flip to true for SQL query logs
  }
);

// 🧪 Optional: Test DB connection immediately
(async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ PostgreSQL connection established successfully.');
  } catch (err) {
    console.error('❌ DB connection failed:', err.message);
  }
})();

module.exports = sequelize;
