# Production Dockerfile for FastAPI Python Backend
FROM python:3.13-slim AS base

# Prevent python from writing pyc files and buffering stdout/stderr
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /app

# Install system dependencies (curl is used for Docker health check)
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Install requirements
COPY apps/api/requirements.txt .
RUN pip install --no-cache-dir --upgrade -r requirements.txt

# Copy backend codebase
COPY apps/api/ .

EXPOSE 8000

# Run FastAPI app with Uvicorn
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
