# Fix OAuth Authorized Origins

## 🔴 Issue Found

Your OAuth client has these authorized origins:
- ✅ `http://localhost`
- ✅ `http://localhost:5000`
- ❌ `http://localhost:3000` (MISSING - your app runs here!)
- ❌ `http://localhost:3001` (MISSING - your app runs here!)

## ✅ Solution: Add Missing Origins

### Steps:

1. **Go to Google Cloud Console**
   - Visit: https://console.cloud.google.com/
   - Select project: **BoldScholar** (boldscholar-d3029)

2. **Navigate to OAuth Client**
   - Go to **APIs & Services** → **Credentials**
   - Find: **"Web client (auto created by Google Service)"**
   - Click on it

3. **Add Authorized JavaScript Origins**
   - Scroll to **"Authorised JavaScript origins"** section
   - Click **"+ Add URI"** button
   - Add: `http://localhost:3000`
   - Click **"+ Add URI"** again
   - Add: `http://localhost:3001`
   - Click **"Save"** at the bottom

4. **After Saving**
   - Wait 1-2 minutes for changes to propagate
   - Restart your dev server
   - Try signing up/login again

---

## 📝 Current Origins (What You Have)

- `http://localhost`
- `http://localhost:5000`
- `https://boldscholar-d3029.firebaseapp.com`

## ✅ What You Need

- `http://localhost`
- `http://localhost:3000` ← **ADD THIS**
- `http://localhost:3001` ← **ADD THIS**
- `http://localhost:5000`
- `https://boldscholar-d3029.firebaseapp.com`

---

## 🚀 After Adding Origins

1. **Save** in Google Cloud Console
2. **Wait 1-2 minutes**
3. **Restart dev server**:
   ```bash
   # Stop server (Ctrl+C)
   npm run dev
   ```
4. **Test sign-up/login** - should work now!

---

**This is the missing piece! Add localhost:3000 and localhost:3001 to authorized origins.**


