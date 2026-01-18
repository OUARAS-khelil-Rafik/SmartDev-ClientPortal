const express = require('express');
const { body, validationResult } = require('express-validator');
const router = express.Router();
const { sendCopilotMessage } = require('../services/copilotService');

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
  try {
    const { message, history } = req.body;

    const response = await sendCopilotMessage(message, history);

    res.json({ 
      success: true,
      response 
    });
  } catch (error) {
    console.error('Copilot route error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Error with AI service',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

module.exports = router;
