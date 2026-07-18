from datetime import datetime
from typing import Any
from uuid import UUID

from pydantic import BaseModel, EmailStr, Field


class UserRegister(BaseModel):
    full_name: str = Field(..., min_length=2, max_length=100)
    email: EmailStr
    password: str = Field(..., min_length=8, max_length=72)


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
    new_password: str = Field(..., min_length=8, max_length=72)


class OnboardRequest(BaseModel):
    organization_name: str = Field(..., min_length=1, max_length=200)
    business_name: str = Field(..., min_length=1, max_length=200)
    category: str = Field(..., min_length=1, max_length=200)
    zip_code: str = Field(..., min_length=1, max_length=20)
    country: str = Field(..., min_length=1, max_length=100)
    website_url: str | None = Field(None, max_length=500)
    phone: str | None = Field(None, max_length=50)
    address: str = Field(..., min_length=1, max_length=500)
    is_verified: bool = Field(False)
    rating: float | None = Field(None)
    review_count: int = Field(0)
    radius: str = Field(..., min_length=1, max_length=50)
    competitor_count: int = Field(10)
    depth: str = Field(..., min_length=1, max_length=50)


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
    data: Any | None = None
