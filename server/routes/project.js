const express = require('express');
const { body, param, query, validationResult } = require('express-validator');
const router = express.Router();
const Project = require('../models/Project');
const { authenticate, requireAdmin } = require('../middleware/auth');

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }
  next();
};

// GET /api/projects - list user's projects
router.get('/', authenticate, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;

    const projects = await Project.find({ userId: req.userId })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await Project.countDocuments({ userId: req.userId });

    res.json({ success: true, projects, pagination: { page, limit, total, pages: Math.ceil(total / limit) } });
  } catch (error) {
    console.error('Get projects error:', error);
    res.status(500).json({ success: false, message: 'Error fetching projects' });
  }
});

// POST /api/projects - create project
router.post('/', authenticate, [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('status').optional().isIn(['planned', 'active', 'in-progress', 'completed', 'on-hold', 'cancelled'])
], handleValidationErrors, async (req, res) => {
  try {
    const data = Object.assign({}, req.body, { userId: req.userId });
    const project = new Project(data);
    await project.save();
    res.status(201).json({ success: true, message: 'Project created', project });
  } catch (error) {
    console.error('Create project error:', error);
    res.status(500).json({ success: false, message: 'Error creating project' });
  }
});

// GET /api/projects/:id - get project details
router.get('/:id', [param('id').isMongoId().withMessage('Invalid project ID')], handleValidationErrors, authenticate, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ success: false, message: 'Project not found' });
    if (project.userId.toString() !== req.userId && req.userRole !== 'admin' && req.userRole !== 'developer') {
      // allow admins and developers via separate admin endpoints
      return res.status(403).json({ success: false, message: 'Not authorized to view this project' });
    }
    res.json({ success: true, project });
  } catch (error) {
    console.error('Get project error:', error);
    res.status(500).json({ success: false, message: 'Error fetching project' });
  }
});

// PUT /api/projects/:id - update own project
router.put('/:id', authenticate, [param('id').isMongoId().withMessage('Invalid project ID')], handleValidationErrors, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ success: false, message: 'Project not found' });
    if (project.userId.toString() !== req.userId) {
      return res.status(403).json({ success: false, message: 'Not authorized to update this project' });
    }
    Object.assign(project, req.body);
    project.updatedAt = new Date();
    await project.save();
    res.json({ success: true, message: 'Project updated', project });
  } catch (error) {
    console.error('Update project error:', error);
    res.status(500).json({ success: false, message: 'Error updating project' });
  }
});

// DELETE /api/projects/:id - delete own project
router.delete('/:id', authenticate, [param('id').isMongoId().withMessage('Invalid project ID')], handleValidationErrors, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ success: false, message: 'Project not found' });
    if (project.userId.toString() !== req.userId) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this project' });
    }
    await Project.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Project deleted' });
  } catch (error) {
    console.error('Delete project error:', error);
    res.status(500).json({ success: false, message: 'Error deleting project' });
  }
});

// ADMIN: get all projects
router.get('/admin/all', authenticate, requireAdmin, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const skip = (page - 1) * limit;
    const filter = {};
    const projects = await Project.find(filter)
      .populate('userId', 'firstName lastName email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    const total = await Project.countDocuments(filter);
    res.json({ success: true, projects, pagination: { page, limit, total, pages: Math.ceil(total / limit) } });
  } catch (error) {
    console.error('Admin get projects error:', error);
    res.status(500).json({ success: false, message: 'Error fetching projects' });
  }
});

module.exports = router;
