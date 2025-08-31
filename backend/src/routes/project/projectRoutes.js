const express = require('express');
const { addProject, listProjects } = require('../../controllers/project/projectController');
const authenticate = require('../../middleware/authMiddleware');
const router = express.Router();

router.use(authenticate);
router.post('/', addProject);
router.get('/', listProjects);

module.exports = router;
