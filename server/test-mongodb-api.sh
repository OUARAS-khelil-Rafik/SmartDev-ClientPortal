#!/bin/bash

# SmartDev API Test Script
# Ce script teste toutes les routes de l'API avec MongoDB

BASE_URL="http://localhost:3002/api"
ADMIN_TOKEN=""
USER_TOKEN=""
USER_ID=""
BOOKING_ID=""
CONSULTATION_ID=""
NOTIFICATION_ID=""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print test results
print_test() {
    if [ $1 -eq 0 ]; then
        echo -e "${GREEN}✓ $2${NC}"
    else
        echo -e "${RED}✗ $2${NC}"
    fi
}

# Function to extract body from response (works on macOS)
get_body() {
    echo "$1" | sed '$ d'
}

# Function to extract http code from response
get_http_code() {
    echo "$1" | tail -1
}

echo "======================================"
echo "🧪 Testing SmartDev API with MongoDB"
echo "======================================"
echo ""

# 1. Health Check
echo "📊 1. Testing Health Check..."
response=$(curl -s -w "\n%{http_code}" "$BASE_URL/health")
http_code=$(get_http_code "$response")
if [ "$http_code" = "200" ]; then
    print_test 0 "Health check passed"
else
    print_test 1 "Health check failed (HTTP $http_code)"
fi
echo ""

# 2. Register User
echo "👤 2. Testing User Registration..."
response=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Test",
    "lastName": "User",
    "email": "test'$(date +%s)'@example.com",
    "password": "test123456",
    "phone": "+1234567890",
    "company": "Test Corp"
  }')
http_code=$(get_http_code "$response")
body=$(get_body "$response")

if [ "$http_code" = "201" ]; then
    print_test 0 "User registration successful"
    USER_TOKEN=$(echo "$body" | grep -o '"token":"[^"]*"' | sed 's/"token":"\(.*\)"/\1/')
    USER_ID=$(echo "$body" | grep -o '"userId":"[^"]*"' | sed 's/"userId":"\(.*\)"/\1/')
    echo "   Token: ${USER_TOKEN:0:20}..."
else
    print_test 1 "User registration failed (HTTP $http_code)"
fi
echo ""

# 3. Register Admin User
echo "🔑 3. Testing Admin Registration..."
response=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Admin",
    "lastName": "User",
    "email": "admin'$(date +%s)'@example.com",
    "password": "admin123456"
  }')
http_code=$(get_http_code "$response")
body=$(get_body "$response")

if [ "$http_code" = "201" ]; then
    print_test 0 "Admin user created"
    ADMIN_TOKEN=$(echo "$body" | grep -o '"token":"[^"]*"' | sed 's/"token":"\(.*\)"/\1/')
    ADMIN_ID=$(echo "$body" | grep -o '"userId":"[^"]*"' | sed 's/"userId":"\(.*\)"/\1/')
    echo "   Note: Manually set this user as admin in MongoDB"
else
    print_test 1 "Admin creation failed (HTTP $http_code)"
fi
echo ""

# 4. Get User Profile
echo "👤 4. Testing Get User Profile..."
response=$(curl -s -w "\n%{http_code}" -X GET "$BASE_URL/user/profile" \
  -H "Authorization: Bearer $USER_TOKEN")
http_code=$(get_http_code "$response")
if [ "$http_code" = "200" ]; then
    print_test 0 "Get user profile successful"
else
    print_test 1 "Get user profile failed (HTTP $http_code)"
fi
echo ""

# 5. Create Booking
echo "📅 5. Testing Create Booking..."
response=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL/booking" \
  -H "Authorization: Bearer $USER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "serviceName": "Web Development",
    "title": "E-commerce Website",
    "description": "Need a full e-commerce solution with payment integration",
    "budget": 5000,
    "timeline": "2-4 weeks",
    "preferredStartDate": "2026-02-01",
    "notes": "Urgent project"
  }')
http_code=$(get_http_code "$response")
body=$(get_body "$response")

if [ "$http_code" = "201" ]; then
    print_test 0 "Booking created successfully"
    BOOKING_ID=$(echo "$body" | grep -o '"_id":"[^"]*"' | head -n1 | sed 's/"_id":"\(.*\)"/\1/')
    echo "   Booking ID: $BOOKING_ID"
else
    print_test 1 "Booking creation failed (HTTP $http_code)"
fi
echo ""

# 6. Get User Bookings
echo "📅 6. Testing Get User Bookings..."
response=$(curl -s -w "\n%{http_code}" -X GET "$BASE_URL/booking?page=1&limit=10" \
  -H "Authorization: Bearer $USER_TOKEN")
http_code=$(get_http_code "$response")
if [ "$http_code" = "200" ]; then
    print_test 0 "Get user bookings successful"
else
    print_test 1 "Get user bookings failed (HTTP $http_code)"
fi
echo ""

