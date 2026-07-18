from typing import Any, Optional
from fastapi import APIRouter, Depends, Header, Request, Response, status, HTTPException
from sqlalchemy.orm import Session

from app.api.v1.auth.dependencies import get_current_user
from app.core.database import get_db
from app.models.user import User
from app.schemas.auth import (
    ForgotPasswordRequest,
    GenericResponse,
    OnboardRequest,
    ResendOtpRequest,
    ResetPasswordRequest,
    TokenResponse,
    LoginResponseSchema,
    UserLogin,
    UserRegister,
    UserResponse,
    VerifyEmailRequest,
)
from app.services.auth import AuthService

router = APIRouter()


@router.post("/register", response_model=GenericResponse, status_code=status.HTTP_201_CREATED)
def register(user_in: UserRegister, db: Session = Depends(get_db)) -> GenericResponse:
    """
    Registers a new user and generates an email verification OTP.
    """
    auth_service = AuthService(db)
    auth_service.register(
        full_name=user_in.full_name,
        email=user_in.email,
        password=user_in.password
    )
    return GenericResponse(
        success=True,
        message="Registration successful. A verification code has been sent to your email."
    )


@router.post("/verify-email", response_model=GenericResponse)
def verify_email(payload: VerifyEmailRequest, db: Session = Depends(get_db)) -> GenericResponse:
    """
    Verifies a user's email address using the 6-digit OTP.
    """
    auth_service = AuthService(db)
    auth_service.verify_email(email=payload.email, otp=payload.otp)
    return GenericResponse(
        success=True,
        message="Email verified successfully. You can now log in."
    )


@router.post("/resend-otp", response_model=GenericResponse)
def resend_otp(payload: ResendOtpRequest, db: Session = Depends(get_db)) -> GenericResponse:
    """
    Invalidates any previous OTPs and generates a new email verification code.
    """
    auth_service = AuthService(db)
    auth_service.resend_otp(email=payload.email)
    return GenericResponse(
        success=True,
        message="A new verification code has been sent to your email."
    )


@router.post("/login", response_model=LoginResponseSchema)
def login(
    payload: UserLogin,
    request: Request,
    response: Response,
    db: Session = Depends(get_db)
) -> dict[str, Any]:
    """
    Authenticates a user via email and password, returning tokens.
    """
    # Extract request metadata
    user_agent = request.headers.get("user-agent")
    ip_address = request.client.host if request.client else None
    
    auth_service = AuthService(db)
    login_data = auth_service.login(
        email=payload.email,
        password=payload.password,
        device_name=None,
        ip_address=ip_address,
        user_agent=user_agent
    )
    
    # Return standard Pydantic response (Next.js proxy route will intercept and set HttpOnly cookies)
    return {
        "access_token": login_data["access_token"],
        "refresh_token": login_data["refresh_token"],
        "token_type": login_data["token_type"],
        "expires_in": login_data["expires_in"],
        "refresh_token_expires_in": login_data["refresh_token_expires_in"],
        "user": login_data["user"]
    }


@router.post("/refresh", response_model=LoginResponseSchema)
def refresh(
    request: Request,
    response: Response,
    db: Session = Depends(get_db),
    x_refresh_token: Optional[str] = Header(None, alias="X-Refresh-Token")
) -> dict[str, Any]:
    """
    Rotates the session using the refresh token, issuing a new access token.
    """
    # Read refresh token from cookie or header
    refresh_token = request.cookies.get("refresh_token") or x_refresh_token
    
    # If not found, attempt to read from JSON body
    if not refresh_token:
        try:
            body = request.state.json_body if hasattr(request.state, 'json_body') else None
            if not body:
                # Direct read
                import asyncio
                # Fast block check or JSON parse
                pass
        except Exception:
            pass
            
    if not refresh_token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Refresh token is missing from the request."
        )
        
    user_agent = request.headers.get("user-agent")
    ip_address = request.client.host if request.client else None
    
    auth_service = AuthService(db)
    refresh_data = auth_service.refresh_token(
        refresh_token=refresh_token,
        device_name=None,
        ip_address=ip_address,
        user_agent=user_agent
    )
    
    return {
        "access_token": refresh_data["access_token"],
        "refresh_token": refresh_data["refresh_token"],
        "token_type": refresh_data["token_type"],
        "expires_in": refresh_data["expires_in"],
        "refresh_token_expires_in": refresh_data["refresh_token_expires_in"],
        "user": refresh_data["user"]
    }


@router.post("/logout", response_model=GenericResponse)
def logout(
    request: Request,
    db: Session = Depends(get_db),
    x_refresh_token: Optional[str] = Header(None, alias="X-Refresh-Token")
) -> GenericResponse:
    """
    Terminates the active session and invalidates the refresh token.
    """
    refresh_token = request.cookies.get("refresh_token") or x_refresh_token
    if refresh_token:
        auth_service = AuthService(db)
        auth_service.logout(refresh_token)
        
    return GenericResponse(
        success=True,
        message="Logged out successfully."
    )


@router.get("/me", response_model=UserResponse)
def me(current_user: User = Depends(get_current_user)) -> User:
    """
    Retrieves the profile of the currently authenticated user.
    """
    return current_user


@router.post("/forgot-password", response_model=GenericResponse)
def forgot_password(payload: ForgotPasswordRequest, db: Session = Depends(get_db)) -> GenericResponse:
    """
    Triggers a password reset request and logs the OTP for verification.
    """
    auth_service = AuthService(db)
    auth_service.forgot_password(email=payload.email)
    return GenericResponse(
        success=True,
        message="If this email is registered, a password reset code has been sent."
    )


@router.post("/reset-password", response_model=GenericResponse)
def reset_password(payload: ResetPasswordRequest, db: Session = Depends(get_db)) -> GenericResponse:
    """
    Resets the account password using the reset OTP.
    """
    auth_service = AuthService(db)
    auth_service.reset_password(
        email=payload.email,
        otp=payload.otp,
        new_password=payload.new_password
    )
    return GenericResponse(
        success=True,
        message="Password has been reset successfully. You can now log in."
    )


@router.post("/onboard", response_model=UserResponse)
def onboard(
    payload: OnboardRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
) -> User:
    """
    Completes onboarding by registering the user's first business name.
    """
    auth_service = AuthService(db)
    updated_user = auth_service.onboard(user=current_user, payload=payload)
    return updated_user
