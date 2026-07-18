from datetime import datetime
from typing import List, Optional
from uuid import UUID
from pydantic import BaseModel, Field


class MessageResponse(BaseModel):
    id: UUID
    conversation_id: UUID
    role: str
    content: str
    created_at: datetime

    model_config = {"from_attributes": True}


class ConversationResponse(BaseModel):
    id: UUID
    organization_id: UUID
    location_id: UUID
    title: str
    created_by: UUID
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


class ConversationDetailResponse(ConversationResponse):
    messages: List[MessageResponse] = []

    model_config = {"from_attributes": True}


class ConversationCreateRequest(BaseModel):
    location_id: UUID
    organization_id: UUID
    title: Optional[str] = "New Conversation"


class ChatRequest(BaseModel):
    content: str = Field(..., min_length=1)
    conversation_id: Optional[UUID] = None
    location_id: Optional[UUID] = None  # Required if starting a new conversation


class BusinessResponse(BaseModel):
    id: UUID
    organization_id: UUID
    name: str
    category: str
    zip_code: str
    country: str
    website: Optional[str] = None
    phone: Optional[str] = None
    address: str
    is_verified: bool
    rating: Optional[float] = None
    review_count: int
    radius: str
    competitor_count: int
    depth: str
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}
