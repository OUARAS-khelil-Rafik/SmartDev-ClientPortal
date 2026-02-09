# SmartDev Backend API

## Overview

Complete Node.js/Express backend server for SmartDev Client Portal with:
- 🤖 AI-powered consultation and copilot features (Gemini)
- 📚 MongoDB database with comprehensive models
- 🔐 JWT authentication and authorization
- 📋 User, Booking, Consultation, and Notification management
- ✅ Input validation and error handling
- 📝 RESTful API architecture

## Quick Start

### 1. Prerequisites
- Node.js v16+
- MongoDB (local or Atlas)
- Gemini API Key

### 2. Installation

```bash
cd server
npm install
```

### 3. Environment Setup

Create `.env.local` in project root:

```env
# Server
PORT=3001
NODE_ENV=development
CLIENT_URL=http://localhost:5173

# Database
MONGODB_URI=mongodb://localhost:27017/smartdev

# AI
GEMINI_API_KEY=your_key_here

# JWT
JWT_SECRET=your_secret_key_here
```

### 4. Run Server

```bash
npm run dev  # Development mode
npm start    # Production mode
```

### 5. Seed Database (Optional)

```bash
node seed.js
```

## Project Structure

```
server/
├── config/
│   ├── database.js          # MongoDB connection
│   └── gemini.js            # Gemini AI client
├── middleware/
│   ├── auth.js              # Authentication
│   └── errorHandler.js      # Error handling
├── models/
│   ├── User.js              # User schema
│   ├── Booking.js           # Booking schema
│   ├── Consultation.js      # Consultation schema
│   └── Notification.js      # Notification schema
├── routes/
│   ├── auth.js              # Authentication endpoints
│   ├── consultation.js      # Consultation endpoints
│   ├── copilot.js           # Copilot endpoints
│   ├── user.js              # User endpoints
│   ├── booking.js           # Booking endpoints
│   └── notification.js      # Notification endpoints
├── services/
│   ├── consultationService.js    # Consultation logic
│   └── copilotService.js         # Copilot logic
├── utils/
│   ├── jwt.js               # JWT utilities
│   └── constants.js         # Constants and enums
├── index.js                 # Main server file
├── seed.js                  # Database seeding
├── package.json             # Dependencies
└── README.md                # This file
```

## API Endpoints

### Health & System

```
GET /api/health
```

### Authentication

```
POST   /api/auth/register      # Register new user
POST   /api/auth/login         # User login
POST   /api/auth/logout        # User logout
```

**Register/Login Request:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "+33612345678",
  "company": "My Company"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

### User Management

```
GET    /api/user/profile       # Get current user profile
PUT    /api/user/profile       # Update profile
DELETE /api/user/account       # Delete account
GET    /api/user/:id           # Get user by ID
```

**Update Profile Request:**
```json
{
  "firstName": "Jane",
  "lastName": "Smith",
  "phone": "+33687654321",
  "company": "New Company",
  "avatar": "https://..."
}
```

### Consultation AI

```
POST /api/consultation
```

**Request:**
```json
{
  "message": "I want to build a web app",
  "history": [
    { "role": "user", "text": "Previous message" },
    { "role": "model", "text": "Previous response" }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "response": "AI generated response here..."
}
```

### Copilot AI

```
POST /api/copilot
```

Same format as consultation endpoint.

### Bookings

```
GET    /api/booking            # Get user bookings
POST   /api/booking            # Create new booking
GET    /api/booking/:id        # Get booking details
PUT    /api/booking/:id        # Update booking
DELETE /api/booking/:id        # Cancel booking
```

**Create Booking Request:**
```json
{
  "serviceName": "Web Development",
  "title": "E-commerce Platform",
  "description": "Full-stack e-commerce solution",
  "budget": 25000,
  "timeline": "2-4 weeks",
  "preferredStartDate": "2026-02-15"
}
```

**Available Services:**
- Web Development
- Mobile App
- AI Solution
- Cloud Services
- Consultation

**Available Timelines:**
- 1-2 weeks
- 2-4 weeks
- 1-3 months
- 3-6 months
- 6+ months

### Notifications

```
GET    /api/notifications           # Get all notifications
GET    /api/notifications/unread/count  # Get unread count
PUT    /api/notifications/:id/read  # Mark as read
PUT    /api/notifications/read-all  # Mark all as read
DELETE /api/notifications/:id       # Delete notification
DELETE /api/notifications/delete-all # Delete all
```

## Authentication

All protected endpoints require a Bearer token in the Authorization header:

```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:3001/api/user/profile
```

## Database Models

### User Schema
- firstName (string, required)
- lastName (string, required)
- email (string, unique, required)
- phone (string, optional)
- password (string, hashed)
- company (string, optional)
- role (enum: 'user', 'admin')
- avatar (string, optional)
- isActive (boolean)
- createdAt, updatedAt

