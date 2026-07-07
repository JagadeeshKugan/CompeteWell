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

    # Dependent services status placeholders
    services_status = {
        "database": "not_implemented",
        "redis": "not_implemented",
        "worker": "not_implemented",
    }

    return HealthStatus(
        status="ok",
        environment=settings.ENVIRONMENT,
        timestamp=datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"),
        version="1.0.0",
        services=services_status,
        uptime_seconds=round(uptime, 2),
    )
