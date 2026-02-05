# Trace ✨

A production-ready, node-based AI workflow platform that lets you create stunning visuals by connecting nodes on an infinite canvas. Built with Next.js, React Flow, and powered by generative AI.

**"Connect Nodes. Generate Magic."**

---

## ✨ Features

### 🎯 Core Capabilities
- 🎨 **Node-Based Editor**: Drag-and-drop visual workflow builder with infinite canvas
- 🖼️ **AI Image Generation**: Generate images with Google AI (Gemini) and other providers
- 🎬 **Media Processing**: Handle images and videos with Transloadit integration
- 🔗 **Visual Pipelines**: Connect nodes to build complex AI workflows
- ⚡ **Real-Time Preview**: See results instantly as you build
- 🔄 **Background Jobs**: Powered by Trigger.dev for async processing

### 🛡️ Production Features
- ✅ **Next.js 16**: Server-side rendering and app router
- ✅ **React Flow Integration**: Industry-standard node editor with smooth pan/zoom
- ✅ **Clerk Authentication**: Secure user authentication and session management
- ✅ **Prisma ORM**: Type-safe database access with PostgreSQL
- ✅ **Trigger.dev**: Background job processing and workflow orchestration
- ✅ **Transloadit**: Professional media processing and optimization
- ✅ **Google AI (Gemini)**: Cutting-edge AI capabilities
- ✅ **Dark Theme**: Beautiful, modern dark UI (Noir/Samba themes)
- ✅ **Responsive Design**: Works on desktop, tablets, and mobile
- ✅ **Vercel Ready**: Optimized for serverless deployment

---

