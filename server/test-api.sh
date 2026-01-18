#!/bin/bash

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "🧪 SmartDev Backend API Tests"
echo "================================\n"

BASE_URL="http://localhost:3001"
DELAY=0.5

# Function to print test result
test_result() {
  if [ $1 -eq 0 ]; then
    echo -e "${GREEN}✓ PASS${NC}: $2\n"
  else
    echo -e "${RED}✗ FAIL${NC}: $2\n"
  fi
}

# Test 1: Health Check
echo "Test 1: Health Check"
echo "--------------------"
curl -s -X GET "$BASE_URL/api/health" | jq '.'
echo ""
sleep $DELAY

# Test 2: Consultation Endpoint
echo "Test 2: Consultation Endpoint"
echo "-----------------------------"
RESPONSE=$(curl -s -X POST "$BASE_URL/api/consultation" \
  -H "Content-Type: application/json" \
  -d '{
    "message": "I want to build a web app for my e-commerce business",
    "history": []
  }')
echo "$RESPONSE" | jq '.'
echo ""
sleep $DELAY

# Test 3: Copilot Endpoint
echo "Test 3: Copilot Endpoint"
echo "------------------------"
curl -s -X POST "$BASE_URL/api/copilot" \
  -H "Content-Type: application/json" \
  -d '{
    "message": "What services do you offer?",
    "history": []
  }' | jq '.'
echo ""
sleep $DELAY

# Test 4: Register User
echo "Test 4: Register User"
echo "---------------------"
REGISTER_RESPONSE=$(curl -s -X POST "$BASE_URL/api/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Test",
    "lastName": "User",
    "email": "test@example.com",
    "password": "password123",
    "phone": "+33612345678",
    "company": "Test Company"
  }')
echo "$REGISTER_RESPONSE" | jq '.'
TOKEN=$(echo "$REGISTER_RESPONSE" | jq -r '.token // empty')
echo ""
sleep $DELAY

# Test 5: Login User
echo "Test 5: Login User"
echo "------------------"
LOGIN_RESPONSE=$(curl -s -X POST "$BASE_URL/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }')
echo "$LOGIN_RESPONSE" | jq '.'
TOKEN=$(echo "$LOGIN_RESPONSE" | jq -r '.token // empty')
echo ""
sleep $DELAY

# Test 6: Get User Profile (with authentication)
if [ ! -z "$TOKEN" ]; then
  echo "Test 6: Get User Profile"
  echo "------------------------"
  curl -s -X GET "$BASE_URL/api/user/profile" \
    -H "Authorization: Bearer $TOKEN" | jq '.'
  echo ""
  sleep $DELAY

  # Test 7: Create Booking
  echo "Test 7: Create Booking"
  echo "----------------------"
  curl -s -X POST "$BASE_URL/api/booking" \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json" \
    -d '{
      "serviceName": "Web Development",
      "title": "E-commerce Website",
      "description": "Need a professional e-commerce website",
      "budget": 15000,
      "timeline": "2-4 weeks",
      "preferredStartDate": "2026-02-01"
    }' | jq '.'
  echo ""
else
  echo -e "${YELLOW}⚠ Skipping authenticated tests - no token received${NC}\n"
fi

echo "================================"
echo "🎉 Tests completed!"
echo ""
echo "📝 Notes:"
echo "   - Make sure MongoDB is running"
echo "   - Make sure server is running on port 3001"
echo "   - Check .env.local for API keys"
