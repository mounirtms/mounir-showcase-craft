# Firebase Deployment Guide

This guide explains how to deploy the portfolio application to Firebase Hosting.

## Prerequisites

1. **Firebase CLI**: Install the Firebase CLI tools
   ```bash
   npm install -g firebase-tools
   ```

2. **Firebase Account**: Create a Firebase account at https://firebase.google.com/

3. **Login to Firebase**:
   ```bash
   firebase login
   ```

## Project Setup

1. **Create a Firebase Project**:
   - Go to the Firebase Console: https://console.firebase.google.com/
   - Click "Create a project"
   - Follow the setup wizard
   - Note your Project ID

2. **Configure Firebase in your project**:
   The project is already configured with the following settings in `.firebaserc`:
   ```json
   {
     "projects": {
       "default": "mounircvapp"
     }
   }
   ```

## Deployment Process

### Option 1: Using the Deployment Scripts

#### For Unix/Linux/macOS:
```bash
chmod +x deploy-firebase.sh
./deploy-firebase.sh
```

#### For Windows:
```cmd
deploy-firebase.bat
```

### Option 2: Manual Deployment

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Run Type Checking**:
   ```bash
   npm run check
   ```

3. **Run Linting**:
   ```bash
   npm run lint
   ```

4. **Build the Application**:
   ```bash
   npm run build
   ```

5. **Deploy to Firebase**:
   ```bash
   firebase deploy --only hosting
   ```

## Configuration Details

The Firebase hosting configuration in `firebase.json` includes:

- **Public Directory**: `dist` (where the built files are located)
- **Ignore Patterns**: Common files that shouldn't be deployed
- **Rewrites**: All routes redirect to `index.html` for SPA support
- **Headers**: Optimized caching for different file types:
  - Images: 1 day cache
  - JS/CSS: 1 year cache
  - 404 page: 5 minute cache

## Environment Variables

If you're using Firebase services (Firestore, Auth, etc.), create a `.env` file with your Firebase configuration:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_bucket.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

## Troubleshooting

### Common Issues

1. **Permission Denied**:
   - Ensure you're logged into Firebase: `firebase login`
   - Check your project permissions in the Firebase Console

2. **Build Failures**:
   - Run `npm run check` to identify TypeScript issues
   - Run `npm run lint` to identify code style issues

3. **Deployment Errors**:
   - Verify your Firebase project ID in `.firebaserc`
   - Check your internet connection
   - Ensure you have the latest Firebase CLI: `npm update -g firebase-tools`

### Useful Firebase Commands

- `firebase projects:list` - List your Firebase projects
- `firebase use <project-id>` - Switch to a different project
- `firebase hosting:channel:deploy <channel-name>` - Deploy to a preview channel
- `firebase logout` - Log out of Firebase

## Post-Deployment

After successful deployment, your site will be available at:
- Default URL: `https://mounircvapp.web.app`
- Custom domain (if configured): `https://yourdomain.com`

You can also access the Firebase Console to monitor your deployment and configure additional features.