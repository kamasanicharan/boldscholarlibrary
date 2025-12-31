# Firestore Security Rules Setup

## Rules File Created: `firestore.rules`

The security rules have been created in `firestore.rules`. 

## How to Apply These Rules:

### Option 1: Firebase Console (Easiest)
1. Go to https://console.firebase.google.com/
2. Select your project: **boldscholar-d3029**
3. Navigate to **Firestore Database** → **Rules** tab
4. Copy the contents from `firestore.rules` file
5. Paste into the rules editor
6. Click **Publish**

### Option 2: Firebase CLI (If you have it installed)
```bash
firebase deploy --only firestore:rules
```

## What These Rules Do:
- ✅ Users can only read/write their own data in `/users/{userId}/`
- ✅ All other paths are denied by default
- ✅ Requires authentication for all operations
- ✅ Prevents users from accessing other users' data

## Current Rules:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId}/{document=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

**Note**: You need to manually apply these in Firebase Console. I cannot access your Firebase Console directly.


