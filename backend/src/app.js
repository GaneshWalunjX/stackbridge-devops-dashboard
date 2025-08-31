const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const projectRoutes = require('./routes/project/projectRoutes');
const taskRoutes = require('./routes/task/taskRoutes');

dotenv.config();

const app = express();

// 🔧 Middleware
app.use(cors());
app.use(express.json());

// 🚪 Routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/tasks', taskRoutes);

// 🛠️ Healthcheck
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

module.exports = app;
