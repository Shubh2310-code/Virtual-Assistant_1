# Virtual Assistant - AI-Powered Voice Commands

A modern, intelligent voice assistant application with beautiful UI, social media integration, and search history tracking.

## 🎯 Features

### Core Features
- **Voice Recognition**: Real-time speech-to-text conversion
- **AI Responses**: Powered by Google's Gemini API for intelligent responses
- **Text-to-Speech**: Automatic voice output for responses
- **Search History**: Keep track of all your commands and responses
- **Social Media Integration**: Direct access to Instagram, Facebook, Google, YouTube
- **Platform-Specific Search**: Search Instagram hashtags, Facebook posts, Google results, YouTube videos
- **Platform Opening**: Quick access to open Instagram, Facebook, Google, YouTube with voice commands
- **Customizable Assistant**: Personalize your assistant's name and profile image
- **Caching**: Smart response caching to reduce API calls
- **Rate Limiting**: Prevents excessive API calls (3-5 second intervals)

### UI Features
- **Modern Gradient Design**: Beautiful gradient backgrounds and smooth animations
- **Real-time Status**: Visual feedback with pulsing lights and animations
- **Responsive Layout**: Fully responsive on mobile and desktop
- **History Sidebar**: Slide-out panel showing search history
- **Quick Action Buttons**: One-click access to social platforms
- **Loading Indicators**: Animated loading states
- **Dark Theme**: Eye-friendly dark gradient theme

## 📋 Tech Stack

### Frontend
- React 19.2.0
- React Router DOM 7.12.0
- Axios 1.13.2
- Tailwind CSS 4.1.18
- React Icons 5.5.0
- Vite (Build tool)

### Backend
- Express.js 5.2.1
- Node.js
- MongoDB with Mongoose 9.0.2
- Google Gemini API
- Cloudinary (Image upload)

### Development Tools
- ESLint 9.39.1
- Nodemon 3.1.11

## 🚀 Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud)
- Google Gemini API key
- Cloudinary account (for image uploads)

### Backend Setup

1. **Navigate to backend directory:**
```bash
cd backend
```

2. **Install dependencies:**
```bash
npm install
```

3. **Create `.env` file in backend directory:**
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
GEMINI_API_URL=https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=YOUR_GEMINI_API_KEY
JWT_SECRET=your_secret_key
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret
FRONTEND_URL=http://localhost:5173
```

4. **Start backend server:**
```bash
npm run dev
```

Backend will run on `http://localhost:5000`

### Frontend Setup

1. **Navigate to frontend directory:**
```bash
cd frontend
```

2. **Install dependencies:**
```bash
npm install
```

3. **Create `.env` file in frontend directory (optional):**
```env
VITE_SERVER_URL=http://localhost:5000
```

4. **Start development server:**
```bash
npm run dev
```

Frontend will run on `http://localhost:5173`

## 🎤 Using the Assistant

### Voice Commands Examples

**Opening Platforms:**
- "Open Instagram"
- "Open Facebook"
- "Open Google"
- "Open calculator"

**Searching Platforms:**
- "Search Instagram for fashion"
- "Search Facebook for news"
- "Search Google for weather"
- "Search YouTube for music"

**General Commands:**
- "What's the time?"
- "What's the date?"
- "What day is today?"
- "What's your name?"

**Information Queries:**
- "How are you?"
- "Who created you?"
- Any factual question

## 📱 API Endpoints

### User Routes
- `GET /api/user/current` - Get current user profile
- `POST /api/user/askToAssistant` - Send voice command
- `GET /api/user/history` - Get search history
- `POST /api/user/clear-history` - Clear all history
- `POST /api/user/search-social` - Search on social platforms
- `POST /api/user/update-assistant` - Update assistant profile

### Auth Routes
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/user/logout` - Logout user

## 🎨 UI Components

### Home Page
- Assistant avatar with animations
- Real-time transcript display
- Instant response display
- Microphone control button
- History sidebar
- Quick action buttons (Instagram, Facebook, Google, Calculator)
- Customize and Sign Out buttons

### History Sidebar
- Clickable history items
- Full command and response display
- Timestamp for each entry
- Clear history functionality
- Click to re-execute commands

## 🔧 Configuration

### CORS Configuration
Backend accepts requests from:
- `http://localhost:5173`
- `http://localhost:5174`
- `http://127.0.0.1:5173`
- `http://127.0.0.1:5174`
- `http://localhost:3000`
- Environment variable `FRONTEND_URL`

### Rate Limiting
- 3 seconds between API calls
- Automatic retry after rate limit
- Caching prevents duplicate API calls

## 📊 Database Schema

### User Model
```javascript
{
  name: String,
  email: String (unique),
  password: String,
  assistantName: String,
  assistantImage: String,
  history: [{
    command: String,
    response: String,
    type: String,
    timestamp: Date
  }],
  createdAt: Date,
  updatedAt: Date
}
```

## 🛠️ Troubleshooting

### Backend Connection Issues
- Ensure MongoDB is running
- Check GEMINI_API_URL in .env
- Verify port 5000 is available
- Check CORS configuration

### Frontend Not Connecting
- Verify backend is running on port 5000
- Check browser console for errors
- Ensure microphone permissions are granted
- Clear browser cache if needed

### Microphone Not Working
- Grant microphone permission in browser
- Use HTTPS or localhost
- Check browser microphone settings
- Ensure no other app is using microphone

### Gemini API Errors
- Verify API key is valid
- Check API quota
- Ensure proper API URL format
- Check rate limiting (429 errors)

## 🌐 Deployment

### Deploy Backend (Heroku/Railway)
1. Set environment variables on platform
2. Deploy using git push
3. Update FRONTEND_URL in environment

### Deploy Frontend (Vercel/Netlify)
1. Set `VITE_SERVER_URL` to your backend URL
2. Deploy using platform's CLI or UI
3. Update CORS on backend

## 📝 Environment Variables Checklist

**Backend:**
- [ ] PORT
- [ ] MONGODB_URI
- [ ] GEMINI_API_URL
- [ ] JWT_SECRET
- [ ] CLOUDINARY_CLOUD_NAME
- [ ] CLOUDINARY_API_KEY
- [ ] CLOUDINARY_API_SECRET
- [ ] FRONTEND_URL

**Frontend:**
- [ ] VITE_SERVER_URL (optional)

## 🤝 Contributing
Feel free to fork and submit pull requests for any improvements.

## 📄 License
This project is open source and available under the MIT License.

## 📧 Support
For issues and questions, please open an issue in the repository.

---

**Made with ❤️ by Virtual Assistant Team**
