const express = require('express');
const { body, validationResult } = require('express-validator');
const router = express.Router();
const { sendCopilotMessage } = require('../services/copilotService');
const Consultation = require('../models/Consultation');

// Validation middleware
const validateCopilot = [
  body('message')
    .trim()
    .notEmpty().withMessage('Message is required')
    .isLength({ max: 5000 }).withMessage('Message must be less than 5000 characters'),
  body('history')
    .optional()
    .isArray().withMessage('History must be an array')
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

// POST /api/copilot - Send copilot message
router.post('/', validateCopilot, handleValidationErrors, async (req, res) => {
  const { message, history = [] } = req.body;
  let responseText;
  try {
    responseText = await sendCopilotMessage(message, history);
  } catch (error) {
    console.error('Copilot route error:', error);
    // Fallback copilot response when AI is unavailable
    responseText = (
      'Hi! The copilot is momentarily unavailable. You can explore Services (Web, Mobile, AI, Cloud) ' +
      'or ask for pricing and timelines. Tell me what you need, and we’ll assist shortly.'
    );
  }

  try {
    // Persist interaction as a lightweight consultation record
    const conversationHistory = [
      ...history.map((h) => ({
        role: h.role === 'model' ? 'model' : 'user',
        message: h.parts?.[0]?.text || h.text || '',
      })),
      { role: 'user', message },
      { role: 'model', message: responseText }
    ];

    const doc = new Consultation({
      projectType: 'AI',
      conversationHistory,
      status: 'active'
    });
    await doc.save();

    res.json({ 
      success: true,
      response: responseText,
      interactionId: doc._id
    });
  } catch (persistError) {
    console.error('Copilot persistence error:', persistError);
    res.status(500).json({ 
      success: false,
      error: 'Failed to persist interaction',
      details: process.env.NODE_ENV === 'development' ? persistError.message : undefined
    });
  }
});

module.exports = router;
