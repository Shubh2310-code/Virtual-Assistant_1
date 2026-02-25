# 🎯 Quick Reference Guide

## Starting Development

### Windows
```bash
Double-click: start-dev.bat
```

### Mac/Linux
```bash
# Terminal 1 - Backend
cd backend && npm run dev

# Terminal 2 - Frontend
cd frontend && npm run dev
```

---

## Common Commands

### Backend
```bash
cd backend
npm install          # Install dependencies
npm run dev          # Start development server
npm start           # Start production server
```

### Frontend
```bash
cd frontend
npm install          # Install dependencies
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Check code quality
```

---

## Common Voice Commands

| Command | Result |
|---------|--------|
| "Open Instagram" | Opens Instagram |
| "Open Facebook" | Opens Facebook |
| "Search Google for weather" | Searches Google |
| "Search Instagram for fashion" | Searches Instagram hashtags |
| "What's the time?" | Reads current time |
| "What's the date?" | Reads current date |
| "What day is it?" | Reads current day |
| "What's your name?" | Says assistant name |
| "Who created you?" | Says your name |
| "How are you?" | Responds with greeting |

---

## Environment Variables Quick Check

### Backend `.env`
```
PORT=5000
MONGODB_URI=your_mongodb_url
GEMINI_API_URL=your_gemini_key_url
JWT_SECRET=any_secret_string
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
FRONTEND_URL=http://localhost:5173
```

### Frontend `.env`
```
VITE_SERVER_URL=http://localhost:5000
```

---

## API Endpoints Summary

### Authentication
- `POST /api/auth/signup` - Register
- `POST /api/auth/login` - Login
- `POST /api/user/logout` - Logout

### Assistant
- `GET /api/user/current` - Get profile
- `POST /api/user/askToAssistant` - Send command
- `POST /api/user/update-assistant` - Update profile
- `GET /api/user/history` - Get history
- `POST /api/user/clear-history` - Clear history

---

## Browser Console Errors - Quick Fixes

| Error | Fix |
|-------|-----|
| "Cannot GET /api/..." | Backend not running |
| "CORS error" | Check CORS in backend index.js |
| "Microphone not working" | Grant permission, use Chrome |
| "Blank screen" | Check frontend terminal for errors |
| "Cannot connect to MongoDB" | Check connection string |

---

## Performance Tips

1. **Reduce API Calls**: Use caching (already implemented)
2. **Optimize Images**: Compress assistant image before upload
3. **Clear History**: Old history slows down loading
4. **Use Production Build**: `npm run build` for frontend
5. **Monitor Gemini Quota**: Watch API usage in Google console

---

## File Customization

### Change Assistant Default Name
Edit [Home.jsx](frontend/src/pages/Home.jsx#L11):
```javascript
assistantNameRef.current = userData?.assistantName || 'CustomName';
```

### Change UI Colors
Edit [Home.jsx](frontend/src/pages/Home.jsx#L340):
- Change `from-purple-500` to other Tailwind colors
- Change `to-pink-500` to other Tailwind colors

### Change Button Styles
Edit buttons in [Home.jsx](frontend/src/pages/Home.jsx#L400):
- Button colors use Tailwind classes
- Look for `bg-gradient-to-r` for gradient buttons

### Change Quick Command Buttons
Edit [Home.jsx](frontend/src/pages/Home.jsx#L470):
```javascript
<button onClick={() => sendCommand('open instagram')}>
```

---

## Deployment Checklist

- [ ] All `.env` files configured
- [ ] MongoDB connection verified
- [ ] Gemini API key working
- [ ] Cloudinary credentials valid
- [ ] Frontend builds without errors (`npm run build`)
- [ ] CORS configured for production URLs
- [ ] Microphone tested in target devices
- [ ] History feature works
- [ ] Social media links open correctly
- [ ] Speech recognition works

---

## Useful Links

| Resource | URL |
|----------|-----|
| Node.js | https://nodejs.org |
| MongoDB | https://www.mongodb.com |
| Gemini API | https://aistudio.google.com |
| Cloudinary | https://cloudinary.com |
| React Docs | https://react.dev |
| Tailwind CSS | https://tailwindcss.com |
| Express.js | https://expressjs.com |

---

## Database Operations

### Check MongoDB Connection
```bash
# In MongoDB Compass or terminal
mongo mongodb://localhost:27017
use virtualassistant
db.users.find().pretty()
db.users.deleteMany({}) # Clear all users
```

### Reset User Data
```bash
# MongoDB command
db.users.updateOne({email: "user@example.com"}, {$set: {history: []}})
```

---

## Debug Mode

### Frontend Debug
1. Open DevTools (F12)
2. Go to Console tab
3. Look for `console.log()` messages
4. Check Network tab for API calls

### Backend Debug
1. Check terminal output
2. Look for `console.log()` in controllers
3. Add `console.error()` for errors
4. Check MongoDB Compass for data

---

## Still Having Issues?

1. **Check Logs**: Terminal output has most answers
2. **Check Browser Console**: F12 → Console tab
3. **Verify URLs**: Backend 5000, Frontend 5173
4. **Test API**: Use Postman or curl
5. **Reset Everything**: Delete node_modules, reinstall

```bash
cd backend && rm -rf node_modules && npm install
cd frontend && rm -rf node_modules && npm install
```

---

## Need Help?

- Read [SETUP.md](SETUP.md) for detailed setup
- Check [README.md](README.md) for feature docs
- Review error messages in console
- Search Google for error + "React" or "Express"

**Happy coding! 🚀**
