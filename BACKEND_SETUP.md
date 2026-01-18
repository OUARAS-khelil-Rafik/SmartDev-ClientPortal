# SmartDev Project Backend Structure

## 📁 Complete Backend Architecture

```
SmartDev-ClientPortal/
├── server/                          # Backend server directory
│   ├── config/
│   │   ├── database.js              # MongoDB connection setup
│   │   └── gemini.js                # Gemini AI client configuration
│   │
│   ├── middleware/
│   │   ├── auth.js                  # JWT authentication & authorization
│   │   └── errorHandler.js          # Global error handling
│   │
│   ├── models/                      # Database schemas
│   │   ├── User.js                  # User account model
│   │   ├── Booking.js               # Service booking model
│   │   ├── Consultation.js          # AI consultation history model
│   │   └── Notification.js          # User notifications model
│   │
│   ├── routes/                      # API endpoints
│   │   ├── auth.js                  # Auth endpoints (register, login)
│   │   ├── user.js                  # User profile management
│   │   ├── consultation.js          # AI consultation endpoint
│   │   ├── copilot.js               # Website copilot AI endpoint
│   │   ├── booking.js               # Service booking endpoints
│   │   └── notification.js          # Notification endpoints
│   │
│   ├── services/                    # Business logic
│   │   ├── consultationService.js   # Consultation AI logic
│   │   └── copilotService.js        # Copilot AI logic
│   │
│   ├── utils/
│   │   ├── jwt.js                   # JWT utilities (generate, verify)
│   │   └── constants.js             # Constants and enums
│   │
│   ├── index.js                     # Main server entry point
│   ├── seed.js                      # Database seeding script
│   ├── package.json                 # NPM dependencies
│   ├── README.md                    # Backend documentation
│   ├── openapi.json                 # OpenAPI/Swagger specification
│   ├── test-api.sh                  # API testing script
│   ├── .gitignore                   # Git ignore rules
│   └── .env.example                 # Environment template
│
├── api/                             # Serverless functions (Vercel)
│   ├── _aiClient.js
│   ├── consultation.js
│   ├── copilot.js
│   └── health.js
│
├── src/                             # Frontend React app
│   ├── components/                  # React components
│   ├── services/                    # Frontend services
│   ├── i18n/                        # Internationalization
│   └── ...
│
├── .env.example                     # Environment template (root level)
├── .env.local                       # Local environment variables
├── package.json                     # Root package.json
└── ...
```

## 🚀 Getting Started

### 1. Install Backend Dependencies
```bash
cd server
npm install
```

### 2. Setup Environment Variables
```bash
# Copy template to .env.local in project root
cp .env.example .env.local

# Edit with your values:
# - MONGODB_URI
# - GEMINI_API_KEY
# - JWT_SECRET
# - CLIENT_URL
```

### 3. Setup MongoDB
```bash
# Option 1: Local MongoDB
brew services start mongodb-community

# Option 2: Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest

# Option 3: MongoDB Atlas (Cloud)
# Get URI from https://mongodb.com/cloud
```

### 4. Start Backend Server
```bash
cd server
npm run dev
```

### 5. Seed Database (Optional)
```bash
node seed.js
```

## 📚 API Documentation

### Available Endpoints

#### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout

#### User Management
- `GET /api/user/profile` - Get profile (authenticated)
- `PUT /api/user/profile` - Update profile (authenticated)
- `DELETE /api/user/account` - Delete account (authenticated)

#### AI Services
- `POST /api/consultation` - AI project consultant
- `POST /api/copilot` - AI website copilot

#### Bookings
- `GET /api/booking` - List bookings (authenticated)
- `POST /api/booking` - Create booking (authenticated)
- `GET /api/booking/:id` - Get booking details (authenticated)
- `PUT /api/booking/:id` - Update booking (authenticated)
- `DELETE /api/booking/:id` - Cancel booking (authenticated)

#### Notifications
- `GET /api/notifications` - Get notifications (authenticated)
- `GET /api/notifications/unread/count` - Unread count (authenticated)
- `PUT /api/notifications/:id/read` - Mark as read (authenticated)
- `DELETE /api/notifications/:id` - Delete notification (authenticated)

#### System
- `GET /api/health` - Server health check

## 🔐 Security Features

