from datetime import datetime, timedelta, timezone
import logging
import secrets
from typing import Any, Optional
from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.jwt import (
    create_access_token,
    generate_refresh_token,
    hash_refresh_token,
)
from app.core.security import get_password_hash, verify_password
from app.repositories.email_verification import EmailVerificationRepository
from app.repositories.user import UserRepository
from app.repositories.user_session import UserSessionRepository
from app.models.user import User

logger = logging.getLogger(__name__)


class AuthService:
    def __init__(self, db: Session):
        self.db = db
        self.user_repo = UserRepository(db)
        self.verify_repo = EmailVerificationRepository(db)
        self.session_repo = UserSessionRepository(db)

    def register(self, full_name: str, email: str, password: str) -> User:
        # Check if user already exists
        existing_user = self.user_repo.get_by_email(email)
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="An account with this email address already exists.",
            )

        # Hash password and create user
        pwd_hash = get_password_hash(password)
        user = self.user_repo.create(
            full_name=full_name,
            email=email,
            password_hash=pwd_hash
        )

        # Generate email OTP
        otp = "".join(secrets.choice("0123456789") for _ in range(6))
        expires_at = datetime.now(timezone.utc) + timedelta(minutes=10)
        self.verify_repo.create(user.id, otp, expires_at)

        # Log verification code to console for development verification
        logger.warning(
            f"\n\n============================================\n"
            f"[OTP PROVISIONED] Registration for {email}\n"
            f"Code: {otp}\n"
            f"Expires at: {expires_at.strftime('%Y-%m-%d %H:%M:%S UTC')}\n"
            f"============================================\n"
        )
        print(f"\n[DEVELOPER OTP] {email} -> {otp}\n", flush=True)

        return user

    def verify_email(self, email: str, otp: str) -> None:
        user = self.user_repo.get_by_email(email)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User account not found.",
            )

        verification = self.verify_repo.get_latest_by_user_id(user.id)
        if not verification or verification.verified_at is not None:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="No pending email verification found.",
            )

        # Check expiration
        if verification.expires_at.replace(tzinfo=timezone.utc) < datetime.now(timezone.utc):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Verification code has expired. Please request a new code.",
            )

        # Check attempts limit
        if verification.attempts >= 5:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Too many failed attempts. Please request a new code.",
            )

        # Check OTP match
        if verification.otp != otp:
            self.verify_repo.increment_attempts(verification)
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid verification code.",
            )

        # Success: Mark verified
        self.verify_repo.mark_verified(verification)
        self.user_repo.update_verification_status(user, is_verified=True)

    def resend_otp(self, email: str) -> None:
        user = self.user_repo.get_by_email(email)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User account not found.",
            )

        if user.is_verified:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email address is already verified.",
            )

        # Create new OTP
        otp = "".join(secrets.choice("0123456789") for _ in range(6))
        expires_at = datetime.now(timezone.utc) + timedelta(minutes=10)
        self.verify_repo.create(user.id, otp, expires_at)

        # Log verification code
        logger.warning(
            f"\n\n============================================\n"
            f"[OTP RESENT] Verification for {email}\n"
            f"Code: {otp}\n"
            f"============================================\n"
        )
        print(f"\n[DEVELOPER OTP RESENT] {email} -> {otp}\n", flush=True)

    def login(
        self,
        email: str,
        password: str,
        device_name: Optional[str] = None,
        ip_address: Optional[str] = None,
        user_agent: Optional[str] = None,
    ) -> dict[str, Any]:
        user = self.user_repo.get_by_email(email)
        if not user or not verify_password(password, user.password_hash):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email address or password.",
            )

        if not user.is_verified:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Your email address has not been verified yet.",
            )

        # Update last login details
        self.user_repo.update_last_login(user)

        # Generate tokens
        access_token = create_access_token(str(user.id))
        raw_refresh_token = generate_refresh_token()
        refresh_hash = hash_refresh_token(raw_refresh_token)

        expires_at = datetime.now(timezone.utc) + timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS)

        # Save session
        self.session_repo.create(
            user_id=user.id,
            refresh_token_hash=refresh_hash,
            expires_at=expires_at,
            device_name=device_name,
            ip_address=ip_address,
            user_agent=user_agent
        )

        return {
            "access_token": access_token,
            "refresh_token": raw_refresh_token,
            "token_type": "bearer",
            "expires_in": settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
            "refresh_token_expires_in": settings.REFRESH_TOKEN_EXPIRE_DAYS * 24 * 3600,
            "user": user,
        }

    def refresh_token(
        self,
        refresh_token: str,
        device_name: Optional[str] = None,
        ip_address: Optional[str] = None,
        user_agent: Optional[str] = None,
    ) -> dict[str, Any]:
        token_hash = hash_refresh_token(refresh_token)
        session = self.session_repo.get_by_refresh_token_hash(token_hash)
        
        if not session:
            raise HTTPException(
                status_code=status.HTTP_410_GONE,
                detail="Session not found or already terminated.",
            )

        if session.expires_at.replace(tzinfo=timezone.utc) < datetime.now(timezone.utc):
            self.session_repo.delete_session(session)
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Session has expired. Please sign in again.",
            )

        # Retrieve user
        user = self.user_repo.get_by_id(session.user_id)
        if not user or user.status != "active":
            self.session_repo.delete_session(session)
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="User account is inactive or disabled.",
            )

        # Rotate refresh token: create new session and invalidate old
        new_raw_refresh_token = generate_refresh_token()
        new_refresh_hash = hash_refresh_token(new_raw_refresh_token)
        new_expires_at = datetime.now(timezone.utc) + timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS)

        # Create new session
        self.session_repo.create(
            user_id=user.id,
            refresh_token_hash=new_refresh_hash,
            expires_at=new_expires_at,
            device_name=device_name or session.device_name,
            ip_address=ip_address or session.ip_address,
            user_agent=user_agent or session.user_agent
        )

        # Delete old session
        self.session_repo.delete_session(session)

        # Generate new access token
        access_token = create_access_token(str(user.id))

        return {
            "access_token": access_token,
            "refresh_token": new_raw_refresh_token,
            "token_type": "bearer",
            "expires_in": settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
            "refresh_token_expires_in": settings.REFRESH_TOKEN_EXPIRE_DAYS * 24 * 3600,
            "user": user,
        }

    def logout(self, refresh_token: str) -> None:
        token_hash = hash_refresh_token(refresh_token)
        session = self.session_repo.get_by_refresh_token_hash(token_hash)
        if session:
            self.session_repo.delete_session(session)

    def forgot_password(self, email: str) -> None:
        user = self.user_repo.get_by_email(email)
        if not user:
            # Prevent account enumeration: do not raise error if email is missing
            logger.warning(f"[FORGOT PASSWORD] Attempted for non-existing user: {email}")
            return

        # Generate password reset OTP
        otp = "".join(secrets.choice("0123456789") for _ in range(6))
        expires_at = datetime.now(timezone.utc) + timedelta(minutes=10)
        self.verify_repo.create(user.id, otp, expires_at)

        # Log verification code
        logger.warning(
            f"\n\n============================================\n"
            f"[RESET PASSWORD OTP PROVISIONED] User {email}\n"
            f"Code: {otp}\n"
            f"Expires at: {expires_at.strftime('%Y-%m-%d %H:%M:%S UTC')}\n"
            f"============================================\n"
        )
        print(f"\n[DEVELOPER RESET PASSWORD OTP] {email} -> {otp}\n", flush=True)

    def reset_password(self, email: str, otp: str, new_password: str) -> None:
        user = self.user_repo.get_by_email(email)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User account not found.",
            )

        verification = self.verify_repo.get_latest_by_user_id(user.id)
        if not verification or verification.verified_at is not None:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="No pending reset verification code found.",
            )

        if verification.expires_at.replace(tzinfo=timezone.utc) < datetime.now(timezone.utc):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Reset code has expired. Please request a new one.",
            )

        if verification.attempts >= 5:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Too many failed attempts. Please request a new reset code.",
            )

        if verification.otp != otp:
            self.verify_repo.increment_attempts(verification)
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid verification code.",
            )

        # OTP is valid: Update password hash and mark verified
        pwd_hash = get_password_hash(new_password)
        self.user_repo.update_password_hash(user, pwd_hash)
        self.verify_repo.mark_verified(verification)

        # Clear all user sessions to force login again
        self.session_repo.delete_all_for_user(user.id)

    def onboard(self, user: User, business_name: str) -> User:
        if user.onboarding_completed:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Onboarding has already been completed.",
            )
        # Update user status to complete
        return self.user_repo.update_onboarding_status(user, onboarding_completed=True)
