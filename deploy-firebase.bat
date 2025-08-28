@echo off
REM Firebase Deployment Script for Windows
REM This script builds and deploys the application to Firebase Hosting

echo 🚀 Starting Firebase Deployment Process...

REM Check if Firebase CLI is installed
firebase --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Firebase CLI not found. Please install it first:
    echo    npm install -g firebase-tools
    exit /b 1
)

REM Check if we're in the correct directory
if not exist "package.json" (
    echo ❌ package.json not found. Please run this script from the project root directory.
    exit /b 1
)

echo ✅ Firebase CLI found and project directory confirmed.

REM Install dependencies
echo 📦 Installing dependencies...
npm install

REM Run TypeScript check
echo 🔍 Checking TypeScript...
npm run check

REM Run linting
echo 🔍 Running linting...
npm run lint

REM Build the application
echo 🏗️ Building the application...
npm run build

REM Check if build was successful
if not exist "dist" (
    echo ❌ Build failed. The 'dist' directory was not created.
    exit /b 1
)

echo ✅ Build successful. 'dist' directory created.

REM Deploy to Firebase
echo 🚀 Deploying to Firebase Hosting...
firebase deploy --only hosting

echo 🎉 Deployment completed successfully!
echo 🌐 Your site is now live at: https://mounircvapp.web.app

pause