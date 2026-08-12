/**
 * Firebase Configuration
 * 
 * This file initializes Firebase with environment variables.
 * Never commit actual credentials - use .env.local for development.
 * 
 * @see FIREBASE_SETUP.md for setup instructions
 */

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Validate required environment variables
const requiredEnvVars = [
  'VITE_FIREBASE_API_KEY',
  'VITE_FIREBASE_AUTH_DOMAIN',
  'VITE_FIREBASE_PROJECT_ID',
  'VITE_FIREBASE_STORAGE_BUCKET',
  'VITE_FIREBASE_MESSAGING_SENDER_ID',
  'VITE_FIREBASE_APP_ID',
] as const;

const missingVars = requiredEnvVars.filter(
  (varName) => !import.meta.env[varName]
);

// Flag to check if Firebase is properly configured
export const isFirebaseConfigured = missingVars.length === 0;

if (missingVars.length > 0) {
  console.warn(
    `⚠️ Firebase Configuration Warning:\n` +
    `Missing environment variables: ${missingVars.join(', ')}\n` +
    `Please create a .env.local file with Firebase credentials.\n` +
    `See FIREBASE_SETUP.md for instructions.\n` +
    `Running in DEMO MODE - Some features will be limited.`
  );
}

/**
 * Firebase configuration object
 * Loaded from environment variables
 * Uses placeholder values if not configured
 */
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'demo-api-key',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'demo.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'demo-project',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'demo-bucket.appspot.com',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || 'demo-sender',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || 'demo-app',
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

/**
 * Initialize Firebase App
 * Single instance used throughout the application
 */
let firebaseApp: ReturnType<typeof initializeApp> | null = null;
let auth: ReturnType<typeof getAuth> | null = null;
let db: ReturnType<typeof getFirestore> | null = null;
let storage: ReturnType<typeof getStorage> | null = null;

try {
  firebaseApp = initializeApp(firebaseConfig);
  
  /**
   * Firebase Authentication
   * Used for user authentication (email, Google, etc.)
   */
  auth = getAuth(firebaseApp);

  /**
   * Cloud Firestore Database
   * Used for storing user data, reports, comments, etc.
   */
  db = getFirestore(firebaseApp);

  /**
   * Firebase Storage
   * Used for storing images, documents, etc.
   */
  storage = getStorage(firebaseApp);
} catch (error) {
  console.error('Firebase initialization error:', error);
  console.log('Application will run in DEMO MODE');
}

export { firebaseApp, auth, db, storage };

// Enable offline persistence for Firestore (optional)
// This allows the app to work offline and sync when connection is restored
if (db) {
  try {
    // Note: Offline persistence is only available on web in certain conditions
    // Uncomment when ready to implement offline support
    // enableIndexedDbPersistence(db);
  } catch (err: unknown) {
    if ((err as { code?: string }).code === 'failed-precondition') {
      console.warn('Multiple tabs open - offline persistence disabled');
    } else if ((err as { code?: string }).code === 'unimplemented') {
      console.warn('Browser does not support offline persistence');
    }
  }
}

export default firebaseApp;
