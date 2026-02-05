/sky-docs-monorepo
├── /apps
│   ├── /web-client            # (React + Vite) The main dashboard & editor
│   │   ├── /src
│   │   │   ├── /components    # Shared UI (Buttons, Modals)
│   │   │   ├── /editor        # The complex Video/Text editor logic
│   │   │   ├── /dashboard     # Project list, Folder management
│   │   │   └── /hooks         # React Query & WebSocket hooks
│   │
│   ├── /api-server            # (Node.js + Express) The Control Plane
│   │   ├── /src
│   │   │   ├── /controllers   # Request handlers
│   │   │   ├── /services      # Business logic (Project mgmt, Billing)
│   │   │   ├── /models        # Sequelize Definitions
│   │   │   └── /routes        # API Endpoints
│   │
│   ├── /ai-audio-service      # (Python + FastAPI) Whisper, Overdub, Cleanup
│   ├── /ai-video-service      # (Python + FastAPI) FFmpeg, Smart Zoom
│   └── /ai-text-service       # (Python + FastAPI) LLM Summaries, Docs Gen
│
├── /packages                  # Shared code between apps
│   ├── /db-config             # Shared Sequelize config & Migrations
│   └── /shared-types          # JSON interfaces (User, Project, Transcript)
│
├── /infra                     # DevOps
│   ├── /docker                # Dockerfiles for each service
│   └── /k8s                   # Kubernetes manifests (future)
│
└── /docs                      # Architecture diagrams & API specs