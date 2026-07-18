from typing import List, Optional
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session

from app.api.v1.auth.dependencies import get_current_user
from app.core.database import get_db
from app.models.user import User
from app.models.business import Business
from app.models.organization import Organization
from app.repositories.advisor import AdvisorRepository
from app.schemas.auth import GenericResponse
from app.schemas.advisor import (
    BusinessResponse,
    ConversationResponse,
    ConversationDetailResponse,
    ConversationCreateRequest,
    ChatRequest,
)
from app.orchestrators.advisor import BusinessAdvisorOrchestrator

router = APIRouter()


@router.get("/businesses", response_model=List[BusinessResponse])
def get_businesses(
    current_user: User = Depends(get_current_user), db: Session = Depends(get_db)
) -> List[Business]:
    """
    Retrieves all business locations registered under the user's organizations.
    """
    orgs = db.query(Organization).filter(Organization.user_id == current_user.id).all()
    if not orgs:
        return []
    org_ids = [org.id for org in orgs]
    businesses = db.query(Business).filter(Business.organization_id.in_(org_ids)).all()
    return businesses


@router.get("/conversations", response_model=List[ConversationResponse])
def list_conversations(
    location_id: Optional[UUID] = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> List[ConversationResponse]:
    """
    List past advisor conversations for the current user.
    """
    repo = AdvisorRepository(db)
    conversations = repo.list_conversations_for_user(user_id=current_user.id, location_id=location_id)
    return conversations


@router.post("/conversations", response_model=ConversationResponse, status_code=status.HTTP_201_CREATED)
def create_conversation(
    payload: ConversationCreateRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> ConversationResponse:
    """
    Manually creates a new advisor conversation shell.
    """
    repo = AdvisorRepository(db)
    biz = db.query(Business).filter(Business.id == payload.location_id).first()
    if not biz:
        raise HTTPException(status_code=404, detail="Business location not found.")
    org = db.query(Organization).filter(Organization.id == biz.organization_id).first()
    if not org or org.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to access this business.")

    conv = repo.create_conversation(
        organization_id=payload.organization_id,
        location_id=payload.location_id,
        user_id=current_user.id,
        title=payload.title or "New Conversation",
    )
    return conv


@router.get("/conversations/{id}", response_model=ConversationDetailResponse)
def get_conversation(
    id: UUID, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)
) -> ConversationDetailResponse:
    """
    Retrieves full details of a conversation, including all message histories.
    """
    repo = AdvisorRepository(db)
    conv = repo.get_conversation(id)
    if not conv:
        raise HTTPException(status_code=404, detail="Conversation not found.")
    if conv.created_by != current_user.id:
        raise HTTPException(status_code=403, detail="Access denied.")
    return conv


@router.delete("/conversations/{id}", response_model=GenericResponse)
def delete_conversation(
    id: UUID, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)
) -> GenericResponse:
    """
    Deletes an advisor conversation and all its messages.
    """
    repo = AdvisorRepository(db)
    conv = repo.get_conversation(id)
    if not conv:
        raise HTTPException(status_code=404, detail="Conversation not found.")
    if conv.created_by != current_user.id:
        raise HTTPException(status_code=403, detail="Access denied.")

    repo.delete_conversation(id)
    return GenericResponse(success=True, message="Conversation deleted successfully.")


@router.post("/chat")
def chat(
    payload: ChatRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> StreamingResponse:
    """
    Sends a message to the advisor, coordinates context, calls Gemini API,
    and returns a streaming response.
    """
    repo = AdvisorRepository(db)
    conversation_id = payload.conversation_id

    # If conversation does not exist, create it dynamically
    if not conversation_id:
        if not payload.location_id:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="location_id is required to start a new conversation.",
            )
        biz = db.query(Business).filter(Business.id == payload.location_id).first()
        if not biz:
            raise HTTPException(status_code=404, detail="Business location not found.")
        org = db.query(Organization).filter(Organization.id == biz.organization_id).first()
        if not org or org.user_id != current_user.id:
            raise HTTPException(status_code=403, detail="Access denied.")

        title = payload.content[:40] + "..." if len(payload.content) > 40 else payload.content
        conv = repo.create_conversation(
            organization_id=biz.organization_id,
            location_id=biz.id,
            user_id=current_user.id,
            title=title,
        )
        conversation_id = conv.id
    else:
        conv = repo.get_conversation(conversation_id)
        if not conv:
            raise HTTPException(status_code=404, detail="Conversation not found.")
        if conv.created_by != current_user.id:
            raise HTTPException(status_code=403, detail="Access denied.")

        # Update title if it is default
        if conv.title == "New Conversation":
            title = payload.content[:40] + "..." if len(payload.content) > 40 else payload.content
            repo.update_conversation_title(conversation_id, title)

    # Initialize orchestrator and run chat streaming generator
    orchestrator = BusinessAdvisorOrchestrator(db)
    generator = orchestrator.chat_stream(
        user_id=current_user.id, conversation_id=conversation_id, content=payload.content
    )

    return StreamingResponse(
        generator,
        media_type="text/event-stream",
        headers={
            "X-Conversation-Id": str(conversation_id),
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
        },
    )
