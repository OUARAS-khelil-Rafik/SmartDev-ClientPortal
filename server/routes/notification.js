const express = require('express');
const { body, validationResult, param, query } = require('express-validator');
const router = express.Router();
const Notification = require('../models/Notification');
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

// GET /api/notifications - Get all notifications for user
router.get('/', authenticate, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    const unreadOnly = req.query.unread === 'true';

    const query = { userId: req.userId };
    if (unreadOnly) query.isRead = false;

    const notifications = await Notification.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Notification.countDocuments(query);
    const unreadCount = await Notification.countDocuments({ 
      userId: req.userId, 
      isRead: false 
    });

    res.json({
      success: true,
      notifications,
      unreadCount,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get notifications error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching notifications'
    });
  }
});

// GET /api/notifications/unread/count - Get unread notifications count
router.get('/unread/count', authenticate, async (req, res) => {
  try {
    const unreadCount = await Notification.countDocuments({ 
      userId: req.userId, 
      isRead: false 
    });

    res.json({
      success: true,
      unreadCount
    });
  } catch (error) {
    console.error('Get unread count error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching unread count'
    });
  }
});

// PUT /api/notifications/:id/read - Mark notification as read
router.put('/:id/read', authenticate, [
  param('id').isMongoId().withMessage('Invalid notification ID')
], handleValidationErrors, async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }

    if (notification.userId.toString() !== req.userId) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this notification'
      });
    }

    notification.isRead = true;
    await notification.save();

    res.json({
      success: true,
      message: 'Notification marked as read',
      notification
    });
  } catch (error) {
    console.error('Mark read error:', error);
    res.status(500).json({
      success: false,
      message: 'Error marking notification as read'
    });
  }
});

// PUT /api/notifications/read-all - Mark all notifications as read
router.put('/read-all', authenticate, async (req, res) => {
  try {
    await Notification.updateMany(
      { userId: req.userId, isRead: false },
      { isRead: true }
    );

    res.json({
      success: true,
      message: 'All notifications marked as read'
    });
  } catch (error) {
    console.error('Mark all read error:', error);
    res.status(500).json({
      success: false,
      message: 'Error marking all notifications as read'
    });
  }
});

// DELETE /api/notifications/:id - Delete notification
router.delete('/:id', authenticate, [
  param('id').isMongoId().withMessage('Invalid notification ID')
], handleValidationErrors, async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }

    if (notification.userId.toString() !== req.userId) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this notification'
      });
    }

    await Notification.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Notification deleted'
    });
  } catch (error) {
    console.error('Delete notification error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting notification'
    });
  }
});

// DELETE /api/notifications/delete-all - Delete all notifications
router.delete('/delete-all', authenticate, async (req, res) => {
  try {
    await Notification.deleteMany({ userId: req.userId });

    res.json({
      success: true,
      message: 'All notifications deleted'
    });
  } catch (error) {
    console.error('Delete all error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting notifications'
    });
  }
});

// ==================== ADMIN ROUTES ====================

// POST /api/notifications/admin/create - Create notification for user (admin only)
router.post('/admin/create', [
  body('userId').isMongoId().withMessage('Valid user ID is required'),
  body('type').isIn(['info', 'success', 'warning', 'error']).withMessage('Invalid notification type'),
  body('title').trim().notEmpty().withMessage('Title is required').isLength({ max: 100 }),
  body('message').trim().notEmpty().withMessage('Message is required').isLength({ max: 500 })
], handleValidationErrors, authenticate, requireAdmin, async (req, res) => {
  try {
    const { userId, type, title, message } = req.body;

    const notification = new Notification({
      userId,
      type,
      title,
      message
    });

    await notification.save();

    res.status(201).json({
      success: true,
      message: 'Notification created successfully',
      notification
    });
  } catch (error) {
    console.error('Create notification error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating notification'
    });
  }
});

// POST /api/notifications/admin/broadcast - Broadcast notification to all users (admin only)
router.post('/admin/broadcast', [
  body('type').isIn(['info', 'success', 'warning', 'error']).withMessage('Invalid notification type'),
  body('title').trim().notEmpty().withMessage('Title is required').isLength({ max: 100 }),
  body('message').trim().notEmpty().withMessage('Message is required').isLength({ max: 500 })
], handleValidationErrors, authenticate, requireAdmin, async (req, res) => {
  try {
    const { type, title, message } = req.body;
    const User = require('../models/User');

    // Get all active users
    const users = await User.find({ isActive: true }, '_id');

    // Create notifications for all users
    const notifications = users.map(user => ({
      userId: user._id,
      type,
      title,
      message
    }));

    await Notification.insertMany(notifications);

    res.status(201).json({
      success: true,
      message: `Notification broadcast to ${users.length} users`,
      count: users.length
    });
  } catch (error) {
    console.error('Broadcast notification error:', error);
    res.status(500).json({
      success: false,
      message: 'Error broadcasting notification'
    });
  }
});

// GET /api/notifications/admin/all - Get all notifications (admin only)
router.get('/admin/all', [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('userId').optional().isMongoId()
], handleValidationErrors, authenticate, requireAdmin, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const filter = {};
    if (req.query.userId) filter.userId = req.query.userId;
    if (req.query.type) filter.type = req.query.type;
    if (req.query.isRead !== undefined) filter.isRead = req.query.isRead === 'true';

    const notifications = await Notification.find(filter)
      .populate('userId', 'firstName lastName email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Notification.countDocuments(filter);

    res.json({
      success: true,
      notifications,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get all notifications error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching notifications'
    });
  }
});

// DELETE /api/notifications/admin/:id - Delete any notification (admin only)
router.delete('/admin/:id', [
  param('id').isMongoId().withMessage('Invalid notification ID')
], handleValidationErrors, authenticate, requireAdmin, async (req, res) => {
  try {
    const notification = await Notification.findByIdAndDelete(req.params.id);

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }

    res.json({
      success: true,
      message: 'Notification deleted successfully'
    });
  } catch (error) {
    console.error('Delete notification error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting notification'
    });
  }
});

module.exports = router;
