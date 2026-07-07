# AI SaaS Architecture Design

This document details the system design, file structure, and integration boundaries for the AI SaaS Monorepo.

---

## Workspace Layout

The repository is structured as a monorepo containing multiple independent application modules and shared packages:

```
CompeteWell/
├── .github/workflows/    # CI Pipeline (build, format, lint checks)
├── apps/
│   ├── api/              # FastAPI python backend
│   └── web/              # Next.js 15 web client
├── docker/               # App-specific Dockerfiles
├── docs/                 # Engineering architecture & developer onboarding guides
├── packages/
│   └── shared/           # Common TypeScript types and constraints
├── docker-compose.yml    # Combined local developer workspace runner
└── package.json          # Root workspaces runner
```

---

## 1. Next.js Frontend (`apps/web`)

The Next.js web application is built on top of **Next.js 15** utilizing the **App Router**, TypeScript, and Tailwind CSS.
- **Dynamic Connection Test**: The frontpage renders an interactive client dashboard with an active system test dashboard. It queries both Next.js health API (`/api/health`) and the python backend (`/api/v1/health`) to display live latency, uptime, and underlying system configurations.
- **Shared Code Import**: Directly utilizes typescript definitions imported from `@saas/shared`.
- **Standalone Build Option**: Optimizes compilation for production distribution inside containerized systems, creating self-contained standalone build directories.

---

## 2. FastAPI Backend (`apps/api`)

The backend codebase leverages **FastAPI (Python 3.13)**. It is organized following Clean Architecture principles to enforce separation of concerns:

- **`app/main.py`**: Entry point that instantiates the FastAPI application, mounts versioned routers, and handles global CORS middleware registration.
- **`app/core/`**: Houses application config (`config.py`) loading from system environment variables via Pydantic Settings, JWT configurations, and database session bindings.
- **`app/api/`**: Grouping logic for HTTP router endpoints:
  - `v1/router.py`: Aggregates and prefixes routers belonging to API V1.
  - `v1/endpoints/health.py`: Validates API uptime and underlying dependent service health checks.
- **`app/schemas/`**: Pydantic validation schemas defining expected contract interfaces for input parsing and output serialization.

---

## 3. Shared Library (`packages/shared`)

A isolated workspace package compile-time resolved under the name `@saas/shared`.
- Declares core typescript interfaces and common configurations used by both frontend modules and helper tasks (e.g. `SUPPORTED_MODELS`).

---

## 4. Future Redis & Worker Integration

The monorepo is architected to seamlessly plug in caching and background task workers when needed:
1. **Infrastructure**: `docker-compose.yml` has pre-configured, commented-out services for `redis` (Redis Cache container) and `worker` (Celery background worker executing task queues).
2. **Configuration**: `.env.example` lists ready-to-use variables such as `REDIS_URL` and `WORKER_CONCURRENCY`.
3. **Application Core**: `apps/api/app/core/config.py` automatically binds `REDIS_URL` and hosts empty modules/stubs to load redis clients during initialization when environment variables are supplied.
