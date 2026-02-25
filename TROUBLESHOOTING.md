# 🔧 Troubleshooting Guide - New Features

## Search History Feature

### History Not Showing
**Problem**: History sidebar is empty or not updated

**Solutions**:
1. Check if backend is saving history
   - Go to MongoDB Compass
   - Find user document
   - Check if `history` array has entries

2. Verify API endpoint works
   ```bash
   # Test in Postman or curl
   GET http://localhost:5000/api/user/history
   ```

3. Clear browser cache (Ctrl+Shift+Delete)

4. Check network tab (F12 → Network)
   - See if `/api/user/history` returns data

### History Items Not Clickable
**Problem**: Can't re-execute commands from history

**Solutions**:
1. Check if `handleHistoryItemClick` function exists in Home.jsx
2. Verify `sendCommand()` function is available
3. Check browser console for errors (F12 → Console)

### History Getting Too Large
**Problem**: App slowing down with lots of history

**Solutions**:
1. Use clear history button (trash icon)
2. Limit history in backend
   ```javascript
   // In getHistory controller
   const history = user.history.slice(-50).reverse();
   ```
3. Implement periodic cleanup

---

## Instagram/Facebook Search Feature

### Search Not Working
**Problem**: Instagram/Facebook search doesn't open or show results

**Solutions**:
1. Check if Gemini recognizes "instagram_search" type
   - Add search command: "Search Instagram for fashion"
   - Check response type in browser console

2. Verify search URL format
   - Instagram: `https://www.instagram.com/explore/tags/QUERY`
   - Facebook: `https://www.facebook.com/search/top/?q=QUERY`

3. Check browser's popup blocker
   - Allow popups from localhost
   - Check if searches are opened in background

### Can't Open Instagram/Facebook Directly
**Problem**: "Open Instagram" or "Open Facebook" doesn't work

**Solutions**:
1. Check if quick response recognizes commands
   - Says "Opening Instagram for you!"?
   - Check Home.jsx getQuickResponse function

2. Verify URLs are correct
   ```javascript
   // In Home.jsx
   window.open('https://www.instagram.com', '_blank')
   ```

3. Check popup blocker settings

---

## Text Being Generated on Screen

### Transcripts Not Showing
**Problem**: What you say doesn't appear on screen

**Solutions**:
1. Check microphone permissions
   - Go to browser settings → Microphone
   - Ensure localhost is allowed

2. Verify speech recognition
   ```javascript
   // In browser console
   navigator.mediaDevices.getUserMedia({audio: true})
   ```

3. Check console for speech recognition errors

### Response Not Displaying
**Problem**: Assistant response doesn't appear

**Solutions**:
1. Check if API call is successful
   - F12 → Network tab
   - Look for `/api/user/askToAssistant` request
   - Check response body

2. Verify response state is updating
   - Check State in React DevTools

3. Check if Gemini returns proper JSON
   ```bash
   # Test in backend
   console.log('Gemini response:', result);
   ```

---

## Platform Opening Feature

### Social Media Links Not Opening
**Problem**: No new window/tab opens when commanding to open platforms

**Solutions**:
1. Check browser popup blocker
   - Settings → Privacy → Pop-ups
   - Add localhost to allowed sites

2. Verify command recognition
   - Say: "Open Instagram"
   - Check console for command log

3. Check window.open() is working
   ```javascript
   // In browser console
   window.open('https://www.instagram.com', '_blank')
   ```

### Wrong URL Opens
**Problem**: Wrong social media opens

**Solutions**:
1. Check URL mapping in Home.jsx
   - Instagram → instagram.com
   - Facebook → facebook.com
   - Google → google.com

2. Verify response type is correct
   - Check if type is "instagram_open"

---

## Responsive UI Issues

### UI Doesn't Look Good on Mobile
**Problem**: Buttons/text are too small or misaligned

**Solutions**:
1. Use Chrome DevTools responsive mode (F12)
2. Check Tailwind breakpoints
   - `lg:` classes for desktop
   - Regular classes for mobile
3. Test on actual mobile device

### Gradients Not Showing
**Problem**: Background or buttons look plain

**Solutions**:
1. Clear CSS cache (Ctrl+Shift+Delete)
2. Check if Tailwind CSS is loaded
   - F12 → Elements → Check for style tags
3. Rebuild frontend
   ```bash
   cd frontend
   npm run build
   ```

### Animations Not Working
**Problem**: Pulsing lights don't animate

**Solutions**:
1. Check if Tailwind animations are enabled
2. Check browser performance (browser too slow?)
3. Verify CSS is compiled correctly

---

## API and Backend Issues

### Endpoints Not Found (404)
**Problem**: Getting 404 errors for new endpoints