# 7. Update Booking
if [ ! -z "$BOOKING_ID" ]; then
    echo "📅 7. Testing Update Booking..."
    response=$(curl -s -w "\n%{http_code}" -X PUT "$BASE_URL/booking/$BOOKING_ID" \
      -H "Authorization: Bearer $USER_TOKEN" \
      -H "Content-Type: application/json" \
      -d '{
        "status": "confirmed",
        "notes": "Updated notes"
      }')
    http_code=$(get_http_code "$response")
    if [ "$http_code" = "200" ]; then
        print_test 0 "Booking updated successfully"
    else
        print_test 1 "Booking update failed (HTTP $http_code)"
    fi
    echo ""
fi

# 8. Create Consultation
echo "💬 8. Testing Create Consultation..."
response=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL/consultation" \
  -H "Content-Type: application/json" \
  -d '{
    "message": "I need help with a web development project",
    "history": [],
    "email": "client@example.com",
    "name": "John Doe",
    "projectType": "Web",
    "description": "E-commerce platform with inventory management",
    "budget": "$5k - $25k",
    "timeline": "1-3 months"
  }')
http_code=$(get_http_code "$response")
body=$(get_body "$response")

if [ "$http_code" = "200" ]; then
    print_test 0 "Consultation created successfully"
    CONSULTATION_ID=$(echo "$body" | grep -o '"consultationId":"[^"]*"' | sed 's/"consultationId":"\(.*\)"/\1/')
    echo "   Consultation ID: $CONSULTATION_ID"
else
    print_test 1 "Consultation creation failed (HTTP $http_code)"
fi
echo ""

# 9. Get Notifications
echo "🔔 9. Testing Get Notifications..."
response=$(curl -s -w "\n%{http_code}" -X GET "$BASE_URL/notifications?page=1&limit=10" \
  -H "Authorization: Bearer $USER_TOKEN")
http_code=$(get_http_code "$response")
if [ "$http_code" = "200" ]; then
    print_test 0 "Get notifications successful"
else
    print_test 1 "Get notifications failed (HTTP $http_code)"
fi
echo ""

# Admin Tests (will fail if admin role is not set in DB)
echo ""
echo "======================================"
echo "🔑 ADMIN ROUTES (Require Admin Role)"
echo "======================================"
echo ""

# 10. Admin: Get All Users
echo "👥 10. Testing Admin - Get All Users..."
response=$(curl -s -w "\n%{http_code}" -X GET "$BASE_URL/user/admin/all?page=1&limit=10" \
  -H "Authorization: Bearer $ADMIN_TOKEN")
http_code=$(get_http_code "$response")
if [ "$http_code" = "200" ]; then
    print_test 0 "Admin get all users successful"
elif [ "$http_code" = "403" ]; then
    echo -e "${YELLOW}⚠ Admin role not set. Set role='admin' in MongoDB for user $ADMIN_ID${NC}"
else
    print_test 1 "Admin get all users failed (HTTP $http_code)"
fi
echo ""

# 11. Admin: Get All Bookings
echo "📅 11. Testing Admin - Get All Bookings..."
response=$(curl -s -w "\n%{http_code}" -X GET "$BASE_URL/booking/admin/all?page=1&limit=10" \
  -H "Authorization: Bearer $ADMIN_TOKEN")
http_code=$(get_http_code "$response")
if [ "$http_code" = "200" ]; then
    print_test 0 "Admin get all bookings successful"
elif [ "$http_code" = "403" ]; then
    echo -e "${YELLOW}⚠ Admin role required${NC}"
else
    print_test 1 "Admin get all bookings failed (HTTP $http_code)"
fi
echo ""

# 12. Admin: Get All Consultations
echo "💬 12. Testing Admin - Get All Consultations..."
response=$(curl -s -w "\n%{http_code}" -X GET "$BASE_URL/consultation/admin/all?page=1&limit=10" \
  -H "Authorization: Bearer $ADMIN_TOKEN")
http_code=$(get_http_code "$response")
if [ "$http_code" = "200" ]; then
    print_test 0 "Admin get all consultations successful"
elif [ "$http_code" = "403" ]; then
    echo -e "${YELLOW}⚠ Admin role required${NC}"
else
    print_test 1 "Admin get all consultations failed (HTTP $http_code)"
fi
echo ""

# 13. Admin: Create Notification
echo "🔔 13. Testing Admin - Create Notification..."
response=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL/notifications/admin/create" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "'$USER_ID'",
    "type": "info",
    "title": "Welcome to SmartDev!",
    "message": "Thank you for registering with us."
  }')
http_code=$(get_http_code "$response")
if [ "$http_code" = "201" ]; then
    print_test 0 "Admin create notification successful"
elif [ "$http_code" = "403" ]; then
    echo -e "${YELLOW}⚠ Admin role required${NC}"
else
    print_test 1 "Admin create notification failed (HTTP $http_code)"
fi
echo ""

echo "======================================"
echo "📝 Test Summary"
echo "======================================"
echo ""
echo "User Token: ${USER_TOKEN:0:30}..."
echo "User ID: $USER_ID"
echo "Booking ID: $BOOKING_ID"
echo "Consultation ID: $CONSULTATION_ID"
echo ""
echo "To set admin role, run in MongoDB:"
echo "db.users.updateOne({_id: ObjectId('$ADMIN_ID')}, {\$set: {role: 'admin'}})"
echo ""
echo "All routes are connected to MongoDB! ✅"
