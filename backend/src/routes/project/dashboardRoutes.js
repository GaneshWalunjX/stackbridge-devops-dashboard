const express = require('express');
const { getDashboardData } = require('../../controllers/project/dashboardController');
const authenticate = require('../../middleware/authMiddleware');

const router = express.Router();

// Protect all dashboard routes with JWT
router.use(authenticate);

// Route: GET /api/dashboard
router.get('/', getDashboardData);

module.exports = router;

