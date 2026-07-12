import time
from datetime import datetime, timezone
from fastapi import APIRouter
from app.core.config import settings
from app.schemas.health import HealthStatus

router = APIRouter()
start_time = time.time()


@router.get("", response_model=HealthStatus)
def check_health() -> HealthStatus:
    """
    Perform a health check on the API and its dependent systems.
    Mocks connections for non-implemented services.
    """
    uptime = time.time() - start_time

    from sqlalchemy import text
    from app.core.database import SessionLocal

    # Dependent services status check
    database_status = "offline"
    try:
        db = SessionLocal()
        db.execute(text("SELECT 1"))
        db.close()
        database_status = "healthy"
    except Exception as e:
        database_status = f"unhealthy: {str(e)}"

    services_status = {
        "database": database_status,
        "redis": "not_implemented",
        "worker": "not_implemented",
    }

    overall_status = "ok" if database_status == "healthy" else "error"

    return HealthStatus(
        status=overall_status,
        environment=settings.ENVIRONMENT,
        timestamp=datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"),
        version="1.0.0",
        services=services_status,
        uptime_seconds=round(uptime, 2),
    )

