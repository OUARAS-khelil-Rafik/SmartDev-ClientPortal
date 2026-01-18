#!/bin/bash

# Quick Health Check for SmartDev API

echo "🔍 SmartDev API Health Check"
echo "=============================="
echo ""

BASE_URL="http://localhost:3002/api"

# Check if server is running
echo -n "1. Checking if server is running... "
response=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/health" 2>/dev/null)

if [ "$response" = "200" ]; then
    echo "✅ Server is UP"
else
    echo "❌ Server is DOWN (HTTP $response)"
    echo ""
    echo "Please start the server with:"
    echo "  cd server && npm start"
    exit 1
fi

# Get server info
echo -n "2. Getting server info... "
response=$(curl -s "$BASE_URL/health" 2>/dev/null)
if [ $? -eq 0 ]; then
    echo "✅ OK"
    echo "$response" | grep -o '"status":"[^"]*"'
    echo "$response" | grep -o '"timestamp":"[^"]*"'
else
    echo "❌ Failed"
fi

# Check root endpoint
echo -n "3. Checking root endpoint... "
response=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/../" 2>/dev/null)
if [ "$response" = "200" ]; then
    echo "✅ OK"
else
    echo "⚠️  HTTP $response"
fi

# Check docs endpoint
echo -n "4. Checking API docs... "
response=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/docs" 2>/dev/null)
if [ "$response" = "200" ]; then
    echo "✅ Available"
else
    echo "⚠️  Not found (HTTP $response)"
fi

echo ""
echo "=============================="
echo "✅ Health check complete!"
echo ""
echo "Available routes:"
echo "  - POST   /api/auth/register"
echo "  - POST   /api/auth/login"
echo "  - GET    /api/user/profile"
echo "  - GET    /api/booking"
echo "  - POST   /api/booking"
echo "  - POST   /api/consultation"
echo "  - GET    /api/notifications"
echo ""
echo "For full API documentation, see:"
echo "  server/API_DOCUMENTATION.md"
