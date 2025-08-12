# Firebase Setup Guide

## Quick Setup (5 minutes)

### 1. Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project"
3. Name it "Matt's Eldercare App"
4. Follow the setup wizard (you can disable Google Analytics for now)

### 2. Enable Authentication
1. In your Firebase project, go to "Authentication" in the left sidebar
2. Click "Get started"
3. Go to "Sign-in method" tab
4. Enable "Email/Password" provider
5. Click "Save"

### 3. Enable Firestore Database
1. Go to "Firestore Database" in the left sidebar
2. Click "Create database"
3. Choose "Start in test mode" (we'll secure it later)
4. Choose a location close to you
5. Click "Done"

### 4. Get Your Firebase Config
1. Click the gear icon next to "Project Overview"
2. Select "Project settings"
3. Scroll down to "Your apps" section
4. Click the web icon (</>)
5. Register your app with a nickname like "Eldercare Web"
6. Copy the config object that looks like this:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyBXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456"
};
```

### 5. Update Your App
1. Open `src/services/firebase.ts`
2. Replace the placeholder config with your real config
3. Save the file

### 6. Test the App
1. Run `npx expo start --tunnel`
2. Try signing up with a new account
3. Everything should work!

## Features You'll Get
- ✅ User authentication with email/password
- ✅ User profiles stored in Firestore
- ✅ Tasks and appointments per user
- ✅ Real-time data sync
- ✅ No server management needed
- ✅ Free tier (25,000 reads/day, 20,000 writes/day)

## Security Rules (Optional)
Later, you can add security rules to Firestore to ensure users can only access their own data:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    match /tasks/{taskId} {
      allow read, write: if request.auth != null && resource.data.userId == request.auth.uid;
    }
    match /appointments/{appointmentId} {
      allow read, write: if request.auth != null && resource.data.userId == request.auth.uid;
    }
  }
}
```

## Need Help?
- [Firebase Documentation](https://firebase.google.com/docs)
- [Firebase Console](https://console.firebase.google.com/)
- [Firebase Support](https://firebase.google.com/support)
