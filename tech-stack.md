# Tech Stack & Architecture Standards

## 1. Frontend (The Interface)
* **Framework:** React 18 (Vite Build Tool)
* **Language:** JavaScript (ES6+)
* **Styling:** Tailwind CSS (Utility-first) + Framer Motion (Animations)
* **State Management:**
    * **Zustand:** For complex local state (Video Player current time, cursor position).
    * **React Query:** For server state (fetching project lists, user profile).
* **Editor Core:** Tiptap (Headless wrapper for ProseMirror) - Crucial for the text-based video editing.
* **Video Player:** Remotion Player (or raw HTML5 Video API controlled by React).

## 2. Backend API (The Orchestrator)
* **Runtime:** Node.js
* **Framework:** Express.js (Robust, standard)
* **Database ORM:** **Sequelize** (SQL ORM for Node.js)
* **Validation:** Joi or Zod
* **Real-time:** Socket.io (For collaboration cursor sync and processing updates)

## 3. Data Layer (Persistence)
* **Primary Database:** PostgreSQL
    * *Why?* Relational integrity for Users, Organizations, and Projects is critical.
* **Job Queue:** Redis (using BullMQ)
    * *Why?* Video processing takes time. The API pushes a job to Redis; Python workers pick it up.
* **Object Storage:** AWS S3 (or compatible like MinIO for local dev)
    * *Why?* Storing raw video files and generated assets.

## 4. AI & Compute Layer (The Factory)
* **Language:** Python 3.11+
* **API Framework:** FastAPI (High performance, async)
* **Video Processing:** FFmpeg (The industry standard CLI tool)
* **Audio Processing:**
    * **Whisper (OpenAI):** For high-accuracy STT.
    * **PyDub:** For basic audio manipulation.
* **LLM Integration:** LangChain (connecting to GPT-4o or local Llama models).

## 5. Development Tools
* **Package Manager:** npm / yarn workspaces
* **Linting:** ESLint + Prettier
* **Version Control:** Git