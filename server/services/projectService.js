const Project = require('../models/Project');

async function createProject(data) {
  const project = new Project(data);
  await project.save();
  return project;
}

async function getProjects(filter = {}, options = {}) {
  const { page = 1, limit = 20 } = options;
  const skip = (page - 1) * limit;
  const projects = await Project.find(filter)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .populate('userId', 'firstName lastName email');
  const total = await Project.countDocuments(filter);
  return { projects, total };
}

async function getProjectById(id) {
  return await Project.findById(id).populate('userId', 'firstName lastName email');
}

async function updateProject(id, data) {
  const project = await Project.findById(id);
  if (!project) return null;
  Object.assign(project, data);
  project.updatedAt = new Date();
  await project.save();
  return project;
}

async function deleteProject(id) {
  return await Project.findByIdAndDelete(id);
}

module.exports = {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject
};
