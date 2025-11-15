# 🔌 Frontend-Backend Connection Verification Guide

## ✅ What Has Been Fixed

1. **API Endpoints** - Fixed to match backend routes:
   - ✅ `/auth/register` → `http://localhost:5000/api/auth/register`
   - ✅ `/auth/login` → `http://localhost:5000/api/auth/login`

2. **CORS Configuration** - Updated to allow:
   - ✅ `http://localhost:3000` (Vite default)
   - ✅ `http://localhost:5173` (Vite alternative)
   - ✅ `http://127.0.0.1:3000` and `http://127.0.0.1:5173`

3. **Error Handling** - Added:
   - ✅ Detailed error logging in development
   - ✅ Connection error detection
   - ✅ User-friendly error messages

4. **Debugging** - Added console logs to track:
   - ✅ API configuration on frontend startup
   - ✅ Request/response logging for auth endpoints

## 🧪 How to Test the Connection

### Step 1: Start the Backend Server

```bash
cd backendjs
npm install  # If not done already
npm run dev
```

**Expected Output:**
```
✅ MongoDB connected successfully
📦 Database: default
🚀 Server running on port 5000
📡 Environment: development
🌐 Frontend URL: http://localhost:5173
```

### Step 2: Test Backend Directly (Optional)

```bash
cd backendjs
node test-connection.js
```

This will test:
- Health endpoint
- Register endpoint
- Login endpoint

### Step 3: Start the Frontend

```bash
cd frontend
npm install  # If not done already
npm run dev
```

**Expected Output:**
```
VITE v4.x.x  ready in xxx ms

➜  Local:   http://localhost:3000/
➜  Network: use --host to expose
```

### Step 4: Check Browser Console

When the frontend loads, you should see:
```
🔧 API Configuration: {
  API_BASE_URL: "http://localhost:5000/api",
  VITE_API_URL: undefined,
  isDev: true
}
```

### Step 5: Test Signup

1. Go to `http://localhost:3000/signup`
2. Fill in the form
3. Submit

**Check Browser Console for:**
```
🔵 Frontend: Registering user... { url: "http://localhost:5000/api/auth/register", ... }
✅ Frontend: Register response received { success: true, ... }
```

**Check Backend Console for:**
```
📥 POST /api/auth/register
📝 Register request received
```

### Step 6: Test Login

1. Go to `http://localhost:3000/login`
2. Use the credentials from signup
3. Submit

**Check Browser Console for:**
```
🔵 Frontend: Logging in... { url: "http://localhost:5000/api/auth/login", ... }
✅ Frontend: Login response received { success: true, ... }
```

**Check Backend Console for:**
```
📥 POST /api/auth/login
🔐 Login request received
```

## 🐛 Troubleshooting

### Issue: "Cannot connect to backend server"

**Symptoms:**
- Error: `ECONNREFUSED` or `ERR_NETWORK`
- Toast message: "Cannot connect to backend server"

**Solutions:**
1. ✅ Make sure backend is running: `cd backendjs && npm run dev`
2. ✅ Check backend is on port 5000: `http://localhost:5000/health`
3. ✅ Verify MongoDB is running
4. ✅ Check firewall/antivirus isn't blocking port 5000

### Issue: CORS Error

**Symptoms:**
- Error: "Not allowed by CORS"
- Network tab shows CORS error

**Solutions:**
1. ✅ Check frontend URL matches allowed origins in `backendjs/server.js`
2. ✅ Add your frontend URL to CORS allowedOrigins array
3. ✅ Restart backend server after CORS changes

### Issue: 404 Not Found

**Symptoms:**
- Error: "Route not found"
- 404 status code

**Solutions:**
1. ✅ Verify API endpoint URLs match:
   - Frontend calls: `/auth/register` and `/auth/login`
   - Backend routes: `/api/auth/register` and `/api/auth/login`
2. ✅ Check `API_BASE_URL` is `http://localhost:5000/api` in development
3. ✅ Verify backend routes are mounted at `/api/auth`

### Issue: MongoDB Connection Error

**Symptoms:**
- Backend console shows: "MongoDB connection error"
- Server exits immediately

**Solutions:**
1. ✅ Install MongoDB if not installed
2. ✅ Start MongoDB service:
   - Windows: Check Services or run `mongod`
   - Mac: `brew services start mongodb-community`
   - Linux: `sudo systemctl start mongod`
3. ✅ Verify MongoDB URI in `.env` or default `mongodb://localhost:27017/`

## 📋 Connection Checklist

Before testing, verify:

- [ ] Backend server is running on port 5000
- [ ] MongoDB is running and connected
- [ ] Frontend is running on port 3000 (or 5173)
- [ ] Browser console shows API configuration
- [ ] No CORS errors in browser console
- [ ] Backend console shows request logs
- [ ] Network tab shows successful API calls

## 🔍 Debugging Tips

1. **Check Browser Network Tab:**
   - Open DevTools → Network tab
   - Look for requests to `localhost:5000`
   - Check request/response details

2. **Check Backend Console:**
   - Should show request logs: `📥 POST /api/auth/register`
   - Should show controller logs: `📝 Register request received`

3. **Check Frontend Console:**
   - Should show API configuration on load
   - Should show request/response logs for auth calls
   - Should show detailed error information if something fails

4. **Test Backend Directly:**
   ```bash
   # Health check
   curl http://localhost:5000/health
   
   # Register
   curl -X POST http://localhost:5000/api/auth/register \
     -H "Content-Type: application/json" \
     -d '{"name":"Test","email":"test@test.com","password":"test123"}'
   ```

## ✅ Success Indicators

When everything is connected properly:

1. ✅ Backend console shows incoming requests
2. ✅ Frontend console shows API calls and responses
3. ✅ Signup creates a user and redirects to home
4. ✅ Login authenticates and redirects to home
5. ✅ User data is stored in localStorage
6. ✅ No errors in browser console or network tab

