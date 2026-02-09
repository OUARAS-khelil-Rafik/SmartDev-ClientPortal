// API Response Status Codes
const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_ERROR: 500
};

// User Roles
const USER_ROLES = {
  USER: 'user',
  ADMIN: 'admin'
};
USER_ROLES.DEVELOPER = 'developer';

// Booking Status
const BOOKING_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  IN_PROGRESS: 'in-progress',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled'
};

// Service Names
const SERVICE_NAMES = {
  WEB: 'Web Development',
  MOBILE: 'Mobile App',
  AI: 'AI Solution',
  CLOUD: 'Cloud Services',
  CONSULTATION: 'Consultation'
};

// Timeline Options
const TIMELINE_OPTIONS = {
  QUICK: '1-2 weeks',
  SHORT: '2-4 weeks',
  MEDIUM: '1-3 months',
  LONG: '3-6 months',
  EXTENDED: '6+ months'
};

// Budget Ranges
const BUDGET_RANGES = {
  SMALL: '< $5k',
  MEDIUM: '$5k - $25k',
  LARGE: '$25k - $50k',
  ENTERPRISE: '$50k - $100k',
  CUSTOM: '> $100k'
};

// Notification Types
const NOTIFICATION_TYPES = {
  BOOKING: 'booking',
  CONSULTATION: 'consultation',
  MESSAGE: 'message',
  SYSTEM: 'system',
  PROMOTION: 'promotion'
};

// Error Messages
const ERROR_MESSAGES = {
  VALIDATION_ERROR: 'Validation error',
  UNAUTHORIZED: 'Unauthorized access',
  FORBIDDEN: 'Access forbidden',
  NOT_FOUND: 'Resource not found',
  CONFLICT: 'Resource already exists',
  SERVER_ERROR: 'Internal server error',
  INVALID_TOKEN: 'Invalid or expired token',
  INVALID_CREDENTIALS: 'Invalid email or password'
};

// Success Messages
const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: 'Login successful',
  REGISTER_SUCCESS: 'User registered successfully',
  CREATE_SUCCESS: 'Resource created successfully',
  UPDATE_SUCCESS: 'Resource updated successfully',
  DELETE_SUCCESS: 'Resource deleted successfully'
};

module.exports = {
  HTTP_STATUS,
  USER_ROLES,
  BOOKING_STATUS,
  SERVICE_NAMES,
  TIMELINE_OPTIONS,
  BUDGET_RANGES,
  NOTIFICATION_TYPES,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES
};
