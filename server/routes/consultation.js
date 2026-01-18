const express = require('express');
const { body, validationResult } = require('express-validator');
const router = express.Router();
const { sendConsultationMessage } = require('../services/consultationService');
const Consultation = require('../models/Consultation');

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

module.exports = router;
