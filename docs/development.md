# Local Development Guide

This guide describes how to run, format, lint, and build the monorepo elements locally and inside containerized environments.

---

## Prerequisites

- **Node.js**: v22 or higher
- **Python**: v3.13 or higher (v3.11+ fallback supported locally)
- **Docker**: Desktop or Engine with Docker Compose

---

## 1. Quick Start (Docker Compose)

Spin up the entire stack (web client + backend API) instantly with health checks:

```bash
# Copy example environment variable template
cp .env.example .env

# Run services
docker-compose up --build
```

- **Frontend**: http://localhost:3000
- **FastAPI backend**: http://localhost:8000
- **Interactive Swagger Docs**: http://localhost:8000/docs
- **API Health Check**: http://localhost:8000/health

---

## 2. Local Node Workspace Development (`apps/web` & `packages/shared`)

### Dependency Setup
Install and link dependencies across all workspaces from the monorepo root:

```bash
npm install
```

### Build Shared Package
Next.js expects typescript types from `@saas/shared` to be compiled during initial setup:

```bash
npm run build:shared
```

### Start Frontend Server
Launch the Next.js development server:

```bash
npm run dev:web
```

### Format and Lint Check (JS/TS)
Validate visual code style and Next.js compliance:

```bash
# Run lint check
npm run lint:web

# Auto-format files
npm run format
```

---

## 3. Local Python Development (`apps/api`)

Navigate to backend directory:
```bash
cd apps/api
```

### Setup Virtual Environment
Create and launch virtual environment:

```bash
# Create
python -m venv .venv

# Activate (Windows)
.venv\Scripts\activate

# Activate (Mac/Linux)
source .venv/bin/activate
```

### Install Dependencies
```bash
pip install -r requirements.txt
```

### Run API Server
Start local server with hot reloading enabled:

```bash
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### Code Quality (Python)
Ruff, Black, and mypy are configured inside `pyproject.toml`. Run checks from the backend folder:

```bash
# Run Ruff lint check
ruff check .

# Run Black code style formatter
black --check .

# Auto-format and fix python code
ruff check --fix .
black .

# Run strict static type analysis
mypy .
```
