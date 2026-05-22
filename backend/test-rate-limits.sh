#!/bin/bash

# Rate Limit Testing Script
# Run this after starting the server: npm run dev

BASE_URL="http://localhost:5000"
AUTH_URL="$BASE_URL/api/auth/login"
API_URL="$BASE_URL/api/health"

echo "🧪 Testing Rate Limits..."
echo ""

# Test 1: Auth endpoint (5 requests allowed)
echo "Test 1: Auth Endpoint Rate Limit (5 requests per 15 min)"
echo "========================================================"
for i in {1..7}; do
  echo -n "Request $i: "
  RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$AUTH_URL" \
    -H "Content-Type: application/json" \
    -d '{"email":"test@example.com","password":"test123"}')

  STATUS=$(echo "$RESPONSE" | tail -n1)
  BODY=$(echo "$RESPONSE" | head -n-1)

  if [ "$STATUS" == "429" ]; then
    echo "✅ Rate limited (429)"
  elif [ "$STATUS" == "400" ] || [ "$STATUS" == "401" ]; then
    echo "✅ Allowed ($STATUS)"
  else
    echo "Status: $STATUS"
  fi

  sleep 0.5
done

echo ""
echo "Test 2: Health Check (not rate limited)"
echo "========================================"
for i in {1..3}; do
  echo -n "Request $i: "
  RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" "$API_URL")
  if [ "$RESPONSE" == "200" ]; then
    echo "✅ OK (200)"
  else
    echo "Status: $RESPONSE"
  fi
done

echo ""
echo "✅ Rate limit testing complete!"
