// src/app.js

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');

const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/task/taskRoutes');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

// Healthcheck
app.get('/ping', (req, res) => res.send('Backend is alive'));

module.exports = app;
