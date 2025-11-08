# 🚀 Render Deployment Guide

This guide walks you through deploying your eShop MERN application to Render.

## 📋 Prerequisites

- GitHub repository: `https://github.com/AmolChinchole/eShop.git` ✅
- MongoDB Atlas connection string
- Render account (free tier works)
- Stripe API key (if using payments)

---

## 🗂️ Deployment Overview

You'll deploy **two services**:
1. **Backend** (Node.js Web Service) - API server
2. **Frontend** (Static Site) - React app

---

## 📦 Step 1: Deploy Backend (API Server)

### 1.1 Create Web Service on Render

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub account if not already connected
4. Select repository: `AmolChinchole/eShop`

### 1.2 Configure Backend Service

**Build & Deploy Settings:**
- **Name:** `cherish-backend` (or your preferred name)
- **Region:** Choose closest to your users
- **Branch:** `main`
- **Root Directory:** `backend`
- **Runtime:** `Node`
- **Build Command:** `npm install`
- **Start Command:** `npm start`
- **Plan:** `Free`

### 1.3 Environment Variables

Click **"Advanced"** → **"Add Environment Variable"** and add these:

| Key | Value | Notes |
|-----|-------|-------|
| `MONGO_URI` | `mongodb+srv://username:password@cluster.mongodb.net/dbname?retryWrites=true&w=majority` | From MongoDB Atlas |
| `JWT_SECRET` | `your_strong_random_secret_here` | Generate a secure random string |
| `STRIPE_SECRET_KEY` | `sk_test_...` or `sk_live_...` | Optional: Only if using Stripe payments |
| `NODE_ENV` | `production` | Optional but recommended |

**Important:** 
- Replace `username`, `password`, `cluster`, and `dbname` in `MONGO_URI` with your actual MongoDB Atlas credentials
- Generate a strong JWT_SECRET (e.g., use: `openssl rand -base64 32` in terminal)

### 1.4 Deploy Backend

1. Click **"Create Web Service"**
2. Wait for build to complete (2-5 minutes)
3. Once deployed, you'll see: **Your service is live 🎉**
4. Copy your backend URL: `https://cherish-backend.onrender.com` (or similar)

### 1.5 Test Backend

Open these URLs in your browser:

- **Health Check:** `https://cherish-backend.onrender.com/health`
  - Should return: `{"status":"ok","uptime":123}`
  
- **Products API:** `https://cherish-backend.onrender.com/api/products`
  - Should return JSON with products array

✅ If both work, backend is ready!

---

## 🎨 Step 2: Deploy Frontend (React App)

### 2.1 Create Static Site on Render

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click **"New +"** → **"Static Site"**
3. Select repository: `AmolChinchole/eShop`

### 2.2 Configure Frontend Service

**Build & Deploy Settings:**
- **Name:** `cherish-frontend` (or your preferred name)
- **Branch:** `main`
- **Root Directory:** `my-app`
- **Build Command:** `npm install && npm run build`
- **Publish Directory:** `dist`

### 2.3 Environment Variables

Click **"Advanced"** → **"Add Environment Variable"**:

| Key | Value | Example |
|-----|-------|---------|
| `VITE_API_URL` | `https://YOUR_BACKEND_URL/api` | `https://cherish-backend.onrender.com/api` |

⚠️ **Critical:** Replace `YOUR_BACKEND_URL` with the actual backend URL from Step 1.4

### 2.4 Deploy Frontend

1. Click **"Create Static Site"**
2. Wait for build to complete (2-5 minutes)
3. Once deployed, you'll see your frontend URL: `https://cherish-frontend.onrender.com`

### 2.5 Test Frontend

1. Open your frontend URL in browser
2. Open browser DevTools (F12) → Console tab
3. Look for: `api baseURL -> https://cherish-backend.onrender.com/api`
4. Navigate to products page - products should load
5. Try adding to wishlist (after logging in)

✅ If products load and API calls work, frontend is ready!

---

## 🔧 Step 3: Configure CORS (If Needed)

