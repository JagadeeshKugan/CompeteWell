from typing import Dict, Optional
from pydantic import BaseModel


class HealthStatus(BaseModel):
    status: str
    environment: str
    timestamp: str
    version: str
    services: Dict[str, str]
    uptime_seconds: Optional[float] = None
