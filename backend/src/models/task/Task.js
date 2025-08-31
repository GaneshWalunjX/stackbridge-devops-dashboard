const pool = require('../../../config/db');

const createTask = async (projectId, title) => {
  const result = await pool.query(
    'INSERT INTO tasks (project_id, title) VALUES ($1, $2) RETURNING *',
    [projectId, title]
  );
  return result.rows[0];
};

const getTasksByProject = async (projectId) => {
  const result = await pool.query(
    'SELECT * FROM tasks WHERE project_id = $1',
    [projectId]
  );
  return result.rows;
};

module.exports = { createTask, getTasksByProject };
