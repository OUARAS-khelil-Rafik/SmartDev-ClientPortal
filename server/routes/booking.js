const express = require('express');
const { body, validationResult, param, query } = require('express-validator');
const router = express.Router();
const Booking = require('../models/Booking');
const { authenticate, requireAdmin } = require('../middleware/auth');

// Validation helper
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

// GET /api/booking - Get all user bookings
router.get('/', authenticate, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const bookings = await Booking.find({ userId: req.userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Booking.countDocuments({ userId: req.userId });

    res.json({
      success: true,
      bookings,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get bookings error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching bookings'
    });
  }
});

// POST /api/booking - Create new booking
router.post('/', authenticate, [
  body('serviceName').isIn(['Web Development', 'Mobile App', 'AI Solution', 'Cloud Services', 'Consultation']),
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('budget').isNumeric().withMessage('Budget must be a number'),
  body('timeline').isIn(['1-2 weeks', '2-4 weeks', '1-3 months', '3-6 months', '6+ months']),
  body('preferredStartDate').isISO8601().withMessage('Valid date is required')
], handleValidationErrors, async (req, res) => {
  try {
    const { serviceName, title, description, budget, timeline, preferredStartDate, notes } = req.body;

    const booking = new Booking({
      userId: req.userId,
      serviceName,
      title,
      description,
      budget,
      timeline,
      preferredStartDate,
      notes
    });

    await booking.save();

    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      booking
    });
  } catch (error) {
    console.error('Create booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating booking'
    });
  }
});

// GET /api/booking/:id - Get booking details
router.get('/:id', [
  param('id').isMongoId().withMessage('Invalid booking ID')
], handleValidationErrors, authenticate, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Check if user owns this booking
    if (booking.userId.toString() !== req.userId) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this booking'
      });
    }

    res.json({
      success: true,
      booking
    });
  } catch (error) {
    console.error('Get booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching booking'
    });
  }
});

// PUT /api/booking/:id - Update booking
router.put('/:id', authenticate, [
  param('id').isMongoId().withMessage('Invalid booking ID'),
  body('title').optional().trim().notEmpty(),
  body('description').optional().trim().notEmpty(),
  body('status').optional().isIn(['pending', 'confirmed', 'in-progress', 'completed', 'cancelled'])
], handleValidationErrors, async (req, res) => {
  try {
    const { title, description, budget, timeline, status, notes } = req.body;

    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    if (booking.userId.toString() !== req.userId) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this booking'
      });
    }

    if (title) booking.title = title;
    if (description) booking.description = description;
    if (budget) booking.budget = budget;
    if (timeline) booking.timeline = timeline;
    if (status) booking.status = status;
    if (notes) booking.notes = notes;
    booking.updatedAt = new Date();

    await booking.save();

    res.json({
      success: true,
      message: 'Booking updated successfully',
      booking
    });
  } catch (error) {
    console.error('Update booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating booking'
    });
  }
});

// DELETE /api/booking/:id - Cancel booking
router.delete('/:id', authenticate, [
  param('id').isMongoId().withMessage('Invalid booking ID')
], handleValidationErrors, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    if (booking.userId.toString() !== req.userId) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this booking'
      });
    }

    await Booking.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Booking cancelled successfully'
    });
  } catch (error) {
    console.error('Delete booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Error cancelling booking'
    });
  }
});

// ==================== ADMIN ROUTES ====================

// GET /api/booking/admin/all - Get all bookings (admin only)
router.get('/admin/all', [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('status').optional().isIn(['pending', 'confirmed', 'in-progress', 'completed', 'cancelled']),
  query('serviceName').optional().isIn(['Web Development', 'Mobile App', 'AI Solution', 'Cloud Services', 'Consultation'])
], handleValidationErrors, authenticate, requireAdmin, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const filter = {};
    if (req.query.status) filter.status = req.query.status;
    if (req.query.serviceName) filter.serviceName = req.query.serviceName;
    if (req.query.userId) filter.userId = req.query.userId;

    const bookings = await Booking.find(filter)
      .populate('userId', 'firstName lastName email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Booking.countDocuments(filter);

    res.json({
      success: true,
      bookings,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get all bookings error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching bookings'
    });
  }
});

// GET /api/booking/admin/:id - Get any booking by ID (admin only)
router.get('/admin/:id', [
  param('id').isMongoId().withMessage('Invalid booking ID')
], handleValidationErrors, authenticate, requireAdmin, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('userId', 'firstName lastName email phone company');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    res.json({
      success: true,
      booking
    });
  } catch (error) {
    console.error('Get booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching booking'
    });
  }
});

// PUT /api/booking/admin/:id - Update any booking (admin only)
router.put('/admin/:id', [
  param('id').isMongoId().withMessage('Invalid booking ID'),
  body('status').optional().isIn(['pending', 'confirmed', 'in-progress', 'completed', 'cancelled'])
], handleValidationErrors, authenticate, requireAdmin, async (req, res) => {
  try {
    const { title, description, budget, timeline, status, notes } = req.body;

    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    if (title) booking.title = title;
    if (description) booking.description = description;
    if (budget) booking.budget = budget;
    if (timeline) booking.timeline = timeline;
    if (status) booking.status = status;
    if (notes) booking.notes = notes;
    booking.updatedAt = new Date();

    await booking.save();

    res.json({
      success: true,
      message: 'Booking updated successfully',
      booking
    });
  } catch (error) {
    console.error('Update booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating booking'
    });
  }
});

// DELETE /api/booking/admin/:id - Delete any booking (admin only)
router.delete('/admin/:id', [
  param('id').isMongoId().withMessage('Invalid booking ID')
], handleValidationErrors, authenticate, requireAdmin, async (req, res) => {
  try {
    const booking = await Booking.findByIdAndDelete(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    res.json({
      success: true,
      message: 'Booking deleted successfully'
    });
  } catch (error) {
    console.error('Delete booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting booking'
    });
  }
});

module.exports = router;
