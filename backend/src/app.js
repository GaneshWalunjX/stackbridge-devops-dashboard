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


app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.use('/api', healthRoutes);               // Healthcheck
app.use('/api/auth', authRoutes);            // Login/Register
app.use('/api/projects', projectRoutes);     // Project CRUD
app.use('/api/dashboard', dashboardRoutes);  // Dashboard data
app.use('/api/tasks', taskRoutes);           // Task CRUD


app.get('/ping', (req, res) => res.send('Backend is alive'));

module.exports = app;
