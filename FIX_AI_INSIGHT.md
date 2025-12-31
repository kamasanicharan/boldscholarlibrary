# Fix AI Insight Not Working

## 🔴 Common Issues

### Issue 1: Dev Server Not Restarted
**Most Common!** Vite only loads `.env.local` when the server starts.

**Solution:**
1. Stop dev server: Press `Ctrl + C` in terminal
2. Start again: `npm run dev`
3. Wait for it to fully start
4. Try AI Insight again

---

### Issue 2: Environment Variable Not Loading

**Check:**
1. `.env.local` file exists in project root
2. File contains: `GEMINI_API_KEY=AIzaSyCtzrSJs0VGyNZ6KDpU78sghHoLx5C8ogU`
3. No extra spaces or quotes around the value
4. File is in the same directory as `package.json`

**Solution:**
- I've updated the code to try multiple ways to access the API key
- Restart dev server after any changes

---

### Issue 3: API Key Invalid

**Check:**
- Go to: https://aistudio.google.com/apikey
- Verify your API key is active
- Make sure it's the correct key

---

## ✅ What I Just Fixed

1. **Better Error Handling**
   - Now tries multiple ways to get the API key
   - Shows clearer error messages
   - Logs what it's checking

2. **Improved Vite Config**
   - Added `import.meta.env.VITE_GEMINI_API_KEY` support
   - Multiple fallbacks for API key access

---

## 🚀 Quick Fix Steps

1. **Verify .env.local exists:**
   ```bash
   type .env.local
   ```
   Should show: `GEMINI_API_KEY=AIzaSyCtzrSJs0VGyNZ6KDpU78sghHoLx5C8ogU`

2. **Restart Dev Server:**
   ```bash
   # Stop (Ctrl+C)
   npm run dev
   ```

3. **Test:**
   - Click "AI INSIGHT" on a file
   - Check browser console (F12) for any errors
   - Should work now!

---

## 🔍 Debug Steps

If still not working:

1. **Open Browser Console** (F12)
2. **Click "AI INSIGHT"**
3. **Check Console Tab** for errors
4. **Look for:**
   - "GEMINI_API_KEY not found" - means env var not loaded
   - "Invalid API key" - means key is wrong
   - Network errors - means API call failed

---

## 📝 Current Status

- ✅ `.env.local` file exists with correct key
- ✅ Code updated to try multiple env var access methods
- ⚠️ **You need to restart dev server** for changes to take effect

---

**Restart your dev server and it should work!** 🚀

