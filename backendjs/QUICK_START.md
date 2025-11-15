# 🚀 Quick Start Guide - Fix Network Error

## Step 1: Install Dependencies

```bash
cd backendjs
npm install
```

This will install:
- express
- mongoose
- bcryptjs
- jsonwebtoken
- cors
- dotenv
- nodemon (for auto-reload)

## Step 2: Create .env File

Create a file named `.env` in the `backendjs` folder:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/
JWT_SECRET=your-super-secret-jwt-key-change-this
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

## Step 3: Make Sure MongoDB is Running

- MongoDB should be running on `mongodb://localhost:27017/`
- Check if MongoDB service is running

## Step 4: Start the Server

```bash
cd backendjs
npm run dev
```

**You should see:**
```
✅ MongoDB connected successfully
📦 Database: default
🚀 Server running on port 5000
📡 Environment: development
🌐 Frontend URL: http://localhost:5173
```

## Step 5: Test the Server

Open browser: `http://localhost:5000/health`

**You should see:**
```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "..."
}
```

## Step 6: Test Login/Signup

1. Start frontend: `cd frontend && npm run dev`
2. Go to: `http://localhost:5173/signup`
3. Fill the form and submit
4. Check backend terminal for logs

## Common Issues

### Issue: "Cannot find module"
**Fix:** Run `npm install` in backendjs folder

### Issue: "MongoDB connection error"
**Fix:** Start MongoDB service

### Issue: "Port 5000 already in use"
**Fix:** Kill the process or change PORT in .env

### Issue: Network Error in Browser
**Fix:** 
1. Make sure backend is running (`npm run dev`)
2. Check backend terminal for errors
3. Test health endpoint: `http://localhost:5000/health`

## ✅ Success Checklist

- [ ] Dependencies installed (`npm install`)
- [ ] `.env` file created
- [ ] MongoDB is running
- [ ] Backend server started (`npm run dev`)
- [ ] Health endpoint works: `http://localhost:5000/health`
- [ ] Frontend is running
- [ ] Can access signup/login pages

