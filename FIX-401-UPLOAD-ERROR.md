# 🔧 Fix for 401 Unauthorized Error on Document Upload

## Problem
When trying to upload a document, you receive:
```
INFO:     127.0.0.1:53439 - "POST /api/contracts/upload HTTP/1.1" 401 Unauthorized
```

## Root Cause
The 401 Unauthorized error occurs because the upload endpoint requires authentication, but either:
1. You're not logged in (no token in localStorage)
2. Your login token has expired (tokens expire after 30 minutes)
3. The token is invalid or malformed

## Solution Steps

### Step 1: Check Your Authentication Status
Open this URL in your browser: http://localhost:3000/auth-debug.html

This tool will show you:
- ✅ If you have a valid token
- ⏰ When your token expires
- 👤 Your user information
- 🧪 Test your API connection

### Step 2: Log In to the Application
1. Go to: http://localhost:3000/login
2. Use your credentials:
   - Email: `anasrworking@gmail.com`
   - Password: (the password you set during signup)
3. After successful login, you'll be redirected to the dashboard

### Step 3: Try Uploading Again
1. Go to: http://localhost:3000/upload
2. Select or drag & drop a PDF or DOCX file
3. Click "Upload" button

## What We Fixed

### Frontend Changes (`frontend/src/app/upload/page.tsx`)
1. ✅ Added authentication check on page load
2. ✅ Added automatic redirect to login if not authenticated
3. ✅ Improved error handling for 401 responses
4. ✅ Added proper error messages
5. ✅ Added token expiration handling with auto-logout

### Backend Verification
- ✅ Confirmed authentication system is working
- ✅ Verified user exists in database
- ✅ Tested token generation

## Quick Test Commands

### Test Backend Health
```bash
curl http://localhost:8000/health
```

### Test Login (Get Token)
```bash
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"anasrworking@gmail.com","password":"YOUR_PASSWORD"}'
```

### Test Upload with Token
```bash
curl -X POST http://localhost:8000/api/contracts/upload \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -F "file=@path/to/your/file.pdf"
```

## Troubleshooting

### If you still get 401 after logging in:
1. Open browser DevTools (F12)
2. Go to Application/Storage tab
3. Check localStorage for `access_token`
4. If missing, try logging out and logging in again

### If token keeps expiring:
- Tokens expire after 30 minutes
- You'll need to log in again after expiration
- Consider implementing token refresh in the future

### If you can't log in:
1. Check backend is running: `cd backend && python main.py`
2. Check frontend is running: `cd frontend && npm run dev`
3. Verify database exists: `backend/clm_database.db`

## Files Modified
1. `frontend/src/app/upload/page.tsx` - Added authentication checks
2. `frontend/public/auth-debug.html` - New debug tool
3. `backend/test_auth.py` - New test script

## Next Steps
1. ✅ Log in through the frontend
2. ✅ Verify you have a token using the debug tool
3. ✅ Try uploading a document
4. ✅ If it still fails, check the browser console for detailed error messages

## Additional Notes
- Token is stored in browser's localStorage
- Token expires after 30 minutes (configurable in `backend/src/config/settings.py`)
- Each request to `/api/contracts/upload` requires `Authorization: Bearer <token>` header
- Frontend automatically includes this header if you're logged in
