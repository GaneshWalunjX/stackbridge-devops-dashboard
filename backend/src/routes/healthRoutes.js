const express = require('express');
const router = express.Router();

router.get('/ping', (req, res) => {
  console.log('✅ /api/ping route hit');
  res.status(200).json({ message: 'API is alive' });
});

module.exports = router;

