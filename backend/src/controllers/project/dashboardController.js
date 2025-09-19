// backend/src/controllers/project/dashboardController.js

const getDashboardData = async (req, res) => {
  try {
    // Replace this with real metrics later
    res.json({
      userId: req.user?.id || null,
      message: 'Dashboard data loaded successfully',
    });
  } catch (err) {
    console.error('Dashboard error:', err);
    res.status(500).json({ error: 'Failed to load dashboard data' });
  }
};

module.exports = { getDashboardData };
