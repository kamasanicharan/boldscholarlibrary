# 🎯 Action Plan - What to Do Next

## ✅ What We Just Fixed

1. ✅ Updated Firebase API key in `firebase.ts` (corrected capitalization)
2. ✅ Identified missing OAuth origins issue

---

## 🔴 IMMEDIATE ACTION (Do This First - 2 minutes)

### Step 1: Add Missing OAuth Origins

**This will fix the API key error!**

1. **Go to Google Cloud Console**
   - Visit: https://console.cloud.google.com/
   - Select project: **BoldScholar** (boldscholar-d3029)

2. **Open OAuth Client**
   - Navigate to: **APIs & Services** → **Credentials**
   - Click on: **"Web client (auto created by Google Service)"**

3. **Add Missing Origins**
   - Scroll to **"Authorised JavaScript origins"**
   - Click **"+ Add URI"**
   - Add: `http://localhost:3000`
   - Click **"+ Add URI"** again
   - Add: `http://localhost:3001`
   - Click **"Save"** at the bottom

4. **Wait & Restart**
   - Wait 1-2 minutes for changes to propagate
   - Restart your dev server:
     ```bash
     # Stop current server (Ctrl+C in terminal)
     npm run dev
     ```

5. **Test**
   - Try signing up with email/password
   - Should work now! ✅

---

## 📋 Next Steps (After OAuth Fix)

### Step 2: Enable Email/Password Authentication (2 minutes)

1. **Go to Firebase Console**
   - Visit: https://console.firebase.google.com/
   - Select project: **boldscholar-d3029**

2. **Enable Email/Password**
   - Navigate to: **Authentication** → **Sign-in method**
   - Click on **Email/Password**
   - Toggle **Enable** to ON
   - Click **Save**

3. **Test**
   - Try signing up with email/password
   - Should work! ✅

---

### Step 3: Apply Firestore Security Rules (2 minutes)

**Important for security!**

1. **Go to Firebase Console**
   - Visit: https://console.firebase.google.com/
   - Select project: **boldscholar-d3029**

2. **Apply Rules**
   - Navigate to: **Firestore Database** → **Rules** tab
   - Open `firestore.rules` file in your project
   - Copy the entire content
   - Paste into Firebase Console rules editor
   - Click **Publish**

**Rules to paste:**
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

---

### Step 4: Test Everything Locally (5 minutes)

**Test Checklist:**
- [ ] Sign up with email/password ✅
- [ ] Sign in with email/password ✅
- [ ] Sign in with Google ✅
- [ ] Upload a file to CS Library ✅
- [ ] Test AI Insight feature ✅
- [ ] Link Google account (if signed in with email) ✅
- [ ] Check Media Vault ✅
- [ ] Test Mastery Vault ✅

---

### Step 5: Deploy to Vercel (10 minutes)

**Once everything works locally:**

1. **Commit Your Changes**
   ```bash
   git add .
   git commit -m "Fixed Firebase config and ready for deployment"
   git push origin main
   ```

2. **Deploy on Vercel**
   - Go to: https://vercel.com/
   - Click **"New Project"**
   - Import your GitHub repository
   - Vercel will auto-detect Vite
   - **Add Environment Variable:**
     - Name: `GEMINI_API_KEY`
     - Value: `AIzaSyCtzrSJs0VGyNZ6KDpU78sghHoLx5C8ogU`
   - Click **Deploy**

3. **Get Your URL**
   - You'll get: `your-app.vercel.app`

---

### Step 6: Configure Production (5 minutes)

**After deployment:**

1. **Add Vercel Domain to Firebase**
   - Go to Firebase Console
   - **Authentication** → **Settings** → **Authorized domains**
   - Click **Add domain**
   - Add: `your-app.vercel.app`
   - Save

2. **Add Vercel Domain to OAuth Origins**
   - Go to Google Cloud Console
   - **APIs & Services** → **Credentials**
   - Click OAuth client
   - Add: `https://your-app.vercel.app`
   - Save

3. **Test Production**
   - Visit your Vercel URL
   - Test all features
   - Should work! ✅

---

## 🎯 Priority Order

**Do these in order:**

1. ✅ **Add OAuth origins** (fixes API key error) - **DO THIS NOW**
2. ✅ **Enable Email/Password** (allows sign-up)
3. ✅ **Apply Firestore rules** (security)
4. ✅ **Test locally** (verify everything works)
5. ✅ **Deploy to Vercel** (go live)
6. ✅ **Configure production** (add domains)

---

## 🚀 Quick Commands

```bash
# Restart dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Git commands (when ready to deploy)
git add .
git commit -m "Ready for deployment"
git push origin main
```

---

## ✅ Current Status

- ✅ Firebase API key: **FIXED**
- ⚠️ OAuth origins: **NEED TO ADD** (localhost:3000, localhost:3001)
- ⚠️ Email/Password auth: **NEED TO ENABLE**
- ⚠️ Firestore rules: **NEED TO APPLY**
- ✅ Code: **READY**
- ⚠️ Deployment: **PENDING**

---

## 🎉 After Step 1 (OAuth Origins)

Once you add the OAuth origins and restart:
- ✅ API key error should be gone
- ✅ Sign-up/login should work
- ✅ You can test all features

**Start with Step 1 - Add OAuth origins. That's the blocker right now!**


