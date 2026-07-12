from datetime import datetime
from typing import Any, Optional
from uuid import UUID
from pydantic import BaseModel, EmailStr, Field


class UserRegister(BaseModel):
    full_name: str = Field(..., min_length=2, max_length=100)
    email: EmailStr
    password: str = Field(..., min_length=8, max_length=100)


class UserLogin(BaseModel):
    email: EmailStr
    password: str = Field(...)


class VerifyEmailRequest(BaseModel):
    email: EmailStr
    otp: str = Field(..., min_length=6, max_length=6)


class ResendOtpRequest(BaseModel):
    email: EmailStr


class ForgotPasswordRequest(BaseModel):
    email: EmailStr


class ResetPasswordRequest(BaseModel):
    otp: str = Field(..., min_length=6, max_length=6)
    email: EmailStr
    new_password: str = Field(..., min_length=8, max_length=100)


class OnboardRequest(BaseModel):
    business_name: str = Field(..., min_length=1, max_length=200)
    website_url: Optional[str] = Field(None, max_length=500)


class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    expires_in: int  # in seconds (e.g. 900 for 15m)
    refresh_token_expires_in: int  # in seconds (e.g. 2592000 for 30d)


class UserResponse(BaseModel):
    id: UUID
    email: str
    full_name: str
    is_verified: bool
    onboarding_completed: bool
    status: str
    created_at: datetime

    class Config:
        from_attributes = True


class LoginResponseSchema(TokenResponse):
    user: UserResponse



class GenericResponse(BaseModel):
    success: bool
    message: str
    data: Optional[Any] = None
