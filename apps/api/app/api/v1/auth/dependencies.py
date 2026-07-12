from typing import Optional
from uuid import UUID
from fastapi import Depends, HTTPException, Request, status
from fastapi.security import APIKeyCookie, APIKeyHeader
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.jwt import verify_access_token
from app.repositories.user import UserRepository
from app.models.user import User

# Support extracting access token from both cookies and Authorization header
cookie_sec = APIKeyCookie(name="access_token", auto_error=False)
header_sec = APIKeyHeader(name="Authorization", auto_error=False)


def get_token_from_request(
    request: Request,
    access_token_cookie: Optional[str] = Depends(cookie_sec),
    auth_header: Optional[str] = Depends(header_sec)
) -> str:
    """
    Retrieves the access token from either the HTTP-Only cookie 'access_token'
    or the standard HTTP 'Authorization: Bearer <token>' header.
    """
    if auth_header and auth_header.lower().startswith("bearer "):
        return auth_header.split(" ", 1)[1]
    
    if access_token_cookie:
        return access_token_cookie
        
    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Missing authentication credentials.",
    )


def get_current_user(
    db: Session = Depends(get_db),
    token: str = Depends(get_token_from_request)
) -> User:
    """
    Verifies the access token and returns the current authenticated user.
    """
    user_id_str = verify_access_token(token)
    if not user_id_str:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Session has expired or credentials are invalid.",
        )
        
    try:
        user_uuid = UUID(user_id_str)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Session payload format is invalid.",
        )
        
    user_repo = UserRepository(db)
    user = user_repo.get_by_id(user_uuid)
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User account not found.",
        )
        
    if user.status != "active":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User account is suspended or disabled.",
        )
        
    return user
