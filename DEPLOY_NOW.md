# 🚀 Deploy to Vercel - Quick Start

## ✅ Code Pushed to Git!

Your code is now on GitHub. Follow these steps to deploy:

---

## 📋 Quick Deployment Steps

### 1️⃣ Go to Vercel (1 min)
- Visit: https://vercel.com/
- Sign in with GitHub

### 2️⃣ Import Repository (1 min)
- Click **"New Project"**
- Select **boldscholarlibrary** repository
- Vercel will auto-detect Vite settings ✅

### 3️⃣ Add Environment Variable (CRITICAL!)
**Before clicking Deploy:**
- Scroll to **"Environment Variables"**
- Add:
  - **Name**: `GEMINI_API_KEY`
  - **Value**: `AIzaSyCtzrSJs0VGyNZ6KDpU78sghHoLx5C8ogU`
  - **Environments**: ✅ Production ✅ Preview ✅ Development
- Click **"Add"**

### 4️⃣ Deploy! (2 min)
- Click **"Deploy"** button
- Wait for build to complete
- Get your URL: `https://your-app.vercel.app`

### 5️⃣ Configure Firebase (5 min)
After deployment:

**A. Add Vercel domain to Firebase:**
- Go to: https://console.firebase.google.com/
- Project: **boldscholar-d3029**
- **Authentication** → **Settings** → **Authorized domains**
- Add: `your-app.vercel.app`

**B. Add Vercel domain to Google Cloud:**
- Go to: https://console.cloud.google.com/
- **APIs & Services** → **Credentials**
- Click your OAuth client
- **Authorised JavaScript origins** → Add: `https://your-app.vercel.app`

### 6️⃣ Test! (5 min)
- Visit your Vercel URL
- Test sign-up, login, file upload, AI Insight

---

## ⚠️ Important Notes

1. **Environment Variable MUST be added before first deploy**
2. **Wait 1-2 minutes after adding domains to Firebase/Google Cloud**
3. **If build fails, check logs in Vercel dashboard**

---

## 🎯 That's It!

Your app will be live at: `https://your-app.vercel.app`

**For detailed instructions, see: `VERCEL_DEPLOYMENT_GUIDE.md`**

---

**Ready? Go to Vercel and deploy!** 🚀

