# Vercel Deployment Guide

## ✅ Setup Complete

I've created all necessary configuration files for Vercel deployment.

## 📋 Deployment Steps

### 1. Create `.env.local` file (IMPORTANT!)
Since I cannot create `.env.local` directly (security), please create it manually:

**Create a file named `.env.local` in the project root with:**
```
GEMINI_API_KEY=AIzaSyCtzrSJs0VGyNZ6KDpU78sghHoLx5C8ogU
```

### 2. Install Vercel CLI (Optional but Recommended)
```bash
npm install -g vercel
```

### 3. Deploy to Vercel

#### Option A: Using Vercel CLI
```bash
# Login to Vercel
vercel login

# Deploy
vercel

# For production deployment
vercel --prod
```

#### Option B: Using Vercel Dashboard
1. Go to https://vercel.com/
2. Click "New Project"
3. Import your Git repository (GitHub/GitLab/Bitbucket)
4. Vercel will auto-detect Vite settings
5. **Add Environment Variable:**
   - Key: `GEMINI_API_KEY`
   - Value: `AIzaSyCtzrSJs0VGyNZ6KDpU78sghHoLx5C8ogU`
6. Click "Deploy"

### 4. Configure Environment Variables in Vercel

**After deployment, add the environment variable:**

1. Go to your project in Vercel Dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add:
   - **Name**: `GEMINI_API_KEY`
   - **Value**: `AIzaSyCtzrSJs0VGyNZ6KDpU78sghHoLx5C8ogU`
   - **Environments**: Production, Preview, Development (select all)
4. Click **Save**
5. **Redeploy** your project for changes to take effect

### 5. Add Authorized Domain to Firebase

After deployment, you'll get a Vercel URL (e.g., `your-app.vercel.app`):

1. Go to Firebase Console
2. Navigate to **Authentication** → **Settings** → **Authorized domains**
3. Click **Add domain**
4. Add your Vercel domain (e.g., `your-app.vercel.app`)
5. Save

## 📁 Files Created

- ✅ `vercel.json` - Vercel configuration
- ✅ `.vercelignore` - Files to exclude from deployment
- ✅ `firestore.rules` - Security rules (apply manually in Firebase Console)

## 🔒 Security Notes

- Never commit `.env.local` to Git (it's in `.gitignore`)
- The API key is stored securely in Vercel environment variables
- Firestore rules need to be applied manually in Firebase Console

## 🚀 Post-Deployment Checklist

- [ ] Created `.env.local` file locally
- [ ] Added `GEMINI_API_KEY` to Vercel environment variables
- [ ] Applied Firestore security rules in Firebase Console
- [ ] Added Vercel domain to Firebase authorized domains
- [ ] Tested login functionality
- [ ] Tested AI analysis feature
- [ ] Tested file upload

## 🎉 You're Ready!

Once deployed, your app will be live at: `https://your-app.vercel.app`


