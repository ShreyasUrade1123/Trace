# Trace ✨

A production-ready, node-based AI workflow platform that lets you create stunning visuals by connecting nodes on an infinite canvas. Built with React Flow and powered by generative AI.

**"Connect Nodes. Generate Magic."**

---

## ✨ Features

### 🎯 Core Capabilities
- 🎨 **Node-Based Editor**: Drag-and-drop visual workflow builder with infinite canvas
- 🖼️ **AI Image Generation**: Generate images with Flux, Stable Diffusion, and more
- 👕 **Product Mockups**: Realistically apply logos/graphics to products (shirts, mugs, etc.)
- 🔗 **Visual Pipelines**: Connect nodes to build complex AI workflows
- ⚡ **Real-Time Preview**: See results instantly as you build
- 🎬 **Video Documentation**: Convert screen recordings into polished articles (Legacy)

### 🛡️ Production Features
- ✅ **React Flow Integration**: Industry-standard node editor with smooth pan/zoom
- ✅ **Microservices Architecture**: Scalable Node.js + Python services
- ✅ **AI API Integration**: Fal.ai, Replicate, and self-hosted ComfyUI support
- ✅ **JWT Authentication**: Secure user authentication
- ✅ **PostgreSQL Storage**: Persistent workflow and user data
- ✅ **Docker Ready**: Full containerization support
- ✅ **Dark Theme**: Beautiful, modern dark UI (Noir/Samba themes)
- ✅ **Responsive Design**: Works on desktop, tablets, and mobile

---

