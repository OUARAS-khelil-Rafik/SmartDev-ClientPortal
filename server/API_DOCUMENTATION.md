# API Documentation - SmartDev Client Portal

## Base URL
```
http://localhost:3003/api
```

## Authentication
Toutes les routes protégées nécessitent un token JWT dans le header :
```
Authorization: Bearer <token>
```

---

## 📋 Table des matières

1. [Authentication](#authentication-routes)
2. [Users](#user-routes)
3. [Bookings](#booking-routes)
4. [Consultations](#consultation-routes)
5. [Notifications](#notification-routes)

---

## 🔐 Authentication Routes

### Register
```http
POST /api/auth/register
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "+1234567890",
  "company": "Tech Corp"
}
```

### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

---

## 👤 User Routes

### Get Current User Profile
```http
GET /api/user/profile
Authorization: Bearer <token>
```

### Update Current User Profile
```http
PUT /api/user/profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+1234567890",
  "company": "New Company"
}
```

### Delete Own Account
```http
DELETE /api/user/account
Authorization: Bearer <token>
```

### 🔑 Admin: Get User by ID
```http
GET /api/user/:id
Authorization: Bearer <admin_token>
```

### 🔑 Admin: Get All Users
```http
GET /api/user/admin/all?page=1&limit=20&role=user&search=john
Authorization: Bearer <admin_token>
```

Query Parameters:
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 20)
- `role` (optional): Filter by role (user/admin)
- `isActive` (optional): Filter by active status (true/false)
- `search` (optional): Search in firstName, lastName, email

### 🔑 Admin: Update User
```http
PUT /api/user/admin/:id
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "role": "admin",
  "isActive": true,
  "firstName": "Updated Name"
}
```

### 🔑 Admin: Delete User
```http
DELETE /api/user/admin/:id
Authorization: Bearer <admin_token>
```

---

## 📅 Booking Routes

### Get User's Bookings
```http
GET /api/booking?page=1&limit=10
Authorization: Bearer <token>
```

### Create Booking
```http
POST /api/booking
Authorization: Bearer <token>
Content-Type: application/json

{
  "serviceName": "Web Development",
  "title": "E-commerce Website",
  "description": "Need a full e-commerce solution",
  "budget": 5000,
  "timeline": "2-4 weeks",
  "preferredStartDate": "2026-02-01",
  "notes": "Optional notes"
}
```

Service Names:
- Web Development
- Mobile App
- AI Solution
- Cloud Services
- Consultation

Timelines:
- 1-2 weeks
- 2-4 weeks
- 1-3 months
- 3-6 months
- 6+ months

### Get Booking by ID
```http
GET /api/booking/:id
Authorization: Bearer <token>
```

### Update Booking
```http
PUT /api/booking/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Updated title",
  "description": "Updated description",
  "status": "in-progress"
}
```

Status Values:
- pending
- confirmed
- in-progress
- completed
- cancelled

### Delete Booking
```http
DELETE /api/booking/:id
Authorization: Bearer <token>
```

### 🔑 Admin: Get All Bookings
```http
GET /api/booking/admin/all?page=1&limit=20&status=pending&serviceName=Web Development
Authorization: Bearer <admin_token>
```

Query Parameters:
- `page` (optional): Page number
- `limit` (optional): Items per page
- `status` (optional): Filter by status
- `serviceName` (optional): Filter by service
- `userId` (optional): Filter by user ID

### 🔑 Admin: Get Booking by ID
```http
GET /api/booking/admin/:id
Authorization: Bearer <admin_token>
```

### 🔑 Admin: Update Booking
```http
PUT /api/booking/admin/:id
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "status": "confirmed",
  "notes": "Admin notes"
}
```

### 🔑 Admin: Delete Booking
```http
DELETE /api/booking/admin/:id
Authorization: Bearer <admin_token>
```

---

## 💬 Consultation Routes

### Create Consultation (Public)
```http
POST /api/consultation
Content-Type: application/json

{
  "message": "I need help with a web project",
  "history": [],
  "email": "client@example.com",
  "name": "John Doe",
  "projectType": "Web",
  "description": "E-commerce platform",
  "budget": "$5k - $25k",
  "timeline": "1-3 months"
}
```

Project Types:
- Web
- Mobile
- AI
- Cloud
- Other

Budget Ranges:
- < $5k
- $5k - $25k
- $25k - $50k
- $50k - $100k
- > $100k

Timelines:
- ASAP
- 1-3 months
- 3-6 months
- 6+ months

### 🔑 Admin: Get All Consultations
```http
GET /api/consultation/admin/all?page=1&limit=20&status=active&projectType=Web
Authorization: Bearer <admin_token>
```

Query Parameters:
- `page` (optional): Page number
- `limit` (optional): Items per page
- `status` (optional): active/completed/archived
- `projectType` (optional): Web/Mobile/AI/Cloud/Other
- `search` (optional): Search in name or email

### 🔑 Admin: Get Consultation by ID
```http
GET /api/consultation/admin/:id
Authorization: Bearer <admin_token>
```

### 🔑 Admin: Update Consultation
```http
PUT /api/consultation/admin/:id
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "status": "completed",
  "projectType": "Web",
  "budget": "$25k - $50k"
}
```

### 🔑 Admin: Delete Consultation
```http
DELETE /api/consultation/admin/:id
Authorization: Bearer <admin_token>
```

---

## 🔔 Notification Routes

### Get User Notifications
```http
GET /api/notifications?page=1&limit=20&unread=true
Authorization: Bearer <token>
```

### Get Unread Count
```http
GET /api/notifications/unread/count
Authorization: Bearer <token>
```

### Mark Notification as Read
```http
PUT /api/notifications/:id/read
Authorization: Bearer <token>
```

### Mark All as Read
```http
PUT /api/notifications/read-all
Authorization: Bearer <token>
```

### Delete Notification
```http
DELETE /api/notifications/:id
Authorization: Bearer <token>
```

### Delete All Notifications
```http
DELETE /api/notifications/delete-all
Authorization: Bearer <token>
```

### 🔑 Admin: Create Notification for User
```http
POST /api/notifications/admin/create
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "userId": "user_mongodb_id",
  "type": "info",
  "title": "Welcome!",
  "message": "Thanks for joining SmartDev"
}
```

Notification Types:
- info
- success
- warning
- error

### 🔑 Admin: Broadcast Notification
```http
POST /api/notifications/admin/broadcast
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "type": "info",
  "title": "System Maintenance",
  "message": "The system will be down for maintenance on..."
}
```

### 🔑 Admin: Get All Notifications
```http
GET /api/notifications/admin/all?page=1&limit=20&userId=user_id
Authorization: Bearer <admin_token>
```

### 🔑 Admin: Delete Notification
```http
DELETE /api/notifications/admin/:id
Authorization: Bearer <admin_token>
```

---

## 📊 Response Format

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": {}
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error message",
  "errors": []
}
```

### Paginated Response
```json
{
  "success": true,
  "data": [],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "pages": 5
  }
}
```

---

## 🔒 Role-Based Access

- **Public**: Consultation creation
- **User**: Own profile, bookings, notifications
- **Admin** (🔑): All users, bookings, consultations, notifications management

---

## 💾 MongoDB Collections

Les données sont stockées dans MongoDB Atlas avec les collections suivantes :

- `users` - Informations utilisateurs
- `bookings` - Réservations de services
- `consultations` - Consultations AI
- `notifications` - Notifications utilisateurs

Toutes les opérations CRUD (Create, Read, Update, Delete) sont maintenant connectées à MongoDB.

---

## 🚀 Testing the API

### Using cURL
```bash
# Login
curl -X POST http://localhost:3003/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"password123"}'

# Get user profile
curl -X GET http://localhost:3003/api/user/profile \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Using Postman
1. Import the collection
2. Set environment variable `BASE_URL` = `http://localhost:3003/api`
3. Set `TOKEN` after login
4. Test all endpoints

---

## Environment Variables Required

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname
JWT_SECRET=your_secret_key
PORT=3003
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```