**Solutions**:
1. Check if routes are exported correctly
   ```javascript
   // In user.routes.js
   router.get("/history", isAuth, getHistory)
   ```

2. Check if controller functions exist
   ```javascript
   // In user.controllers.js
   export const getHistory = async (req, res) => { ... }
   ```

3. Ensure endpoints match frontend calls
   ```javascript
   // Frontend
   `/api/user/history`
   // Should match route exactly
   ```

### 500 Internal Server Error
**Problem**: Backend returns 500 error

**Solutions**:
1. Check backend console for error message
2. Verify database connection
   - Check MongoDB URI in .env
   - Try connecting directly

3. Check Gemini API key
   - Verify key format
   - Test in Gemini API console

4. Check error handling in controllers
   - Look for try-catch blocks

### CORS Errors
**Problem**: "Access to XMLHttpRequest blocked by CORS policy"

**Solutions**:
1. Check CORS configuration in index.js
   ```javascript
   const allowedOrigins = [
       "http://localhost:5173",
       // Add your frontend URL
   ];
   ```

2. Restart backend after changing CORS
3. Clear browser cache

---

## Database Issues

### History Not Saving
**Problem**: Commands aren't saved to history

**Solutions**:
1. Check if user ID is correct
   - `console.log(req.userId)` in controller

2. Verify MongoDB connection
   - Check MONGODB_URI in .env
   - Connect with MongoDB Compass

3. Check history push is working
   ```javascript
   // In controller
   user.history.push({...})
   await user.save()
   ```

### Old History Lost
**Problem**: History disappears or resets

**Solutions**:
1. Don't use clear-history unless intended
2. Check MongoDB backup/restore settings
3. Keep history limit reasonable (max 100-200 items)

---

## Performance Issues

### App is Slow
**Problem**: Commands take long to respond

**Solutions**:
1. Check API response time
   - F12 → Network → Check request duration

2. Reduce history size
   - Clear history using button
   - Limit to 50 items in getHistory

3. Check system resources
   - Close other apps
   - Check CPU/Memory usage

4. Enable caching
   - Already implemented in code
   - Repeat same command quickly

### Images Load Slowly
**Problem**: Assistant image takes forever to load

**Solutions**:
1. Compress image before upload
   - Use tiny.png or similar
   - Target size: < 100KB

2. Use Cloudinary's optimization
   - Cloudinary auto-compresses

3. Check internet speed
   - Try on faster connection

---

## Browser Compatibility

### Works in Chrome, Not in Firefox
**Problem**: Features missing in certain browsers

**Solutions**:
1. Speech Recognition
   - Chrome: Full support
   - Firefox: May not work
   - Edge: Full support

2. Test in multiple browsers
3. Use Firefox Developer Edition
4. Check browser console for specific errors

---

## Testing Commands

### Test Speech Recognition
```javascript
// In browser console
const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
recognition.start();
recognition.onresult = (event) => console.log(event.results[0][0].transcript);
```

### Test Text-to-Speech
```javascript
// In browser console
const utterance = new SpeechSynthesisUtterance("Hello");
window.speechSynthesis.speak(utterance);
```

### Test API Endpoint
```javascript
// In browser console
fetch('http://localhost:5000/api/user/history', {
    method: 'GET',
    credentials: 'include'
}).then(r => r.json()).then(console.log)
```

---

## Getting Debug Information

### Enable Verbose Logging

**Backend** - Add to controllers:
```javascript
console.log('DEBUG:', {
    userId: req.userId,
    command: command,
    timestamp: new Date()
});
```

**Frontend** - Add to Home.jsx:
```javascript
console.log('History state:', history);
console.log('Response:', response);
```

### Export Logs
1. Right-click console → Save as...
2. Share logs in bug reports

---

## Still Stuck?

1. **Check Examples**:
   - Look at similar working features
   - Copy-paste and modify

2. **Verify Step by Step**:
   - Does microphone work?
   - Does API respond?
   - Does history save?

3. **Restart Everything**:
   ```bash
   # Terminal 1
   Ctrl+C (stop servers)
   cd backend && npm run dev
   
   # Terminal 2
   Ctrl+C (stop server)
   cd frontend && npm run dev
   ```

4. **Nuclear Option**:
   ```bash
   # Delete node_modules and reinstall
   cd backend && rm -rf node_modules && npm install
   cd frontend && rm -rf node_modules && npm install
   ```

---

## Report Issues

Include when reporting:
- Browser and version
- Error message (exact text)
- Steps to reproduce
- Console errors (F12 → Console)
- Backend logs
- `.env` configuration (without secrets!)

**Happy coding! 🚀**
