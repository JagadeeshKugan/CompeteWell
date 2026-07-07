# AI SaaS Monorepo

Welcome to the AI SaaS production-ready monorepo. This repository provides a complete, structured baseline for developing, formatting, linting, and deploying multi-service AI applications.

---

## 🛠️ Stack Configuration

- **Frontend (`apps/web`)**: Next.js 15 (TypeScript, Tailwind CSS, App Router) with ESLint & Prettier.
- **Backend (`apps/api`)**: FastAPI (Python 3.13) with Ruff, Black, and mypy code quality checkers.
- **Shared package (`packages/shared`)**: Workspace shared TypeScript structures.
- **Containers (`docker`)**: Production multi-stage Docker builds.
- **DevOps (`.github/workflows`)**: CI pipeline automated checks.

---

## 📖 Essential Documentation

Learn more in the specific documentation files:
- 🏗️ [Architecture Design](docs/architecture.md): Explore monorepo workspace configurations, service boundaries, and future worker extensions.
- 💻 [Local Development Guide](docs/development.md): Step-by-step setup guides, styling formatting standards, and docker compose setup.

---

## 🚀 Rapid Development Setup

Get the environment running locally in seconds using Docker:

```bash
# 1. Clone & setup env template
cp .env.example .env

# 2. Run local docker container cluster
docker-compose up --build
```

- **Frontend Client**: http://localhost:3000
- **API Backend**: http://localhost:8000
- **FastAPI OpenAPI Interactive Docs**: http://localhost:8000/docs