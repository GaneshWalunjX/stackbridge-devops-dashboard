// backend/src/app.js

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');

dotenv.config();

const authRoutes = require('./routes/authRoutes');
const healthRoutes = require('./routes/healthRoutes');
const projectRoutes = require('./routes/project/projectRoutes');
const dashboardRoutes = require('./routes/project/dashboardRoutes');
const taskRoutes = require('./routes/task/taskRoutes');

const app = express();

// ✅ CORS: allow frontend during local dev
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
      callback(new Error(`❌ CORS blocked: ${origin}`));
    }
  },
  credentials: true
}));

// ✅ Body parsing
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// ✅ Force JSON response headers
app.use((req, res, next) => {
  res.setHeader('Content-Type', 'application/json');
  next();
});

// ✅ Log incoming requests
app.use((req, res, next) => {
  console.log(`[${req.method}] ${req.url} from ${req.headers.origin || 'unknown origin'}`);
  next();
});

// ✅ Route mounting
app.use('/api', healthRoutes);               // Healthcheck
app.use('/api/auth', authRoutes);            // Login/Register
app.use('/api/projects', projectRoutes);     // Project CRUD
app.use('/api/dashboard', dashboardRoutes);  // Dashboard data
app.use('/api/tasks', taskRoutes);           // Task CRUD

// ✅ Kubernetes probe endpoint
app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

module.exports = app;
