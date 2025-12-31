# Fix Firebase API Key Error

## 🔴 Error: "auth/api-key-not-valid"

This error means your Firebase API key is invalid or has restrictions.

## ✅ Solution Steps

### Option 1: Get Fresh Firebase Config (Recommended)

1. **Go to Firebase Console**
   - Visit: https://console.firebase.google.com/
   - Select project: **boldscholar-d3029**

2. **Get Your Web App Config**
   - Click the **⚙️ Settings** (gear icon) → **Project settings**
   - Scroll down to **"Your apps"** section
   - If you see a web app, click on it
   - If no web app exists, click **"Add app"** → **Web** (</> icon)
   - Copy the **firebaseConfig** object

3. **Update firebase.ts**
   - Replace the config in `firebase.ts` with the new one from Firebase Console

### Option 2: Check API Restrictions

1. **Go to Google Cloud Console**
   - Visit: https://console.cloud.google.com/
   - Select project: **boldscholar-d3029**

2. **Check API Key Restrictions**
   - Go to **APIs & Services** → **Credentials**
   - Find your API key (starts with `AIzaSy...`)
   - Click on it
   - Check **"Application restrictions"**
   - If restricted, either:
     - **Remove restrictions** (for development)
     - **Add `localhost` and your domain** to allowed referrers

3. **Check API Restrictions**
   - In the same API key page
   - Check **"API restrictions"**
   - Ensure these are enabled:
     - ✅ Identity Toolkit API
     - ✅ Firebase Authentication API
     - ✅ Google Drive API (if using Drive)

### Option 3: Enable Required APIs

1. **Go to Google Cloud Console**
   - Visit: https://console.cloud.google.com/
   - Select project: **boldscholar-d3029**

2. **Enable APIs**
   - Go to **APIs & Services** → **Library**
   - Search and enable:
     - ✅ **Identity Toolkit API**
     - ✅ **Firebase Authentication API**
     - ✅ **Google Drive API** (for file storage)

---

## 🔧 Quick Fix: Update firebase.ts

After getting the new config from Firebase Console, update `firebase.ts`:

```typescript
const firebaseConfig = {
  apiKey: "YOUR_NEW_API_KEY_HERE",
  authDomain: "boldscholar-d3029.firebaseapp.com",
  projectId: "boldscholar-d3029",
  storageBucket: "boldscholar-d3029.firebasestorage.app",
  messagingSenderId: "374687315074",
  appId: "1:374687315074:web:YOUR_APP_ID",
  measurementId: "G-W8KVMJ1N51"
};
```

---

## 📝 Step-by-Step: Get Firebase Config

1. **Firebase Console** → **Project Settings**
2. **Scroll to "Your apps"**
3. **Click on web app** (or create one)
4. **Copy the config object**
5. **Paste into firebase.ts**

---

## ⚠️ Common Issues

### Issue 1: API Key Has Restrictions
**Solution**: Remove restrictions or add `localhost:3000` and `localhost:3001` to allowed referrers

### Issue 2: APIs Not Enabled
**Solution**: Enable Identity Toolkit API and Firebase Authentication API

### Issue 3: Wrong Project
**Solution**: Make sure you're using the correct Firebase project config

---

## ✅ After Fixing

1. **Restart dev server**:
   ```bash
   # Stop current server (Ctrl+C)
   npm run dev
   ```

2. **Test again**:
   - Try signing up with email/password
   - Should work without API key error

---

**The Firebase API key in your code might be outdated. Get a fresh one from Firebase Console!**