If you see CORS errors in browser console, update `backend/server.js`:

```javascript
// Replace this line:
app.use(cors());

// With this:
app.use(cors({
  origin: [
    'https://cherish-frontend.onrender.com',
    'http://localhost:5173' // Keep for local development
  ],
  credentials: true
}));
```

Add environment variable to backend:
- **Key:** `FRONTEND_ORIGIN`
- **Value:** `https://cherish-frontend.onrender.com`

Then update code:
```javascript
app.use(cors({
  origin: process.env.FRONTEND_ORIGIN || '*',
  credentials: true
}));
```

**Redeploy backend** after making changes.

---

## 📝 Step 4: Add Product Images

Since you removed all images, you need to add them back in MongoDB Atlas:

### Option 1: Manual Update in MongoDB Atlas
1. Go to MongoDB Atlas → Browse Collections
2. Find `products` collection
3. Edit each product and add `images` array:
   ```json
   {
     "images": ["https://example.com/image.jpg"]
   }
   ```

### Option 2: Run Update Script
Create a script to bulk update (I can help with this if needed).

---

## 🐛 Troubleshooting

### Backend Issues

**Build fails:**
- Check logs in Render dashboard
- Verify `package.json` has all dependencies
- Check Node version (should be >=18)

**MongoDB connection fails:**
- Verify `MONGO_URI` is correct
- Check MongoDB Atlas allows connections from anywhere (0.0.0.0/0)
- Test connection locally first

**API returns 404:**
- Check `Root Directory` is set to `backend`
- Verify routes in `server.js`

### Frontend Issues

**Build fails:**
- Check `Root Directory` is set to `my-app`
- Verify `VITE_API_URL` is set
- Check build logs for missing dependencies

**API calls fail:**
- Check browser console for CORS errors
- Verify `VITE_API_URL` matches backend URL exactly (including `/api`)
- Check Network tab in DevTools for failing requests

**Images not loading:**
- Add images to MongoDB as described in Step 4
- Check browser console for image load errors
- Verify image URLs are accessible

---

## 🔄 Updating Your App

### After Code Changes:

1. Commit and push to GitHub:
   ```bash
   git add .
   git commit -m "Update message"
   git push origin main
   ```

2. Render auto-deploys if you enabled **"Auto Deploy"**
   - Otherwise, click **"Manual Deploy"** → **"Deploy latest commit"**

### After Environment Variable Changes:

1. Update variables in Render dashboard
2. Click **"Manual Deploy"** to trigger rebuild

---

## 📊 Monitoring

### Health Checks
Configure in Render dashboard → Settings → Health Check Path:
- **Path:** `/health`
- **Every:** `30 seconds`

### Logs
View real-time logs in Render dashboard → Logs tab

---

## 💰 Free Tier Limits

Render free tier includes:
- 750 hours/month of running time
- Services **sleep after 15 minutes** of inactivity
- First request after sleep takes ~30 seconds to wake up

**Note:** If your app sleeps, the first user visit will be slower.

---

## 🎉 Success Checklist

- [ ] Backend deployed and `/health` endpoint works
- [ ] Backend `/api/products` returns data
- [ ] Frontend deployed and loads in browser
- [ ] Frontend console shows correct API URL
- [ ] Products display on home page
- [ ] Can register/login
- [ ] Wishlist functionality works
- [ ] Cart functionality works
- [ ] Images display (after adding to MongoDB)

---

## 🆘 Need Help?

Common issues:
1. **"Service unavailable"** → Backend sleeping (free tier), wait 30 seconds
2. **CORS errors** → Follow Step 3 to configure CORS
3. **No products** → Add images to MongoDB (Step 4)
4. **Login fails** → Check JWT_SECRET is set in backend

---

## 📚 Additional Resources

- [Render Documentation](https://render.com/docs)
- [MongoDB Atlas Setup](https://www.mongodb.com/docs/atlas/)
- [Vite Environment Variables](https://vitejs.dev/guide/env-and-mode.html)

---

**Good luck with your deployment! 🚀**
