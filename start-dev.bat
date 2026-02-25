@echo off
REM Virtual Assistant Startup Script for Windows

echo ======================================
echo Virtual Assistant - Development Setup
echo ======================================
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Error: Node.js is not installed. Please install Node.js first.
    pause
    exit /b 1
)

echo Node.js detected successfully!
echo.

REM Check if MongoDB connection is available
echo Checking MongoDB connection...
REM This is optional - you can comment out if using MongoDB Atlas

echo.
echo Starting Virtual Assistant...
echo.

REM Start backend in one terminal
echo Starting Backend Server (Port 5000)...
start cmd /k "cd backend && npm run dev"

REM Wait a moment for backend to start
timeout /t 3 /nobreak

REM Start frontend in another terminal
echo Starting Frontend Server (Port 5173)...
start cmd /k "cd frontend && npm run dev"

echo.
echo ======================================
echo Servers starting...
echo Backend: http://localhost:5000
echo Frontend: http://localhost:5173
echo ======================================
echo.
echo Make sure to:
echo 1. Configure .env files in both backend and frontend directories
echo 2. Ensure MongoDB is running
echo 3. Check that ports 5000 and 5173 are available
echo.
pause
