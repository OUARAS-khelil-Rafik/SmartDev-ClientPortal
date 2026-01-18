const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env.local') });

// Import database connection
const { connectDB, disconnectDB } = require('./config/database');
const { initializeDefaultAdmin } = require('./initialize-admin');

const app = express();
// Normalize PORT to a valid number; fallback to 3003
const normalizePort = (val) => {
  const port = parseInt(val, 10);
  if (!isNaN(port) && port > 0) return port;
  return 3003;
};
const PORT = normalizePort(process.env.PORT);

// ==================== Database Connection ====================
connectDB();

// ==================== Initialize Default Admin ====================
initializeDefaultAdmin().catch(error => {
  console.error('Warning: Could not initialize admin user:', error.message);
  // Continue anyway - admin can be created manually
});

// ==================== Middleware ====================
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(morgan('combined'));

// ==================== Health Check ====================
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// ==================== Root Route ====================
app.get('/', (req, res) => {
  res.json({
    name: 'SmartDev AI API',
    status: 'OK',
    health: '/api/health',
    docs: '/api/docs'
  });
});

// ==================== API Routes ====================
// Import routes
const consultationRoutes = require('./routes/consultation');
const copilotRoutes = require('./routes/copilot');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const bookingRoutes = require('./routes/booking');
const notificationRoutes = require('./routes/notification');
const fs = require('fs');

// Simple Docs route serving OpenAPI JSON if present
app.get('/api/docs', (req, res) => {
  const docPath = path.join(__dirname, 'openapi.json');
  try {
    if (fs.existsSync(docPath)) {
      const json = fs.readFileSync(docPath, 'utf8');
      res.type('application/json').send(json);
    } else {
      res.status(200).json({
        message: 'OpenAPI document not found. See server/README.md.',
        path: '/server/openapi.json'
      });
    }
  } catch (err) {
    res.status(500).json({ message: 'Failed to load docs', error: err.message });
  }
});

// Register routes
app.use('/api/consultation', consultationRoutes);
app.use('/api/copilot', copilotRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/booking', bookingRoutes);
app.use('/api/notifications', notificationRoutes);

// ==================== Error Handling ====================
// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    path: req.path
  });
});

// Error Handler Middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// ==================== Start Server ====================
let server;
if (require.main === module) {
  server = app.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
    console.log(`📝 API Documentation: http://localhost:${PORT}/api/docs`);
  });

  const shutdown = async (signal) => {
    try {
      console.log(`\n${signal} received. Shutting down gracefully...`);
      if (server) {
        await new Promise((resolve) => server.close(resolve));
        console.log('HTTP server closed');
      }
      await disconnectDB();
      process.exit(0);
    } catch (err) {
      console.error('Error during shutdown:', err);
      process.exit(1);
    }
  };

  process.on('SIGINT', () => shutdown('SIGINT'));
  process.on('SIGTERM', () => shutdown('SIGTERM'));
}

module.exports = app;
