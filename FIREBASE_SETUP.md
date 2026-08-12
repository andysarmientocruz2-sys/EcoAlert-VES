# 🔥 Firebase Setup Guide - EcoAlert VES

Complete guide to set up Firebase for EcoAlert VES development and production.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Firebase Project Creation](#firebase-project-creation)
3. [Enable Firebase Services](#enable-firebase-services)
4. [Get Firebase Credentials](#get-firebase-credentials)
5. [Configure Environment Variables](#configure-environment-variables)
6. [Verify Firebase Connection](#verify-firebase-connection)
7. [Next Steps](#next-steps)

---

## Prerequisites

- Google account
- Node.js 16+ installed
- pnpm installed (`npm install -g pnpm`)
- EcoAlert VES project cloned

---

## Firebase Project Creation

### Step 1: Go to Firebase Console

1. Open [Firebase Console](https://console.firebase.google.com/)
2. Sign in with your Google account
3. Click "Create a project" or "Add project"

### Step 2: Create Project

1. **Project Name:** Enter `ecoalert-ves` (or your preferred name)
2. **Analytics:** Optionally enable Google Analytics (recommended for production)
3. Click "Create project"
4. Wait for project creation to complete

### Step 3: Create Web App

1. In Firebase Console, click the web icon `</>` to create a web app
2. **App nickname:** Enter `ecoalert-ves-web`
3. Check "Also set up Firebase Hosting for this app" (optional, for later)
4. Click "Register app"
5. **You'll see your Firebase config** - Save this for later!

---

## Enable Firebase Services

### Enable Authentication

1. Go to **Authentication** (left sidebar)
2. Click **Get started**
3. Enable these sign-in methods:
   - **Email/Password** (required)
   - **Google** (recommended, for later implementation)
   - **Anonymous** (optional, for testing)

### Enable Firestore Database

1. Go to **Firestore Database** (left sidebar)
2. Click **Create database**
3. **Location:** Choose closest to your users
4. **Security rules:** Start in **test mode** (for development)
5. Click **Create**

### Enable Cloud Storage

1. Go to **Storage** (left sidebar)
2. Click **Get started**
3. **Location:** Same as Firestore
4. **Security rules:** Start in **test mode** (for development)
5. Click **Done**

---

## Get Firebase Credentials

### Step 1: Find Your Credentials

1. In Firebase Console, go to **Project Settings** (gear icon)
2. Go to **General** tab
3. Scroll down to find your **Web API Key** section
4. You'll see these values:
   - API Key
   - Auth Domain
   - Project ID
   - Storage Bucket
   - Messaging Sender ID
   - App ID
   - Measurement ID (optional)

### Step 2: Copy Each Value

Keep these values safe - you'll need them in the next step.

---

## Configure Environment Variables

### Step 1: Create Local Environment File

In the project root directory, create a file named `.env.local`:

```bash
cd /path/to/ecoalert-ves
touch .env.local
```

### Step 2: Add Firebase Credentials

Open `.env.local` and add your Firebase credentials:

```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=YOUR_API_KEY_HERE
VITE_FIREBASE_AUTH_DOMAIN=YOUR_PROJECT_ID.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=YOUR_PROJECT_ID
VITE_FIREBASE_STORAGE_BUCKET=YOUR_PROJECT_ID.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=YOUR_MESSAGING_SENDER_ID
VITE_FIREBASE_APP_ID=YOUR_APP_ID
VITE_FIREBASE_MEASUREMENT_ID=YOUR_MEASUREMENT_ID

# Google Maps API Key (Optional - for later)
VITE_GOOGLE_MAPS_API_KEY=YOUR_GOOGLE_MAPS_API_KEY
```

### Step 3: Replace Placeholders

Replace each placeholder with your actual Firebase credentials:

| Placeholder | Where to Find |
|------------|---------------|
| `YOUR_API_KEY_HERE` | Firebase Console > Project Settings > Web API Key |
| `YOUR_PROJECT_ID` | Firebase Console > Project Settings > Project ID |
| `YOUR_MESSAGING_SENDER_ID` | Firebase Console > Project Settings > Messaging Sender ID |
| `YOUR_APP_ID` | Firebase Console > Project Settings > App ID |
| `YOUR_MEASUREMENT_ID` | Firebase Console > Project Settings > Measurement ID |

### Step 4: Save File

Save `.env.local` - **NEVER commit this file to version control!**

---

## Verify Firebase Connection

### Step 1: Install Dependencies

```bash
cd /path/to/ecoalert-ves
pnpm install
```

### Step 2: Start Development Server

```bash
pnpm dev
```

### Step 3: Check Console

1. Open browser console (F12 or Cmd+Option+I)
2. You should NOT see Firebase configuration warnings
3. Look for messages like:
   ```
   ✅ Firebase initialized successfully
   ```

### Step 4: Test Firebase Connection

The app should load without errors. If you see:

```
⚠️ Firebase Configuration Warning:
Missing environment variables: ...
```

This means your `.env.local` file is not set up correctly. Double-check the values.

---

## Firebase Security Rules (Development)

### Firestore Rules

For development, use these permissive rules (⚠️ NOT for production):

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow all reads and writes in development
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

To set these:
1. Go to **Firestore Database** > **Rules** tab
2. Replace the default rules with above
3. Click **Publish**

### Storage Rules

For development, use these permissive rules (⚠️ NOT for production):

```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Allow all reads and writes in development
    match /{allPaths=**} {
      allow read, write: if true;
    }
  }
}
```

To set these:
1. Go to **Storage** > **Rules** tab
2. Replace the default rules with above
3. Click **Publish**

---

## Project Structure

Firebase is organized in `client/src/firebase/`:

```
client/src/firebase/
├── config.ts          # Firebase initialization
├── auth.ts            # Authentication functions
├── firestore.ts       # Firestore database functions
├── storage.ts         # Cloud Storage functions
└── index.ts           # Central exports
```

### Usage Examples

```typescript
// Import Firebase services
import { auth, db, storage } from '@/firebase';
import { getCurrentUser, isAuthenticated } from '@/firebase/auth';
import { getDocument, setDocument } from '@/firebase/firestore';
import { uploadFile } from '@/firebase/storage';

// Check if user is authenticated
if (isAuthenticated()) {
  const user = getCurrentUser();
  console.log('User:', user?.email);
}

// Get a document from Firestore
const userData = await getDocument('users', 'user123');

// Upload a file to Storage
const file = new File(['content'], 'test.txt');
const result = await uploadFile('test/file.txt', file);
console.log('File URL:', result.url);
```

---

## Troubleshooting

### Issue: "Missing environment variables"

**Solution:**
1. Check `.env.local` exists in project root
2. Verify all values are correct (copy-paste from Firebase Console)
3. Restart dev server: `pnpm dev`

### Issue: "Firebase is not initialized"

**Solution:**
1. Ensure Firebase credentials are in `.env.local`
2. Check browser console for specific error messages
3. Verify Firestore and Storage are enabled in Firebase Console

### Issue: "Permission denied" errors

**Solution:**
1. Go to Firestore/Storage rules
2. Ensure you're using the development rules above
3. Click "Publish" to apply changes

### Issue: CORS errors with Storage

**Solution:**
1. This is normal in development
2. For production, configure CORS properly in Google Cloud Storage
3. See [Firebase Storage CORS Guide](https://firebase.google.com/docs/storage/web/download-files#cors_configuration)

---

## Next Steps

### Phase 1: Authentication (Ready to implement)
- [ ] Implement email/password login
- [ ] Implement email/password registration
- [ ] Implement password reset
- [ ] Implement Google Sign-In

### Phase 2: Database (Ready to implement)
- [ ] Create user profiles in Firestore
- [ ] Create reports collection
- [ ] Create comments collection
- [ ] Implement real-time data synchronization

### Phase 3: File Storage (Ready to implement)
- [ ] Upload report images
- [ ] Upload user profile pictures
- [ ] Implement image optimization
- [ ] Set up CDN for faster delivery

### Phase 4: Advanced Features (Ready to implement)
- [ ] Implement Cloud Functions for server-side logic
- [ ] Set up Firebase Hosting for deployment
- [ ] Implement real-time notifications
- [ ] Set up analytics and monitoring

---

## Production Deployment

### Before Going Live

1. **Update Security Rules**
   - Replace test mode rules with production rules
   - Restrict access to authenticated users only
   - Implement proper access control

2. **Enable Billing**
   - Firebase requires a billing account for production
   - Set up budget alerts

3. **Configure Domains**
   - Add your domain to Firebase Console
   - Set up SSL certificates

4. **Environment Variables**
   - Use Manus Secrets for production credentials
   - Never commit `.env.local` to version control

5. **Testing**
   - Test all authentication flows
   - Test data persistence
   - Test file uploads
   - Test with real data

---

## Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firebase Authentication Guide](https://firebase.google.com/docs/auth)
- [Firestore Documentation](https://firebase.google.com/docs/firestore)
- [Firebase Storage Guide](https://firebase.google.com/docs/storage)
- [Firebase Security Rules](https://firebase.google.com/docs/rules)

---

## Support

If you encounter issues:

1. Check the [Troubleshooting](#troubleshooting) section
2. Review Firebase Console logs
3. Check browser console for error messages
4. Consult [Firebase Documentation](https://firebase.google.com/docs)

---

**Last Updated:** July 15, 2026  
**Firebase SDK Version:** 12.16.0  
**Status:** ✅ Infrastructure Ready
