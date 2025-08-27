import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
import { getFirestore, type Firestore, connectFirestoreEmulator } from "firebase/firestore";
import { getAuth, type Auth, connectAuthEmulator } from "firebase/auth";
import { getAnalytics, type Analytics } from "firebase/analytics";

// Read config from Vite env vars. Create a .env or .env.local with these keys.
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
} as const;

// Validate configuration
const hasRequiredConfig = Boolean(
  firebaseConfig.apiKey &&
  firebaseConfig.authDomain &&
  firebaseConfig.projectId &&
  firebaseConfig.apiKey !== 'mock-api-key-for-development'
);

// Enable Firebase in production or development with valid config
export const isFirebaseEnabled: boolean = hasRequiredConfig && (
  import.meta.env.PROD || 
  (import.meta.env.DEV && import.meta.env.VITE_FIREBASE_ENABLE_DEV === 'true')
);

// Debug logging
console.log('🔥 Firebase Debug Info:', {
  hasRequiredConfig,
  isFirebaseEnabled,
  isDev: import.meta.env.DEV,
  isProd: import.meta.env.PROD,
  enableDev: import.meta.env.VITE_FIREBASE_ENABLE_DEV,
  apiKey: firebaseConfig.apiKey ? '✅ Present' : '❌ Missing',
  projectId: firebaseConfig.projectId || '❌ Missing'
});

// Log configuration status
if (import.meta.env.DEV) {
  console.log('Firebase Configuration Status:', {
    hasRequiredConfig,
    isEnabled: isFirebaseEnabled,
    environment: import.meta.env.MODE,
    authDomain: firebaseConfig.authDomain
  });
}

let app: FirebaseApp | undefined;
let db: Firestore | undefined;
let auth: Auth | undefined;
let analytics: Analytics | undefined;

if (isFirebaseEnabled) {
  try {
    app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
    db = getFirestore(app);
    auth = getAuth(app);
    
    // Initialize Analytics only in production
    if (typeof window !== 'undefined' && import.meta.env.PROD) {
      analytics = getAnalytics(app);
    }
    
    // Connect to emulators in development - disabled to avoid connection issues in production
    if (import.meta.env.DEV && typeof window !== 'undefined' && import.meta.env.VITE_FIREBASE_USE_EMULATORS === 'true') {
      try {
        // Only connect if not already connected
        if (auth && !auth._delegate._config?.emulator) {
          connectAuthEmulator(auth, 'http://localhost:9099', { disableWarnings: true });
        }
        if (db && !db._delegate._databaseId?.projectId?.includes('demo-')) {
          connectFirestoreEmulator(db, 'localhost', 8081);
        }
      } catch (error) {
        console.log('Firebase emulators not available, using production');
      }
    }
    
    console.log('✅ Firebase initialized successfully');
  } catch (error) {
    console.error('❌ Firebase initialization failed:', error);
    // Reset Firebase state on initialization failure
    app = undefined;
    db = undefined;
    auth = undefined;
    analytics = undefined;
  }
}

export { app, db, auth, analytics, firebaseConfig };