### Booking Schema
- userId (ObjectId, required)
- serviceName (enum, required)
- title (string, required)
- description (string, required)
- budget (number, required)
- timeline (enum, required)
- preferredStartDate (date, required)
- status (enum: pending, confirmed, in-progress, completed, cancelled)
- attachments (array of files)
- notes (string)
- createdAt, updatedAt

### Consultation Schema
- userId (ObjectId, optional)
- email (string, required)
- name (string, required)
- projectType (enum, required)
- description (string, optional)
- budget (string, optional)
- timeline (string, optional)
- conversationHistory (array)
- status (enum: active, completed, archived)
- createdAt, updatedAt

### Notification Schema
- userId (ObjectId, required)
- type (enum: booking, consultation, message, system, promotion)
- title (string, required)
- message (string, required)
- icon (string)
- color (enum: info, success, warning, error)
- isRead (boolean)
- relatedId (ObjectId, optional)
- actionUrl (string, optional)
- createdAt, updatedAt, expiresAt

## Testing

### Using the Test Script

```bash
bash server/test-api.sh
```

### Manual Testing with cURL

```bash
# Health check
curl http://localhost:3001/api/health

# Register user
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "password": "password123"
  }'

# Login
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Using Postman

1. Import `server/openapi.json` into Postman
2. Use the generated collection to test endpoints
3. Add Bearer token to Authorization tab for protected routes

## Error Handling

The API returns standardized error responses:

```json
{
  "success": false,
  "message": "Error description",
  "errors": [
    {
      "field": "email",
      "message": "Valid email is required"
    }
  ]
}
```

## Features

✅ **AI Integration**
- Gemini 2.0 Flash for consultation
- Real-time chat with history
- Multi-language support (EN/FR)

✅ **Authentication**
- JWT tokens
- Password hashing with bcryptjs
- Role-based access control

✅ **Database**
- MongoDB with Mongoose
- Auto-generated timestamps
- Data validation at schema level

✅ **API**
- RESTful architecture
- Input validation
- Error handling middleware
- CORS support
- Request logging (Morgan)

✅ **Security**
- Password hashing
- JWT token verification
- Authorization checks
- Input sanitization

## Development

### Scripts

```bash
npm run dev      # Run with auto-reload
npm start        # Run in production mode
npm test         # Run tests
npm run lint     # Run ESLint
node seed.js     # Seed database
bash test-api.sh # Test API endpoints
```

### Dependencies

- **express** - Web framework
- **mongoose** - MongoDB ODM
- **bcryptjs** - Password hashing
- **jsonwebtoken** - JWT tokens
- **express-validator** - Input validation
- **@google/genai** - Gemini AI
- **cors** - CORS middleware
- **morgan** - Request logging
- **dotenv** - Environment variables

## Deployment

### Using Railway

```bash
# Install Railway CLI
npm install -g railway

# Login to Railway
railway login

# Initialize project
railway init

# Deploy
railway up
```

### Using Heroku

```bash
# Install Heroku CLI
npm install -g heroku

# Login
heroku login

# Create app
heroku create smartdev-api

# Set environment variables
heroku config:set JWT_SECRET=your_secret
heroku config:set GEMINI_API_KEY=your_key
heroku config:set MONGODB_URI=your_uri

# Deploy
git push heroku main
```

### Using Docker

```bash
docker build -t smartdev-api .
docker run -p 3001:3001 -e PORT=3001 smartdev-api
```

## Troubleshooting

### MongoDB Connection Error
```bash
# Check if MongoDB is running
mongosh

# If not, start MongoDB
brew services start mongodb-community
# or
docker run -d -p 27017:27017 mongo
```

### Port 3001 Already in Use
```bash
# Find process
lsof -i :3001

# Kill process
kill -9 <PID>

# Or use different port
PORT=3001 npm run dev
```

### Missing Environment Variables
- Copy `.env.example` to `.env.local`
- Fill in all required values
- Restart server

### Invalid Gemini API Key
- Get key from https://ai.google.dev
- Ensure it's set in `.env.local`
- Check for extra spaces or quotes

## Support & Documentation

- 📖 [Express Documentation](https://expressjs.com/)
- 🍃 [Mongoose Documentation](https://mongoosejs.com/)
- 🔐 [JWT Documentation](https://jwt.io/)
- 🤖 [Gemini API](https://ai.google.dev/)
- 📚 [MongoDB Documentation](https://docs.mongodb.com/)

## License

MIT - See LICENSE file for details

## Contributors

- SmartDev Team

## Notes

- Keep API keys secure in `.env.local`
- Change JWT_SECRET in production
- Use HTTPS in production
- Enable rate limiting for production
- Set up database backups
- Monitor error logs regularly