✅ JWT token authentication
✅ Password hashing with bcryptjs
✅ Input validation & sanitization
✅ Error handling middleware
✅ CORS protection
✅ Authorization checks
✅ Environment variable protection

## 📦 Key Dependencies

```json
{
  "express": "^4.18.2",
  "mongoose": "^8.0.0",
  "bcryptjs": "^2.4.3",
  "jsonwebtoken": "^9.1.2",
  "express-validator": "^7.0.0",
  "@google/genai": "^1.30.0",
  "cors": "^2.8.5",
  "morgan": "^1.10.0",
  "dotenv": "^16.3.1"
}
```

## 🧪 Testing

### Test API Endpoints
```bash
bash server/test-api.sh
```

### Manual Testing with cURL
```bash
# Health check
curl http://localhost:3001/api/health

# Consultation
curl -X POST http://localhost:3001/api/consultation \
  -H "Content-Type: application/json" \
  -d '{"message": "I need a web app"}'
```

## 📝 Environment Variables Required

```env
PORT=3001
NODE_ENV=development
CLIENT_URL=http://localhost:5173
MONGODB_URI=mongodb://localhost:27017/smartdev
GEMINI_API_KEY=your_gemini_api_key
JWT_SECRET=your_jwt_secret_key
```

## 🎯 Features Implemented

✅ Express.js server with CORS
✅ MongoDB integration with Mongoose
✅ JWT authentication & authorization
✅ Input validation with express-validator
✅ Error handling middleware
✅ Gemini AI integration (Consultant & Copilot)
✅ User authentication & profile management
✅ Booking system
✅ Notification management
✅ Request logging with Morgan
✅ Environment configuration
✅ Database seeding
✅ API documentation (OpenAPI/Swagger)

## 📖 Documentation

- [Backend README](./server/README.md) - Detailed backend documentation
- [Environment Setup](./.env.example) - Configuration guide
- [OpenAPI Spec](./server/openapi.json) - API specification
- [API Testing](./server/test-api.sh) - Test script

## 🔗 Integration with Frontend

The backend is fully integrated with the React frontend:

### Frontend API Client
```javascript
// src/services/api.js (to be created)
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

export const apiClient = {
  consultation: (message, history) => 
    fetch(`${API_BASE_URL}/consultation`, {
      method: 'POST',
      body: JSON.stringify({ message, history })
    }),
  // ... other methods
};
```

### Using in Components
```javascript
// src/components/AIConsultant.tsx
import { apiClient } from '../services/api';

export const AIConsultant = () => {
  const [response, setResponse] = useState('');
  
  const handleSendMessage = async (message) => {
    const result = await apiClient.consultation(message, []);
    setResponse(result.response);
  };
  
  // ...
};
```

## 🚀 Deployment Options

### Production Ready
- Railway.app
- Heroku
- AWS EC2
- DigitalOcean
- Azure App Service
- Google Cloud Run

### Environment for Production
```env
NODE_ENV=production
PORT=3001
CLIENT_URL=https://yourdomain.com
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/smartdev
JWT_SECRET=use_strong_random_secret_here
GEMINI_API_KEY=your_production_key
```

## ✅ Verification Checklist

- [ ] MongoDB is running and accessible
- [ ] `.env.local` is created with all required variables
- [ ] `npm install` completed successfully
- [ ] Server starts without errors: `npm run dev`
- [ ] Health check works: `http://localhost:3001/api/health`
- [ ] Database seeded: `node seed.js`
- [ ] Frontend can reach backend API
- [ ] AI endpoints responding with Gemini responses

## 📞 Troubleshooting

| Issue | Solution |
|-------|----------|
| MongoDB connection error | Ensure MongoDB is running, check MONGODB_URI in .env.local |
| 404 on routes | Verify routes are imported in index.js |
| Gemini API error | Check GEMINI_API_KEY is valid and set in .env.local |
| CORS error | Verify CLIENT_URL in .env.local matches frontend URL |
| Port already in use | Change PORT in .env.local or kill process on port 3001 |

## 📞 Support

For issues or questions:
1. Check [Backend README](./server/README.md)
2. Review [Environment Setup](./.env.example)
3. Check server logs: `npm run dev`
4. Test with: `bash server/test-api.sh`

---

**Backend Status**: ✅ Complete and Ready for Development!
