# 🚀 Virtual Assistant - Complete Setup Guide

## Quick Start (Windows)

### 1. Prerequisites
- **Node.js** (v16+) - Download from https://nodejs.org
- **MongoDB** (Local or Atlas Cloud) - https://www.mongodb.com
- **Google Gemini API Key** - Get free from https://aistudio.google.com
- **Cloudinary Account** - Sign up at https://cloudinary.com (free tier available)

### 2. One-Click Setup (Windows)
Simply double-click `start-dev.bat` in the project root directory. This will:
- Start the backend server (Port 5000)
- Start the frontend server (Port 5173)

**Skip to Step 5 after running this script!**

---

## Manual Setup Steps

### Step 1: Backend Configuration

1. **Navigate to backend folder:**
```bash
cd backend
```

2. **Create `.env` file:**
```bash
copy .env.example .env
```

3. **Edit `.env` with your credentials:**

**Getting Gemini API Key:**
1. Go to https://aistudio.google.com
2. Click "Get API Key"
3. Create new API key
4. Copy and paste in `.env`

**Setup MongoDB (Local):**
- Install MongoDB Community Edition
- Default: `mongodb://localhost:27017/virtualassistant`

**Setup MongoDB (Cloud - Recommended):**
1. Create account at https://www.mongodb.com/cloud/atlas
2. Create free cluster
3. Get connection string
4. Replace `MONGODB_URI` in `.env`

**Setup Cloudinary:**
1. Create account at https://cloudinary.com
2. Go to Dashboard
3. Copy: Cloud Name, API Key, API Secret
4. Paste in `.env`

4. **Install dependencies:**
```bash
npm install
```

5. **Start backend:**
```bash
npm run dev
```

### Step 2: Frontend Configuration

1. **Open new terminal, navigate to frontend:**
```bash
cd frontend
```

2. **Create `.env` file (optional):**
```bash
copy .env.example .env
```

3. **Install dependencies:**
```bash
npm install
```

4. **Start frontend:**
```bash
npm run dev
```

### Step 3: Test the Application

1. Open browser: `http://localhost:5173`
2. Sign up with email/password
3. Click "Start Listening"
4. Grant microphone permission
5. Say: "Hello" or "What's your name?"

---

## 🔑 Getting API Keys - Step by Step

### Google Gemini API (Free)
1. Go to https://aistudio.google.com
2. Click "Get API Key" button
3. Click "Create API key"
4. Select project or create new
5. Copy the key
6. Paste in backend `.env` as GEMINI_API_URL

### MongoDB (Free Cloud)
1. Go to https://www.mongodb.com/cloud/atlas
2. Create account
3. Create free cluster
4. Click "Connect"
5. Select "Drivers"
6. Copy connection string
7. Replace username, password, dbname
8. Paste in backend `.env`

### Cloudinary (Free)
1. Create account at https://cloudinary.com
2. Go to Dashboard
3. Find "Cloud Name" - copy it
4. Scroll down to find "API Key" - copy it
5. Scroll more to find "API Secret" - copy it
6. Paste all three in backend `.env`

---

## 📱 Command Examples

Try these voice commands:

**Social Media:**
- "Open Instagram"
- "Open Facebook"
- "Search Instagram for photography"
- "Search Facebook for news"

**General:**
- "What's the time?"
- "What's the date?"
- "Tell me a joke"
- "What's the weather?"

**Customization:**
- Click "Customize" to change assistant name
- Upload custom profile image

---

## ❌ Troubleshooting

### "Cannot connect to server"
- ✅ Ensure backend is running (`npm run dev` in backend folder)
- ✅ Check if port 5000 is available
- ✅ Check MongoDB connection in `.env`

### "Microphone not working"
- ✅ Grant microphone permission in browser
- ✅ Use Chrome, Firefox, or Edge (Safari may have issues)
- ✅ Use localhost or HTTPS only

### "Gemini API errors"
- ✅ Check if API key is correct
- ✅ Ensure key has proper permissions
- ✅ Check API quota is available

### "MongoDB connection failed"
- ✅ If local: Ensure MongoDB service is running
- ✅ If Atlas: Check connection string format
- ✅ Check username and password are correct

### "Port already in use"
- ✅ Backend: Change PORT in `.env`
- ✅ Frontend: Add `--port 5174` to `npm run dev`

---

## 📝 File Structure

```
VirtualAssistant/
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middlewares/
│   ├── models/
│   ├── routes/
│   ├── .env.example
│   ├── package.json
│   └── index.js
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   ├── components/
│   │   ├── context/
│   │   └── App.jsx
│   ├── .env.example
│   ├── package.json
│   └── index.html
├── README.md
└── start-dev.bat
```

---

## 🎯 Features You Get

✅ **Voice Recognition** - Speak commands naturally
✅ **AI Responses** - Powered by Google Gemini
✅ **Search Everything** - Google, Instagram, Facebook, YouTube
✅ **Quick Access** - One-click to open platforms
✅ **Search History** - Keep track of all searches
✅ **Custom Assistant** - Personalize name and image
✅ **Beautiful UI** - Modern gradient design
✅ **Responsive** - Works on mobile and desktop
✅ **Fast** - Caching and optimized API calls

---

## 🌐 Deploying to Production

### Deploy Backend:
1. Push code to GitHub
2. Deploy to Heroku or Railway
3. Add environment variables
4. Update FRONTEND_URL

### Deploy Frontend:
1. Build: `npm run build`
2. Deploy to Vercel or Netlify
3. Add VITE_SERVER_URL variable
4. Point to production backend

---

## 📞 Need Help?

Check these in order:
1. Browser Console (F12) - See error messages
2. Terminal - Check backend logs
3. `.env` files - Verify all values
4. Firebase/MongoDB dashboard - Check quota/limits

---

## 🎉 You're All Set!

Enjoy your AI Virtual Assistant! 🚀

Start by saying: **"Hello"** or **"What's your name?"**

Happy coding! 💻✨
