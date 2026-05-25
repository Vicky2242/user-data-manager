# Rate Limiting Configuration

## Overview
Rate limiting is implemented using `express-rate-limit` with a token bucket algorithm to prevent abuse and protect API endpoints.

## Rate Limit Tiers

### Authentication Endpoints (`/api/auth`)
- **Window:** 15 minutes
- **Max Requests:** 5 per IP
- **Use Case:** Protects login/signup from brute force attacks
- **Applied to:** login, signup, change-password endpoints

### API Endpoints (`/api/clients`, `/api/custom-fields`, `/api/export`)
- **Window:** 15 minutes
- **Max Requests:** 100 per IP
- **Use Case:** Protects regular API operations from excessive traffic
- **Applied to:** CRUD operations, exports, custom fields

### Health Check (`/api/health`)
- **Status:** Not rate limited (required for monitoring/health checks)

## Error Response

When rate limit is exceeded, the API returns:

```json
{
  "success": false,
  "message": "Too many authentication attempts. Please try again later.",
  "retryAfter": 1234567890
}
```

Status Code: **429 (Too Many Requests)**

## Testing Rate Limits

### Local Testing
Rate limiting is disabled in test environments (`NODE_ENV=test`).

### Production Testing
```bash
# Test auth endpoint
for i in {1..6}; do
  curl -X POST http://localhost:5000/api/auth/login \
    -H "Content-Type: application/json" \
    -d '{"email":"test@example.com","password":"test123}'
  echo "Request $i"
done
# 6th request should return 429 status

# Test API endpoint
for i in {1..101}; do
  curl http://localhost:5000/api/clients \
    -H "Authorization: Bearer YOUR_TOKEN"
done
# 101st request should return 429 status
```

## Configuration Files

- `src/middleware/rateLimiter.js` - Rate limit middleware definitions
- `src/app.js` - Rate limiter application to routes

## Customization

To adjust limits, edit `src/middleware/rateLimiter.js`:

```javascript
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,  // 15 minutes
  max: 5,                      // 5 requests per window
  // ...
});
```

## Environment Variables

No additional environment variables required. Rate limiting respects `NODE_ENV`:
- `NODE_ENV=test` - Rate limiting disabled
- `NODE_ENV=production` - Full rate limiting enabled
- `NODE_ENV=development` - Full rate limiting enabled
