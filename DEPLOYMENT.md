# 🚀 FlipLink Deployment Guide - Railway Edition

FlipLink is optimized for Railway deployment with simple Node.js!

## Deploy to Railway (Recommended)

Railway is perfect for this Node.js app - it auto-detects everything!

### Steps:

1. **Push to GitHub** (if not done already):
   ```bash
   git add .
   git commit -m "Ready for Railway deployment"
   git push origin main
   ```

2. **Connect to Railway**:
   - Go to [railway.app](https://railway.app)
   - Sign up/login with GitHub
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Connect your FlipLink repository

3. **Railway Auto-Configuration**:
   - Railway detects Node.js automatically
   - Build Command: `npm run build` (auto-detected)
   - Start Command: `npm start` (auto-detected)
   - Port: Auto-assigned

4. **Deploy**:
   - Railway starts building immediately
   - Wait 2-3 minutes for build + deploy
   - Your app will be live at `https://your-app.up.railway.app`

### Railway Advantages:
- ✅ Zero configuration needed
- ✅ Auto-detects Node.js
- ✅ Persistent storage
- ✅ Custom domains
- ✅ SSL certificates
- ✅ Environment variables
- ✅ GitHub integration

---

## Local Testing:

```bash
# Build the React app
npm run build

# Start the server
npm start

# Or run in development mode (separate terminals)
npm run dev
```

## Troubleshooting Railway:

**Build taking too long?**
- Railway should auto-detect Node.js and use simple commands
- Build: `npm run build`
- Start: `npm start`

**Build failing?**
- Check Railway logs for specific errors
- Make sure Node.js version is 18+ (Railway default)
- Verify all dependencies are in package.json

**App not starting?**
- Railway auto-assigns PORT environment variable
- Server listens on `process.env.PORT || 5555`

## Manual Railway Configuration (if needed):

If Railway doesn't auto-detect properly:

1. **Build Command**: `npm run build`
2. **Start Command**: `npm start`
3. **Root Directory**: `/` (project root)
4. **Environment**: Node.js

Your FlipLink will be live in minutes! 🎉

---

## 📝 Post-Deployment

After deployment:

1. **Test the app**: Create a few FlipLinks and test the 50/50 functionality
2. **Check stats**: Verify the statistics are working
3. **Share**: Send your FlipLink URL to friends (prepare for chaos!)
4. **Monitor**: Check logs for any issues

## 🔧 Troubleshooting

**Build fails?**
- Check Node.js version (use 18+)
- Verify all dependencies are in package.json
- Check build logs for specific errors

**App crashes?**
- Check start command is `npm start`
- Verify PORT environment variable
- Check server logs

**Links not working?**
- Verify API routes are accessible
- Check CORS settings
- Test redirect functionality

---

## 🎪 Ready to Rickroll the World!

Once deployed, your FlipLink is ready to surprise people! Share responsibly (or don't) 😈

Remember: With great power comes great... chaos! 🎲