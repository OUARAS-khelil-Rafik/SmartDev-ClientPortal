#!/bin/bash

# SmartDev API Simple Test Script
# Compatible macOS

BASE_URL="http://localhost:3002/api"

echo "======================================"
echo "🧪 Testing SmartDev API with MongoDB"
echo "======================================"
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# 1. Health Check
echo "📊 1. Testing Health Check..."
http_code=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/health")
if [ "$http_code" = "200" ]; then
    echo -e "${GREEN}✓ Health check passed${NC}"
else
    echo -e "${RED}✗ Health check failed (HTTP $http_code)${NC}"
fi
echo ""

# 2. Register User
echo "👤 2. Testing User Registration..."
email="test$(date +%s)@example.com"
response=$(curl -s -X POST "$BASE_URL/auth/register" \
  -H "Content-Type: application/json" \
  -d "{
    \"firstName\": \"Test\",
    \"lastName\": \"User\",
    \"email\": \"$email\",
    \"password\": \"test123456\",
    \"phone\": \"+1234567890\",
    \"company\": \"Test Corp\"
  }")

if echo "$response" | grep -q '"success":true'; then
    echo -e "${GREEN}✓ User registration successful${NC}"
    USER_TOKEN=$(echo "$response" | grep -o '"token":"[^"]*"' | cut -d'"' -f4)
    USER_ID=$(echo "$response" | grep -o '"userId":"[^"]*"' | cut -d'"' -f4)
    echo "   Email: $email"
    echo "   Token: ${USER_TOKEN:0:30}..."
    echo "   User ID: $USER_ID"
else
    echo -e "${RED}✗ User registration failed${NC}"
    echo "   Response: $response"
fi
echo ""

# 3. Get User Profile
echo "👤 3. Testing Get User Profile..."
http_code=$(curl -s -o /dev/null -w "%{http_code}" -X GET "$BASE_URL/user/profile" \
  -H "Authorization: Bearer $USER_TOKEN")
if [ "$http_code" = "200" ]; then
    echo -e "${GREEN}✓ Get user profile successful${NC}"
else
    echo -e "${RED}✗ Get user profile failed (HTTP $http_code)${NC}"
fi
echo ""

# 4. Create Booking
echo "📅 4. Testing Create Booking..."
response=$(curl -s -X POST "$BASE_URL/booking" \
  -H "Authorization: Bearer $USER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "serviceName": "Web Development",
    "title": "E-commerce Website",
    "description": "Need a full e-commerce solution",
    "budget": 5000,
    "timeline": "2-4 weeks",
    "preferredStartDate": "2026-02-01",
    "notes": "Urgent project"
  }')

if echo "$response" | grep -q '"success":true'; then
    echo -e "${GREEN}✓ Booking created successfully${NC}"
    BOOKING_ID=$(echo "$response" | grep -o '"_id":"[^"]*"' | head -1 | cut -d'"' -f4)
    echo "   Booking ID: $BOOKING_ID"
else
    echo -e "${RED}✗ Booking creation failed${NC}"
fi
echo ""

# 5. Get User Bookings
echo "📅 5. Testing Get User Bookings..."
http_code=$(curl -s -o /dev/null -w "%{http_code}" -X GET "$BASE_URL/booking?page=1&limit=10" \
  -H "Authorization: Bearer $USER_TOKEN")
if [ "$http_code" = "200" ]; then
    echo -e "${GREEN}✓ Get user bookings successful${NC}"
else
    echo -e "${RED}✗ Get user bookings failed (HTTP $http_code)${NC}"
fi
echo ""

# 6. Create Consultation
echo "💬 6. Testing Create Consultation..."
response=$(curl -s -X POST "$BASE_URL/consultation" \
  -H "Content-Type: application/json" \
  -d '{
    "message": "I need help with a web development project",
    "history": [],
    "email": "client@example.com",
    "name": "John Doe",
    "projectType": "Web",
    "description": "E-commerce platform",
    "budget": "$5k - $25k",
    "timeline": "1-3 months"
  }')

if echo "$response" | grep -q '"success":true'; then
    echo -e "${GREEN}✓ Consultation created successfully${NC}"
    CONSULTATION_ID=$(echo "$response" | grep -o '"consultationId":"[^"]*"' | cut -d'"' -f4)
    echo "   Consultation ID: $CONSULTATION_ID"
else
    echo -e "${RED}✗ Consultation creation failed${NC}"
fi
echo ""

# 7. Get Notifications
echo "🔔 7. Testing Get Notifications..."
http_code=$(curl -s -o /dev/null -w "%{http_code}" -X GET "$BASE_URL/notifications?page=1&limit=10" \
  -H "Authorization: Bearer $USER_TOKEN")
if [ "$http_code" = "200" ]; then
    echo -e "${GREEN}✓ Get notifications successful${NC}"
else
    echo -e "${RED}✗ Get notifications failed (HTTP $http_code)${NC}"
fi
echo ""

echo "======================================"
echo "📝 Test Summary"
echo "======================================"
echo ""
echo "✅ Basic API tests completed!"
echo ""
echo "User Details:"
echo "  Email: $email"
echo "  User ID: $USER_ID"
echo "  Token: ${USER_TOKEN:0:40}..."
echo ""
echo "Created Resources:"
echo "  Booking ID: $BOOKING_ID"
echo "  Consultation ID: $CONSULTATION_ID"
echo ""
echo -e "${YELLOW}For admin features:${NC}"
echo "1. Set this user as admin in MongoDB:"
echo "   db.users.updateOne({_id: ObjectId('$USER_ID')}, {\$set: {role: 'admin'}})"
echo ""
echo "2. Then test admin routes with the token above"
echo ""
echo "Full API Documentation: server/API_DOCUMENTATION.md"
