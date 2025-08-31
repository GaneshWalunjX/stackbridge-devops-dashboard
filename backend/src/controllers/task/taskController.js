const { createTask, getTasksByProject } = require('../../models/task/Task');

const addTask = async (req, res) => {
  const { projectId, title } = req.body;
  try {
    const task = await createTask(projectId, title);
    res.status(201).json(task);
  } catch {
    res.status(500).json({ error: 'Failed to create task' });
  }
};

const listTasks = async (req, res) => {
  const { projectId } = req.params;
  try {
    const tasks = await getTasksByProject(projectId);
    res.json(tasks);
  } catch {
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
};

module.exports = { addTask, listTasks };

