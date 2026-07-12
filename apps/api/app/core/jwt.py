from datetime import datetime, timedelta, timezone
from typing import Optional
import jwt
import hashlib
import secrets

from app.core.config import settings


def create_access_token(subject: str, expires_delta: Optional[timedelta] = None) -> str:
    """
    Generates a signed JWT access token for a given user identifier.
    """
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    
    to_encode = {
        "exp": expire,
        "sub": str(subject),
        "type": "access"
    }
    
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.JWT_ALGORITHM)
    return encoded_jwt


def verify_access_token(token: str) -> Optional[str]:
    """
    Decodes and validates a JWT access token. Returns the subject (user_id) if valid,
    or None if invalid/expired.
    """
    try:
        payload = jwt.decode(
            token,
            settings.SECRET_KEY,
            algorithms=[settings.JWT_ALGORITHM]
        )
        
        # Verify token type is access
        if payload.get("type") != "access":
            return None
            
        sub = payload.get("sub")
        if sub is None:
            return None
        return str(sub)
    except jwt.PyJWTError:
        return None


def generate_refresh_token() -> str:
    """
    Generates a secure, random refresh token.
    """
    return secrets.token_urlsafe(64)


def hash_refresh_token(token: str) -> str:
    """
    Hashes a refresh token using SHA-256 to ensure it is never stored in plain text.
    """
    return hashlib.sha256(token.encode("utf-8")).hexdigest()
