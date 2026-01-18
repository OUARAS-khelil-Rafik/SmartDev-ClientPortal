const express = require('express');
const { body, validationResult, param, query } = require('express-validator');
const router = express.Router();
const { sendConsultationMessage } = require('../services/consultationService');
const Consultation = require('../models/Consultation');
const { authenticate, requireAdmin } = require('../middleware/auth');

// Validation middleware
const validateConsultation = [
  body('message')
    .trim()
    .notEmpty().withMessage('Message is required')
    .isLength({ max: 5000 }).withMessage('Message must be less than 5000 characters'),
  body('history')
    .optional()
    .isArray().withMessage('History must be an array'),
  // Optional metadata for richer consultation records
  body('email').optional().isEmail().withMessage('Invalid email'),
  body('name').optional().isString().isLength({ max: 200 }).withMessage('Name too long'),
  body('projectType').optional().isIn(['Web', 'Mobile', 'AI', 'Cloud', 'Other']).withMessage('Invalid projectType'),
  body('description').optional().isString().isLength({ max: 5000 }).withMessage('Description too long'),
  body('budget').optional().isIn(['< $5k', '$5k - $25k', '$25k - $50k', '$50k - $100k', '> $100k']).withMessage('Invalid budget'),
  body('timeline').optional().isIn(['ASAP', '1-3 months', '3-6 months', '6+ months']).withMessage('Invalid timeline')
];

// Handle validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      success: false, 
      errors: errors.array() 
    });
  }
  next();
};

// POST /api/consultation - Send consultation message
router.post('/', validateConsultation, handleValidationErrors, async (req, res) => {
  const { message, history = [], email, name, projectType, description, budget, timeline } = req.body;
  let responseText;
  try {
    responseText = await sendConsultationMessage(message, history);
  } catch (error) {
    console.error('Consultation route error:', error);
    // Fallback response when AI is unavailable
    responseText = (
      'Thanks for reaching out! Our AI assistant is currently unavailable. ' +
      'Here’s a quick next step: please share your project type (Web/Mobile/AI/Cloud), a short description, budget range, and timeline. ' +
      'We will follow up promptly with recommendations.'
    );
  }

  try {
    // Build conversation history and persist
    const conversationHistory = [
      ...history.map((h) => ({
        role: h.role === 'model' ? 'model' : 'user',
        message: h.parts?.[0]?.text || h.text || '',
      })),
      { role: 'user', message },
      { role: 'model', message: responseText }
    ];

    const consultationDoc = new Consultation({
      email,
      name,
      projectType,
      description,
      budget,
      timeline,
      conversationHistory,
      status: 'active'
    });

    await consultationDoc.save();

    res.json({ 
      success: true,
      response: responseText,
      consultationId: consultationDoc._id
    });
  } catch (persistError) {
    console.error('Consultation persistence error:', persistError);
    res.status(500).json({ 
      success: false,
      error: 'Failed to persist consultation',
      details: process.env.NODE_ENV === 'development' ? persistError.message : undefined
    });
  }
});

// ==================== ADMIN ROUTES ====================

// GET /api/consultation/admin/all - Get all consultations (admin only)
router.get('/admin/all', [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('status').optional().isIn(['active', 'completed', 'archived']),
  query('projectType').optional().isIn(['Web', 'Mobile', 'AI', 'Cloud', 'Other'])
], handleValidationErrors, authenticate, requireAdmin, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const filter = {};
    if (req.query.status) filter.status = req.query.status;
    if (req.query.projectType) filter.projectType = req.query.projectType;
    if (req.query.search) {
      filter.$or = [
        { name: { $regex: req.query.search, $options: 'i' } },
        { email: { $regex: req.query.search, $options: 'i' } }
      ];
    }

    const consultations = await Consultation.find(filter)
      .populate('userId', 'firstName lastName email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Consultation.countDocuments(filter);

    res.json({
      success: true,
      consultations,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get all consultations error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching consultations'
    });
  }
});

// GET /api/consultation/admin/:id - Get consultation by ID (admin only)
router.get('/admin/:id', [
  param('id').isMongoId().withMessage('Invalid consultation ID')
], handleValidationErrors, authenticate, requireAdmin, async (req, res) => {
  try {
    const consultation = await Consultation.findById(req.params.id)
      .populate('userId', 'firstName lastName email phone');

    if (!consultation) {
      return res.status(404).json({
        success: false,
        message: 'Consultation not found'
      });
    }

    res.json({
      success: true,
      consultation
    });
  } catch (error) {
    console.error('Get consultation error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching consultation'
    });
  }
});

// PUT /api/consultation/admin/:id - Update consultation (admin only)
router.put('/admin/:id', [
  param('id').isMongoId().withMessage('Invalid consultation ID'),
  body('status').optional().isIn(['active', 'completed', 'archived']),
  body('projectType').optional().isIn(['Web', 'Mobile', 'AI', 'Cloud', 'Other']),
  body('budget').optional().isIn(['< $5k', '$5k - $25k', '$25k - $50k', '$50k - $100k', '> $100k']),
  body('timeline').optional().isIn(['ASAP', '1-3 months', '3-6 months', '6+ months'])
], handleValidationErrors, authenticate, requireAdmin, async (req, res) => {
  try {
    const { status, projectType, budget, timeline, description, name, email } = req.body;

    const consultation = await Consultation.findById(req.params.id);

    if (!consultation) {
      return res.status(404).json({
        success: false,
        message: 'Consultation not found'
      });
    }

    if (status) consultation.status = status;
    if (projectType) consultation.projectType = projectType;
    if (budget) consultation.budget = budget;
    if (timeline) consultation.timeline = timeline;
    if (description) consultation.description = description;
    if (name) consultation.name = name;
    if (email) consultation.email = email;
    consultation.updatedAt = new Date();

    await consultation.save();

    res.json({
      success: true,
      message: 'Consultation updated successfully',
      consultation
    });
  } catch (error) {
    console.error('Update consultation error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating consultation'
    });
  }
});

// DELETE /api/consultation/admin/:id - Delete consultation (admin only)
router.delete('/admin/:id', [
  param('id').isMongoId().withMessage('Invalid consultation ID')
], handleValidationErrors, authenticate, requireAdmin, async (req, res) => {
  try {
    const consultation = await Consultation.findByIdAndDelete(req.params.id);

    if (!consultation) {
      return res.status(404).json({
        success: false,
        message: 'Consultation not found'
      });
    }

    res.json({
      success: true,
      message: 'Consultation deleted successfully'
    });
  } catch (error) {
    console.error('Delete consultation error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting consultation'
    });
  }
});

module.exports = router;
