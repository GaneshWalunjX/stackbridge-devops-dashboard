// backend/src/app.js

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const helmet = require('helmet');
const { version } = require('../package.json');

dotenv.config();

// Crash logging
process.on('uncaughtException', err => {
  console.error('Uncaught Exception:', err);
});
process.on('unhandledRejection', err => {
  console.error('Unhandled Rejection:', err);
});

const healthRoutes = require('./routes/healthRoutes');
const authRoutes = require('./routes/authRoutes');
const projectRoutes = require('./routes/project/projectRoutes');
const dashboardRoutes = require('./routes/project/dashboardRoutes');
const taskRoutes = require('./routes/task/taskRoutes');

const app = express();

// Security headers
app.use(helmet());

const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:8081',
  'http://stackbridge.devops.local'
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`CORS blocked: ${origin}`));
    }
  },
  credentials: true
}));

// Built-in body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(
    `[${new Date().toISOString()}] ${req.method} ${req.originalUrl} from ${req.headers.origin || 'unknown'}`
  );
  next();
});

// Health endpoints
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK' });
});

app.get('/ping', (req, res) => {
  res.status(200).json({ message: 'pong' });
});

// Version endpoint
app.get('/version', (req, res) => {
  res.status(200).json({ version });
});

// Routers
app.use('/api', healthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/tasks', taskRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    status: 'error',
    error: 'Not Found',
    path: req.originalUrl
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    status: 'error',
    error: err.message || 'Internal Server Error',
    path: req.originalUrl
  });
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  process.exit(0);
});
process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  process.exit(0);
});

module.exports = app;