## 📋 Table of Contents
- [Architecture](#-architecture)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Quick Start](#-quick-start)
- [Configuration](#-configuration)
- [Deployment](#-deployment)
- [Project Structure](#-project-structure)
- [API Documentation](#-api-documentation)
- [Troubleshooting](#-troubleshooting)
- [Contributing](#-contributing)

---

## 🏗️ Architecture

Trace follows a modern Next.js architecture with integrated services:

### Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | Next.js 16 + React | Server-side rendering, App Router |
| **UI Library** | React Flow + shadcn/ui | Node-based canvas editor |
| **Styling** | Tailwind CSS + Framer Motion | Beautiful, animated UI |
| **Authentication** | Clerk | User auth, sessions, org management |
| **Database** | PostgreSQL + Prisma | Type-safe data persistence |
| **Media Processing** | Transloadit | Image/video optimization |
| **AI Services** | Google AI (Gemini) | Text generation, AI features |
| **Background Jobs** | Trigger.dev | Async workflow processing |
| **Deployment** | Vercel | Serverless hosting, edge functions |

### Architecture Diagram

```mermaid
graph TB
    subgraph Client["Client (Browser)"]
        A[Next.js App]
        B[React Flow Canvas]
    end
    
    subgraph Backend["Backend (Vercel)"]
        C[API Routes]
        D[Server Actions]
        E[Middleware]
    end
    
    subgraph Services["External Services"]
        F[Clerk Auth]
        G[Neon PostgreSQL]
        H[Google AI]
        I[Transloadit]
        J[Trigger.dev]
    end
    
    A --> C
    A --> D
    A --> E
    E --> F
    C --> G
    D --> H
    C --> I
    C --> J
```

---

## 📦 Prerequisites

### Required Software

**Node.js 20+**
```bash
node --version  # Should be 20.x or higher
npm --version   # Should be 9.x or higher
```

**PostgreSQL 14+** (or use Neon serverless)
```bash
# Option 1: Local PostgreSQL
# Windows: Download from https://www.postgresql.org/download/windows/
# Linux: sudo apt-get install postgresql
# Mac: brew install postgresql

# Option 2: Neon (Recommended for production)
# Sign up at https://neon.tech
```

### Required API Keys

You'll need accounts and API keys for:

1. **Clerk** - Authentication ([Get started](https://clerk.com))
2. **Neon or PostgreSQL** - Database ([Sign up](https://neon.tech))
3. **Google AI** - Gemini API ([Get key](https://ai.google.dev))
4. **Transloadit** - Media processing ([Sign up](https://transloadit.com))
5. **Trigger.dev** - Background jobs ([Get started](https://trigger.dev))

---

## 🚀 Installation

### 1. Clone the Repository
```bash
git clone https://github.com/ShreyasUrade1123/Trace.git
cd Trace/frontend/client
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Database Setup

Create a PostgreSQL database (or use Neon):

```sql
-- If using local PostgreSQL:
CREATE DATABASE trace_db;
```

Run Prisma migrations:

```bash
npx prisma generate
npx prisma db push
```

### 4. Configure Environment

Create `.env` file in the `client` directory:

```env
# Database
DATABASE_URL="postgresql://user:password@host:5432/trace_db?sslmode=require"

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_..."
CLERK_SECRET_KEY="sk_test_..."
NEXT_PUBLIC_CLERK_SIGN_IN_URL="/sign-in"
NEXT_PUBLIC_CLERK_SIGN_UP_URL="/sign-up"
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL="/dashboard"
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL="/dashboard"
NEXT_PUBLIC_CLERK_AFTER_SIGN_OUT_URL="/"

# Google AI
GOOGLE_AI_API_KEY="AIzaSy..."

# Transloadit
NEXT_PUBLIC_TRANSLOADIT_AUTH_KEY="..."
TRANSLOADIT_AUTH_SECRET="..."

# Trigger.dev
TRIGGER_SECRET_KEY="tr_dev_..."
TRIGGER_API_KEY="tr_dev_..."
```

See `.env.example` for a complete template.

---

## ⚡ Quick Start

### Development Mode

```bash
cd frontend/client
npm run dev
```

✅ App running on http://localhost:5173

### Build for Production

```bash
npm run build
npm start
```

### Access the App

1. Open http://localhost:5173
2. Click "Sign Up" to create an account
3. Start building workflows!

---

## ⚙️ Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | PostgreSQL connection string | ✅ |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk public key | ✅ |
| `CLERK_SECRET_KEY` | Clerk secret key | ✅ |
| `GOOGLE_AI_API_KEY` | Google AI API key | ✅ |
| `NEXT_PUBLIC_TRANSLOADIT_AUTH_KEY` | Transloadit auth key | ✅ |
| `TRANSLOADIT_AUTH_SECRET` | Transloadit secret | ✅ |
| `TRIGGER_SECRET_KEY` | Trigger.dev secret | ✅ |
| `TRIGGER_API_KEY` | Trigger.dev API key | ✅ |

### Prisma Configuration

The database schema is defined in `prisma/schema.prisma`. After making changes:

```bash
npx prisma generate    # Generate Prisma Client
npx prisma db push     # Push schema changes
npx prisma studio      # Open visual database editor
```

---

## 🚀 Deployment

### Deploy to Vercel (Recommended)

Trace is optimized for Vercel deployment. See [DEPLOYMENT.md](../DEPLOYMENT.md) for detailed instructions.

**Quick Deploy:**

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import your GitHub repository
3. Set **Root Directory** to `frontend/client`
4. Add all environment variables
5. Deploy!

**Configuration:**

Your `vercel.json` is already configured:
```json
{
  "buildCommand": "npx prisma generate && npm run build",
  "installCommand": "npm install",
  "framework": "nextjs",
  "outputDirectory": ".next"
}
```

### Environment Variables on Vercel

Add all environment variables from your `.env` file to Vercel:

1. Project Settings → Environment Variables
2. Add each variable for Production, Preview, and Development
3. Redeploy

### Post-Deployment

1. **Update Clerk URLs**: Add your Vercel domain to Clerk's allowed domains
2. **Configure Webhooks**: Set up Trigger.dev webhooks if needed
3. **Test thoroughly**: Sign up, create workflows, test all features

---

## 📁 Project Structure

```
frontend/client/
├── prisma/
│   └── schema.prisma           # Database schema
├── public/                     # Static assets
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (auth)/            # Auth routes (sign-in, sign-up)
│   │   ├── api/               # API routes
│   │   ├── dashboard/         # Dashboard page
│   │   ├── workflows/         # Workflow editor
│   │   └── page.tsx           # Homepage
│   ├── components/
│   │   ├── ui/                # shadcn/ui components
│   │   ├── workflow/          # Workflow canvas components
│   │   ├── ErrorBoundary.tsx
│   │   └── Sidebar.tsx
│   ├── sections/              # Landing page sections
│   │   ├── Hero.tsx
│   │   ├── Features.tsx
│   │   ├── Working.tsx
│   │   └── Footer.tsx
│   ├── lib/                   # Utilities
│   └── styles/                # Global styles
├── .env                       # Environment variables (DO NOT COMMIT)
├── .env.example              # Template for env vars
├── next.config.mjs           # Next.js configuration
├── tailwind.config.ts        # Tailwind CSS config
├── tsconfig.json             # TypeScript config
└── package.json              # Dependencies
```

---

## 📡 API Documentation

### API Routes

Located in `src/app/api/`:

```
/api/workflows              # Workflow CRUD operations
/api/workflows/[id]         # Get/update specific workflow
/api/workflows/[id]/runs    # Workflow execution history
/api/workflows/execute      # Execute a workflow
/api/process                # Process media files
/api/trigger                # Trigger.dev webhooks
/api/upload/params          # Get upload parameters
```

### Example: Create Workflow

```bash
curl -X POST https://your-app.vercel.app/api/workflows \
  -H "Authorization: Bearer YOUR_CLERK_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "My Workflow",
    "nodes": [...],
    "edges": [...]
  }'
```

See [API.md](./API.md) for complete API documentation.

---

## 🔧 Troubleshooting

### Build Errors

**"Prisma Client not found"**
```bash
npx prisma generate
npm run build
```

**TypeScript errors**
```bash
npm run build
# Check the error output and fix type issues
```

### Database Issues

**"Can't reach database server"**
- Check `DATABASE_URL` is correct
- Ensure database is running (or Neon is accessible)
- Verify SSL mode: add `?sslmode=require` for Neon

**Migration errors**
```bash
npx prisma db push --force-reset  # ⚠️ Resets database!
```

### Authentication Issues

**Clerk not working**
- Verify Clerk keys are correct
- Check Clerk dashboard has your domain added
- Ensure middleware is running

### Deployment Issues

**Build fails on Vercel**
- Check build logs for specific errors
- Verify all environment variables are set
- Ensure root directory is `frontend/client`

**App works locally but not on Vercel**
- Check environment variables (especially PUBLIC_ prefixed ones)
- Verify database is accessible from Vercel
- Check function logs in Vercel dashboard

---

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/AmazingFeature`
3. Commit changes: `git commit -m 'Add AmazingFeature'`
4. Push branch: `git push origin feature/AmazingFeature`
5. Open Pull Request

---

## 📄 License

ISC License

---

## 🚦 Current Status

### ✅ Completed (Production Ready)
- ✅ Next.js 16 with App Router
- ✅ Clerk Authentication
- ✅ Prisma + PostgreSQL
- ✅ React Flow Canvas
- ✅ Workflow Management
- ✅ Dark Mode Themes
- ✅ Vercel Deployment Configuration
- ✅ TypeScript Support
- ✅ Responsive Design

### 🔄 In Progress
- React Flow Node Library
- AI Integration (Gemini)
- Media Processing Pipeline
- Trigger.dev Background Jobs

### 📋 Planned
- Workflow Templates
- Collaboration Features
- Real-time Collaboration
- Usage Analytics
- API Documentation Site

---

## 📞 Support

- 📧 **Email**: shreyasurade4940@gmail.com
- 🐛 **Issues**: [GitHub Issues](https://github.com/ShreyasUrade1123/Trace/issues)
- 📚 **Documentation**: [Deployment Guide](../DEPLOYMENT.md)

---

## 🔗 Quick Links

- **Live Demo**: [Coming Soon]
- **GitHub**: [github.com/ShreyasUrade1123/Trace](https://github.com/ShreyasUrade1123/Trace)
- **Deployment Guide**: [DEPLOYMENT.md](../DEPLOYMENT.md)
- **API Docs**: [API.md](./API.md)

---

<p align="center">
  <strong>Trace</strong> - Connect Nodes. Generate Magic.<br/>
  Made with ❤️ by Shreyas Urade
</p>
