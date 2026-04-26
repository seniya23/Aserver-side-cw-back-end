# API Key Scoping Documentation

## Overview
API keys are scoped to specific client applications with granular permission control. This ensures that a compromised key can only access the resources it's authorized for.

## Available Permissions

### Read Permissions
- `read:analytics` - Access to analytics endpoints (industry, degrees, bid wins, etc.)
- `read:alumni` - Access to alumni profile data
- `read:alumni_of_day` - Access to featured alumni of the day feature

### Write Permissions
- `write:analytics` - Modify analytics data
- `write:alumni` - Modify alumni profiles

## Pre-configured Scopes

### 1. Analytics Dashboard
**Permissions:** `["read:alumni", "read:analytics"]`
**Use Case:** University analytics dashboard for viewing alumni statistics
**Accessible Endpoints:**
- `/api/analytics/industry`
- `/api/analytics/graduation-year`
- `/api/analytics/certifications`
- `/api/analytics/bid-wins`
- `/api/analytics/degrees`
- `/api/analytics/employment-start-date`
- `/api/analytics/employment-duration`

**Create Key:**
```json
{
  "clientName": "Analytics Dashboard",
  "permissions": ["read:alumni", "read:analytics"]
}
```

### 2. Mobile AR App
**Permissions:** `["read:alumni_of_day"]`
**Use Case:** Mobile augmented reality app showing alumni of the day
**Accessible Endpoints:**
- Limited to alumni-of-day specific endpoints

**Create Key:**
```json
{
  "clientName": "Mobile AR App",
  "permissions": ["read:alumni_of_day"]
}
```

### 3. Admin Dashboard
**Permissions:** `["read:analytics", "write:analytics", "read:alumni", "write:alumni", "read:alumni_of_day"]`
**Use Case:** Full admin access to all features
**Accessible Endpoints:** All endpoints

**Create Key:**
```json
{
  "clientName": "Admin Dashboard",
  "permissions": ["read:analytics", "write:analytics", "read:alumni", "write:alumni", "read:alumni_of_day"]
}
```

## How to Create API Keys

### Via API Endpoint (Admin Only)
**Endpoint:** `POST /api/users/create-api-key`

**Headers:**
```
Authorization: Bearer <admin-jwt-token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "clientName": "Your Client Name",
  "permissions": ["permission1", "permission2"]
}
```

**Response:**
```json
{
  "message": "API key created",
  "apiKey": "generated-api-key-here",
  "clientName": "Your Client Name",
  "permissions": ["permission1", "permission2"]
}
```

## Using API Keys

### In Postman
1. Add Header:
   - **Key:** `X-API-Key`
   - **Value:** Your generated API key

2. Make GET request to any authorized endpoint

### In Code
```javascript
const response = await fetch('http://localhost:3000/api/analytics/industry', {
  headers: {
    'X-API-Key': 'your-api-key-here'
  }
});
```

## Security Best Practices

1. **Never share API keys** - Treat them like passwords
2. **Use specific scopes** - Grant only the minimum permissions needed
3. **Rotate keys regularly** - Create new keys and deactivate old ones
4. **Monitor usage** - Track which keys are accessing what endpoints
5. **Disable unused keys** - Deactivate keys for inactive clients

## Permission Enforcement

Each endpoint requires specific permissions. If a key doesn't have the required permission:

**Response:**
```json
{
  "message": "Insufficient permissions"
}
```

**Status Code:** 403 Forbidden

## Example Workflow

1. **Admin creates Analytics Dashboard key:**
   ```json
   {
     "clientName": "Analytics Dashboard v1",
     "permissions": ["read:alumni", "read:analytics"]
   }
   ```

2. **Returns API Key:** `abc123xyz789...`

3. **Dashboard app uses key:**
   - Header: `X-API-Key: abc123xyz789...`
   - Can access: `/api/analytics/*` endpoints
   - Cannot access: alumni write operations, mobile features

4. **Mobile app has separate key:**
   - Header: `X-API-Key: different-key-456...`
   - Can access: `/api/alumni/of-the-day`
   - Cannot access: analytics endpoints