## 📋 Table of Contents
- [Architecture](#-architecture)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Quick Start](#-quick-start)
- [Node Types](#-node-types)
- [The Mockup Feature](#-the-mockup-feature)
- [Configuration](#-configuration)
- [API Documentation](#-api-documentation)
- [Troubleshooting](#-troubleshooting)
- [Project Structure](#-project-structure)
- [Deployment](#-deployment)
- [Contributing](#-contributing)

---

## 🏗️ Architecture

Trace follows a three-layer architecture:

### The Three Pillars

| Layer | Name | Technology | Responsibility |
|-------|------|------------|----------------|
| **UI** | The Canvas | React + React Flow | Visual node editor, user interaction |
| **Logic** | The Orchestrator | Node.js + Python | Graph interpretation, job queuing |
| **AI** | The Engine | Fal.ai / ComfyUI | Image generation, AI processing |

### Component Overview

| Service | Port | Tech Stack | Key Dependencies |
|---------|------|------------|------------------|
| **Frontend** | 5173 | React, Vite | @xyflow/react, Tailwind CSS, Zustand |
| **API Server** | 3000 | Node.js, Express | Sequelize, JWT, PostgreSQL |
| **AI Audio Service** | 8001 | Python, FastAPI | OpenAI Whisper, ElevenLabs |
| **AI Video Service** | 8002 | Python, FastAPI | FFmpeg, OpenCV |
| **AI Text Service** | 8003 | Python, FastAPI | LangChain, GPT-4o |

### Architecture Diagram

```mermaid
graph TB
    subgraph Frontend["The Canvas (Frontend)"]
        A[React Flow Editor :5173]
    end
    
    subgraph Backend["The Orchestrator (Backend)"]
        B[API Server :3000]
        C[PostgreSQL]
        D[Redis Queue]
    end
    
    subgraph AI["The Engine (AI)"]
        E[Fal.ai API]
        F[AI Audio :8001]
        G[AI Video :8002]
        H[AI Text :8003]
    end
    
    A --> B
    B --> C
    B --> D
    D --> E
    B --> F
    B --> G
    B --> H
```

---

## 📦 Prerequisites

### Required Software

**Node.js 20+**
```bash
node --version  # Should be 20.x or higher
npm --version   # Should be 9.x or higher
```

**Python 3.11+** (for AI services)
```bash
python --version  # Should be 3.11 or higher
pip --version
```

**PostgreSQL 14+**
```bash
# Windows: Download from https://www.postgresql.org/download/windows/
# Linux: sudo apt-get install postgresql
# Mac: brew install postgresql
```

**Docker** (Optional, for containerized setup)
```bash
docker --version
docker-compose --version
```

### API Keys (for AI features)
- **Fal.ai API Key**: [Get one here](https://fal.ai/)
- **OpenAI API Key**: For Whisper transcription
- **ElevenLabs API Key**: For voice generation (optional)

---

## 🚀 Installation

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/trace.git
cd Skydocs
```

### 2. Install Dependencies

```bash
# Frontend
cd client
npm install
cd ..

# API Server
cd server
npm install
cd ..

# AI Services (Optional)
cd ai-audio-service && pip install -r requirements.txt && cd ..
cd ai-video-service && pip install -r requirements.txt && cd ..
cd ai-text-service && pip install -r requirements.txt && cd ..
```

### 3. Database Setup

```sql
CREATE DATABASE trace_db;
```

```bash
cd server
npx sequelize-cli db:migrate
```

### 4. Configure Environment

**server/.env:**
```env
PORT=3000
DATABASE_URL=postgres://root:yourpassword@localhost:5432/trace_db
JWT_SECRET=your_jwt_secret_key_here
FAL_API_KEY=your_fal_ai_key
NODE_ENV=development
```

**client/.env:**
```env
VITE_API_URL=http://localhost:3000
```

---

## ⚡ Quick Start

### Start All Services

**Terminal 1 - API Server:**
```bash
cd server
npm run dev
```
✅ Server running on http://localhost:3000

**Terminal 2 - Frontend:**
```bash
cd client
npm run dev
```
✅ App running on http://localhost:5173

### Using Docker
```bash
cd infra/docker
docker-compose up -d
```

### Access the App
Open http://localhost:5173 in your browser.

---

## 🧩 Node Types

Trace provides a library of nodes you can connect to build AI workflows:

### Input Nodes
| Node | Description | Output |
|------|-------------|--------|
| **Image Upload** | Upload images with preview | Image data |
| **Prompt** | Text input for AI prompts | Text string |
| **Video Upload** | Upload video files | Video data |
| **Color Picker** | Select colors | Color value |
| **Number Slider** | Numeric input | Number |

### Processing Nodes
| Node | Description | Inputs → Output |
|------|-------------|-----------------|
| **Flux Generator** | AI image generation | Image + Prompt → Image |
| **Image-to-Image** | Transform images | Image + Prompt → Image |
| **ControlNet** | Guided generation | Image + Control + Prompt → Image |
| **Inpainting** | Edit specific areas | Image + Mask + Prompt → Image |
| **Background Remover** | Remove backgrounds | Image → Image |
| **Upscaler** | Enhance resolution | Image → Image |

### Output Nodes
| Node | Description | Input |
|------|-------------|-------|
| **Preview** | Display results | Image |
| **Download** | Export to file | Image |
| **Gallery** | Compare outputs | Multiple Images |

---

## 👕 The Mockup Feature

The flagship feature of Trace: realistically apply graphics to products.

### How It Works

```mermaid
flowchart LR
    A[Product Photo] --> D[Flux + ControlNet]
    B[Logo/Graphic] --> D
    C[Prompt] --> D
    D --> E[AI Processing]
    E --> F[Realistic Mockup]
```

### The AI Pipeline

1. **Upload Product**: Photo of hoodie, t-shirt, mug, etc.
2. **Upload Graphic**: Your logo or design
3. **Write Prompt**: "Vintage distressed logo on black hoodie"
4. **AI Magic**:
   - Analyzes depth/folds of product
   - Calculates realistic lighting
   - Warps graphic to match surface
5. **Download**: High-res result

### Example Workflow

```javascript
// Connect these nodes in the canvas:
[Image: hoodie.jpg] ──┐
                       ├──► [Flux Generator] ──► [Preview]
[Image: logo.png]  ───┤
                       │
[Prompt: "Logo on hoodie"] ─┘
```

---

## ⚙️ Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `PORT` | Server port | ✅ |
| `DATABASE_URL` | PostgreSQL connection | ✅ |
| `JWT_SECRET` | Auth secret key | ✅ |
| `FAL_API_KEY` | Fal.ai API key | ✅ (for AI) |
| `OPENAI_API_KEY` | OpenAI API key | ❌ |
| `VITE_API_URL` | Backend URL for frontend | ✅ |

### Service Ports

| Service | Port |
|---------|------|
| Frontend | 5173 |
| API Server | 3000 |
| AI Audio | 8001 |
| AI Video | 8002 |
| AI Text | 8003 |
| PostgreSQL | 5432 |

---

## 📡 API Documentation

### Authentication
```http
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/me
```

### Workflows
```http
GET    /api/workflows         # List workflows
POST   /api/workflows         # Create workflow
GET    /api/workflows/:id     # Get workflow
PUT    /api/workflows/:id     # Update workflow
DELETE /api/workflows/:id     # Delete workflow
```

### AI Generation
```http
POST /api/generate            # Start generation job
GET  /api/generate/:id        # Check job status
```

### Example: Generate Image
```bash
curl -X POST http://localhost:3000/api/generate \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "flux",
    "inputs": {
      "image_url": "https://example.com/hoodie.jpg",
      "prompt": "Vintage logo on hoodie",
      "strength": 0.85
    }
  }'
```

---

## 🔧 Troubleshooting

### Canvas is laggy
- Reduce number of visible nodes
- Close browser dev tools
- Check for memory leaks in console

### AI generation fails
- Verify `FAL_API_KEY` is set correctly
- Check API quota/credits on Fal.ai dashboard
- Ensure image URLs are publicly accessible

### Database connection error
- Verify PostgreSQL is running
- Check `DATABASE_URL` format
- Run migrations: `npx sequelize-cli db:migrate`

### CORS errors
- Ensure `VITE_API_URL` matches server address
- Restart both frontend and backend

---

## 📁 Project Structure

```
Skydocs/
├── client/                     # React Frontend (The Canvas)
│   ├── src/
│   │   ├── components/
│   │   │   ├── nodes/          # Custom React Flow nodes
│   │   │   ├── canvas/         # Canvas components
│   │   │   ├── home/           # Landing page
│   │   │   └── ui/             # Shared UI components
│   │   ├── context/            # Auth, Theme contexts
│   │   ├── stores/             # Zustand stores
│   │   ├── pages/              # Route pages
│   │   └── App.jsx
│   ├── tailwind.config.js
│   └── vite.config.js
│
├── server/                     # Node.js API (The Orchestrator)
│   ├── src/
│   │   ├── controllers/        # Request handlers
│   │   ├── services/           # Business logic
│   │   ├── models/             # Sequelize models
│   │   ├── routes/             # API routes
│   │   └── index.js
│   └── package.json
│
├── ai-audio-service/           # Python AI (Whisper, TTS)
├── ai-video-service/           # Python AI (FFmpeg, OpenCV)
├── ai-text-service/            # Python AI (LLM, Docs)
│
├── packages/                   # Shared code
│   ├── db-config/
│   └── shared-types/
│
├── infra/                      # Docker & deployment
│   └── docker/
│
├── docs/                       # Documentation
├── prd.md                      # Product Requirements
└── vercel.json                 # Vercel config
```

---

## 🚀 Deployment

### Frontend (Vercel)
```bash
cd client
vercel
```

### Backend (Docker)
```bash
cd infra/docker
docker-compose up -d --build
```

### Backend (PM2)
```bash
npm install -g pm2
pm2 start server/src/index.js --name trace-api
```

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

## 🚦 Status

### ✅ Completed
- User Authentication (JWT)
- Project Management
- Frontend Dashboard & UI
- Dark Mode (Noir/Samba themes)
- Docker Containerization
- PostgreSQL Integration

### 🔄 In Progress
- React Flow Canvas Integration
- Custom Node Components
- Fal.ai API Integration
- Generation Pipeline

### 📋 Planned
- ControlNet Node
- Inpainting Node
- Workflow Sharing
- Usage Credits System
- Team Collaboration

---

## 📞 Support

- 📧 **Email**: shreyasurade4940@gmail.com
- 🐛 **Issues**: [GitHub Issues](https://github.com/yourusername/trace/issues)

---

<p align="center">
  <strong>Trace</strong> - Connect Nodes. Generate Magic.<br/>
  Made with ❤️ by Team Antigravity
</p>
