#!/bin/bash

# Firebase Deployment Script
# This script builds and deploys the application to Firebase Hosting

echo "🚀 Starting Firebase Deployment Process..."

# Check if Firebase CLI is installed
if ! command -v firebase &> /dev/null; then
    echo "❌ Firebase CLI not found. Please install it first:"
    echo "   npm install -g firebase-tools"
    exit 1
fi

# Check if we're in the correct directory
if [ ! -f "package.json" ]; then
    echo "❌ package.json not found. Please run this script from the project root directory."
    exit 1
fi

echo "✅ Firebase CLI found and project directory confirmed."

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Run TypeScript check
echo "🔍 Checking TypeScript..."
npm run check

# Run linting
echo "🔍 Running linting..."
npm run lint

# Build the application
echo "🏗️ Building the application..."
npm run build

# Check if build was successful
if [ ! -d "dist" ]; then
    echo "❌ Build failed. The 'dist' directory was not created."
    exit 1
fi

echo "✅ Build successful. 'dist' directory created."

# Deploy to Firebase
echo "🚀 Deploying to Firebase Hosting..."
firebase deploy --only hosting

echo "🎉 Deployment completed successfully!"
echo "🌐 Your site is now live at: https://mounircvapp.web.app"