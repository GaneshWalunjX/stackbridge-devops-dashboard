const express = require('express');
const { addTask, listTasks } = require('../../controllers/task/taskController');
const authenticate = require('../../middleware/authMiddleware');
const router = express.Router();

router.use(authenticate);
router.post('/', addTask);
router.get('/:projectId', listTasks);

module.exports = router;

