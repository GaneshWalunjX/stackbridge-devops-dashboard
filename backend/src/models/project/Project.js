const pool = require('../../../config/db');

const createProject = async (userId, name) => {
  const result = await pool.query(
    'INSERT INTO projects (user_id, name) VALUES ($1, $2) RETURNING *',
    [userId, name]
  );
  return result.rows[0];
};

const getProjectsByUser = async (userId) => {
  const result = await pool.query(
    'SELECT * FROM projects WHERE user_id = $1',
    [userId]
  );
  return result.rows;
};

module.exports = { createProject, getProjectsByUser };
