from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.router import api_router
from app.api.v1.endpoints import health
from app.core.config import settings

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="Production-ready FastAPI backend for AI SaaS",
    version="1.0.0",
    openapi_url=f"{settings.API_V1_STR}/openapi.json" if settings.DEBUG else None,
    docs_url="/docs" if settings.DEBUG else None,
    redoc_url="/redoc" if settings.DEBUG else None,
)

# CORS configuration
if settings.ALLOWED_ORIGINS:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.ALLOWED_ORIGINS,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )


@app.on_event("startup")
def on_startup() -> None:
    from app.core.database import Base, engine
    import app.models  # noqa: F401
    Base.metadata.create_all(bind=engine)



# Versioned APIs
app.include_router(api_router, prefix=settings.API_V1_STR)


# Root level endpoints for orchestrators and load balancers
app.include_router(health.router, prefix="/health", tags=["Health"])


@app.get("/", tags=["Root"])
def read_root() -> dict[str, str]:
    return {
        "message": f"Welcome to {settings.PROJECT_NAME}!",
        "docs": "/docs" if settings.DEBUG else "disabled",
    }
