const { createProject, getProjectsByUser } = require('../../models/project/Project');

const addProject = async (req, res) => {
  const { name } = req.body;
  try {
    const project = await createProject(req.user.id, name);
    res.status(201).json(project);
  } catch {
    res.status(500).json({ error: 'Failed to create project' });
  }
};

const listProjects = async (req, res) => {
  try {
    const projects = await getProjectsByUser(req.user.id);
    res.json(projects);
  } catch {
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
};

module.exports = { addProject, listProjects };
