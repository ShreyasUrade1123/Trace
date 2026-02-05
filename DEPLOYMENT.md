# 🚀 Deploying Trace to Vercel

This guide will walk you through deploying your Trace workflow application to Vercel.

## 📋 Prerequisites

Before deploying, ensure you have:

- ✅ A [Vercel](https://vercel.com) account
- ✅ A [PostgreSQL database](https://neon.tech) (Neon, Railway, Supabase, etc.)
- ✅ [Clerk](https://clerk.com) authentication account
- ✅ [Google AI](https://makersuite.google.com/app/apikey) API key
- ✅ [Transloadit](https://transloadit.com) account
- ✅ [Trigger.dev](https://cloud.trigger.dev) account
- ✅ [Git](https://git-scm.com/) installed locally
- ✅ GitHub repository created and pushed

---

## 🔐 Step 1: Prepare Environment Variables

### 1.1 Create Production API Keys

**⚠️ SECURITY WARNING**: Your current `.env` file contains production keys. **DO NOT** commit this file to Git!

Rotate all API keys for security:

1. **Clerk** - Generate new keys at [dashboard.clerk.com](https://dashboard.clerk.com)
2. **Google AI** - Create new key at [makersuite.google.com](https://makersuite.google.com/app/apikey)
3. **Transloadit** - Regenerate at [transloadit.com/c/template-credentials](https://transloadit.com/c/template-credentials)
4. **Trigger.dev** - Create new at [cloud.trigger.dev](https://cloud.trigger.dev)

### 1.2 Prepare Your Environment Variables

Copy the values from `.env.example` - you'll need these for Vercel:

```bash
# Located in: frontend/client/.env.example
DATABASE_URL
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
CLERK_SECRET_KEY
GOOGLE_AI_API_KEY
NEXT_PUBLIC_TRANSLOADIT_AUTH_KEY
TRANSLOADIT_AUTH_SECRET
TRIGGER_SECRET_KEY
TRIGGER_API_KEY
```

---

## 🗄️ Step 2: Setup PostgreSQL Database

### 2.1 Create Production Database

Using **Neon** (recommended):
1. Go to [neon.tech](https://neon.tech)
2. Create a new project
3. Copy the connection string

Using **Railway**:
1. Go to [railway.app](https://railway.app)
2. Create new PostgreSQL database
3. Copy the connection string

### 2.2 Apply Database Schema

Run migrations locally to set up your production database:

```bash
cd frontend/client

# Set your production database URL temporarily
$env:DATABASE_URL="your-production-database-url"

# Apply the schema
npx prisma db push

# Or use migrations (recommended for production)
npx prisma migrate deploy
```

---

## 📦 Step 3: Push to GitHub

Ensure your latest code is pushed:

```bash
cd "c:\Users\SHREYAS URADE\Desktop\Project Folder\Trace-Test\frontend"

# Check git status
git status

# Add changes
git add .

# Commit
git commit -m "Configure for Vercel deployment"

# Push to GitHub
git push origin main
```

---

## 🌐 Step 4: Deploy to Vercel

### 4.1 Import Project

1. Go to [vercel.com/new](https://vercel.com/new)
2. Click **"Import Git Repository"**
3. Select your **GitHub repository** (e.g., `ShreyasUrade1123/Trace`)
4. Click **"Import"**

### 4.2 Configure Project Settings

Vercel will auto-detect your `vercel.json` configuration.

**Verify these settings:**

| Setting | Value |
|---------|-------|
| **Framework Preset** | Next.js |
| **Root Directory** | `frontend/client` or use build command from vercel.json |
| **Build Command** | `cd client && npx prisma generate && npm run build` |
| **Output Directory** | `client/.next` |
| **Install Command** | `cd client && npm install` |

### 4.3 Add Environment Variables

In the Vercel deployment settings, add these environment variables:

Click **"Environment Variables"** and add each one:

```bash
DATABASE_URL = postgresql://...your-neon-url...
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY = pk_live_...
CLERK_SECRET_KEY = sk_live_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL = /sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL = /sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL = /dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL = /dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_OUT_URL = /
GOOGLE_AI_API_KEY = AIzaSy...
NEXT_PUBLIC_TRANSLOADIT_AUTH_KEY = ...
TRANSLOADIT_AUTH_SECRET = ...
TRIGGER_SECRET_KEY = tr_prod_...
TRIGGER_API_KEY = tr_prod_...
```

**💡 Tip**: Add them to **Production**, **Preview**, and **Development** environments.

### 4.4 Deploy

1. Click **"Deploy"**
2. Wait 2-3 minutes for the build to complete
3. Vercel will provide you with a deployment URL (e.g., `https://trace-xyz.vercel.app`)

---

## ✅ Step 5: Post-Deployment Verification

### 5.1 Test Your Deployment

Visit your deployed URL and verify:

1. ✅ **Homepage loads** without errors
2. ✅ **Sign Up flow** works (create test account)
3. ✅ **Sign In flow** works
4. ✅ **Dashboard** loads with authenticated user
5. ✅ **Create workflow** (test database connectivity)
6. ✅ **Upload assets** (test Transloadit integration)
7. ✅ **Execute workflow** (test Trigger.dev)

### 5.2 Check Deployment Logs

If something fails:

1. Go to Vercel dashboard → Your project
2. Click on the deployment
3. Click **"View Function Logs"** or **"Build Logs"**
4. Look for error messages

### 5.3 Configure Custom Domain (Optional)

1. In Vercel dashboard, go to **Settings** → **Domains**
2. Add your custom domain (e.g., `trace.yourdomain.com`)
3. Follow DNS configuration instructions

---

## 🔧 Troubleshooting

### Build Fails with "Cannot find module '@prisma/client'"

**Solution**: Ensure `postinstall` script is in `package.json`:
```json
"scripts": {
  "postinstall": "prisma generate"
}
```

### Database Connection Fails

**Solution**: 
- Check `DATABASE_URL` is correct in Vercel environment variables
- Ensure SSL mode is set: `?sslmode=require`
- Verify database is accessible from internet (not localhost)

### Clerk Authentication Not Working

**Solution**:
- Verify all Clerk URLs in environment variables
- Add your Vercel domain to Clerk dashboard's allowed origins
- Go to Clerk Dashboard → Your App → **Settings** → **Domains**
- Add your Vercel URL (e.g., `trace-xyz.vercel.app`)

### TypeScript Build Errors

**Solution**: We removed `ignoreBuildErrors` for production. Fix TypeScript errors:
```bash
cd frontend/client
npm run build
```

### Image Upload/Processing Fails

**Solution**:
- Verify Transloadit credentials are correct
- Check Transloadit dashboard for API usage/errors
- Ensure `NEXT_PUBLIC_TRANSLOADIT_AUTH_KEY` has `NEXT_PUBLIC_` prefix

---

## 🔄 Redeploying After Changes

Vercel automatically redeploys when you push to GitHub:

```bash
# Make your changes
git add .
git commit -m "Your change description"
git push origin main

# Vercel will auto-deploy in ~2 minutes
```

---

## 📊 Monitoring Your Application

### Vercel Analytics
- Go to your project → **Analytics** tab
- View page views, performance metrics

### Vercel Logs
- Go to your project → **Logs** tab
- Real-time function execution logs

### Database Monitoring
- Check your Neon/Railway dashboard for query performance

---

## 🎉 Congratulations!

Your Trace application is now live on Vercel! 🚀

**Next Steps:**
- Share your deployment URL
- Set up custom domain
- Configure monitoring alerts
- Set up CI/CD pipeline for tests

**Deployment URL Structure:**
- Production: `https://your-project.vercel.app`
- Preview (PRs): `https://your-project-git-branch.vercel.app`

Need help? Check [Vercel Documentation](https://vercel.com/docs) or [Next.js Deployment Guide](https://nextjs.org/docs/deployment).
