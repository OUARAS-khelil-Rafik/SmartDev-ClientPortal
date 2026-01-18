#!/bin/bash

# Test script for admin functionality
# Tests admin login and admin routes

BASE_URL="http://localhost:3002/api"

echo "======================================"
echo "🔐 Testing Admin Functionality"
echo "======================================"
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# 1. Try to login as admin
echo "🔐 1. Testing Admin Login..."
echo "   Email: admin@novalis-ai.dev"
echo "   Password: Novalis@2026"
echo ""

response=$(curl -s -X POST "$BASE_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@novalis-ai.dev",
    "password": "Novalis@2026"
  }')

if echo "$response" | grep -q '"success":true'; then
    echo -e "${GREEN}✓ Admin login successful${NC}"
    ADMIN_TOKEN=$(echo "$response" | grep -o '"token":"[^"]*"' | cut -d'"' -f4)
    ADMIN_ID=$(echo "$response" | grep -o '"_id":"[^"]*"' | head -1 | cut -d'"' -f4)
    echo "   Token: ${ADMIN_TOKEN:0:40}..."
    echo "   User ID: $ADMIN_ID"
else
    echo -e "${RED}✗ Admin login failed${NC}"
    echo "   Response: $response"
    echo ""
    echo -e "${YELLOW}Note: Make sure the server is running with 'npm start'${NC}"
    exit 1
fi
echo ""

# 2. Get all users
echo "👥 2. Testing Get All Users (Admin)..."
http_code=$(curl -s -o /dev/null -w "%{http_code}" -X GET "$BASE_URL/user/admin/all" \
  -H "Authorization: Bearer $ADMIN_TOKEN")
if [ "$http_code" = "200" ]; then
    echo -e "${GREEN}✓ Get all users successful${NC}"
    
    # Get actual users
    response=$(curl -s -X GET "$BASE_URL/user/admin/all?limit=5" \
      -H "Authorization: Bearer $ADMIN_TOKEN")
    user_count=$(echo "$response" | grep -o '"total":[0-9]*' | cut -d':' -f2)
    echo "   Total users in database: $user_count"
else
    echo -e "${RED}✗ Get all users failed (HTTP $http_code)${NC}"
fi
echo ""

# 3. Get all bookings
echo "📅 3. Testing Get All Bookings (Admin)..."
http_code=$(curl -s -o /dev/null -w "%{http_code}" -X GET "$BASE_URL/booking/admin/all" \
  -H "Authorization: Bearer $ADMIN_TOKEN")
if [ "$http_code" = "200" ]; then
    echo -e "${GREEN}✓ Get all bookings successful${NC}"
else
    echo -e "${RED}✗ Get all bookings failed (HTTP $http_code)${NC}"
fi
echo ""

# 4. Get all consultations
echo "💬 4. Testing Get All Consultations (Admin)..."
http_code=$(curl -s -o /dev/null -w "%{http_code}" -X GET "$BASE_URL/consultation/admin/all" \
  -H "Authorization: Bearer $ADMIN_TOKEN")
if [ "$http_code" = "200" ]; then
    echo -e "${GREEN}✓ Get all consultations successful${NC}"
else
    echo -e "${RED}✗ Get all consultations failed (HTTP $http_code)${NC}"
fi
echo ""

# 5. Create a notification for a user
echo "🔔 5. Testing Create Notification (Admin)..."
http_code=$(curl -s -o /tmp/notif_response.json -w "%{http_code}" -X POST "$BASE_URL/notifications/admin/create" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"userId\": \"$ADMIN_ID\",
    \"type\": \"success\",
    \"title\": \"Welcome Admin!\",
    \"message\": \"You have successfully logged in as administrator.\"
  }")

if [ "$http_code" = "201" ] || grep -q '"success":true' /tmp/notif_response.json; then
    echo -e "${GREEN}✓ Create notification successful${NC}"
else
    echo -e "${RED}✗ Create notification failed (HTTP $http_code)${NC}"
    echo "   Response: $(cat /tmp/notif_response.json 2>/dev/null)"
fi
echo ""

# 6. Broadcast notification
echo "📢 6. Testing Broadcast Notification (Admin)..."
response=$(curl -s -X POST "$BASE_URL/notifications/admin/broadcast" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "type": "info",
    "title": "System Announcement",
    "message": "SmartDev Admin Panel is now fully operational!"
  }')

if echo "$response" | grep -q '"success":true'; then
    echo -e "${GREEN}✓ Broadcast notification successful${NC}"
    broadcast_count=$(echo "$response" | grep -o '"count":[0-9]*' | cut -d':' -f2)
    echo "   Broadcast to: $broadcast_count users"
else
    echo -e "${RED}✗ Broadcast notification failed${NC}"
fi
echo ""

echo "======================================"
echo "📝 Admin Test Summary"
echo "======================================"
echo ""
echo -e "${GREEN}✅ Admin Account Information:${NC}"
echo "   Email: admin@novalis-ai.dev"
echo "   Password: Novalis@2026"
echo "   Role: admin"
echo "   Status: ✅ Active & Working"
echo ""
echo -e "${GREEN}✅ Available Admin Routes:${NC}"
echo "   - GET    /api/user/admin/all"
echo "   - GET    /api/booking/admin/all"
echo "   - GET    /api/consultation/admin/all"
echo "   - POST   /api/notifications/admin/create"
echo "   - POST   /api/notifications/admin/broadcast"
echo "   - ... and more"
echo ""
echo "For full documentation, see: ADMIN_SETUP.md"
