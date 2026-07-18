from datetime import datetime, timezone
from typing import List, Optional
from uuid import UUID
from sqlalchemy.orm import Session

from app.models.advisor import AdvisorConversation, AdvisorMessage


class AdvisorRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_conversation(self, conversation_id: UUID) -> Optional[AdvisorConversation]:
        return self.db.query(AdvisorConversation).filter(AdvisorConversation.id == conversation_id).first()

    def list_conversations_for_user(
        self, user_id: UUID, location_id: Optional[UUID] = None
    ) -> List[AdvisorConversation]:
        query = self.db.query(AdvisorConversation).filter(AdvisorConversation.created_by == user_id)
        if location_id:
            query = query.filter(AdvisorConversation.location_id == location_id)
        return query.order_by(AdvisorConversation.updated_at.desc()).all()

    def create_conversation(
        self, organization_id: UUID, location_id: UUID, user_id: UUID, title: str = "New Conversation"
    ) -> AdvisorConversation:
        conversation = AdvisorConversation(
            organization_id=organization_id,
            location_id=location_id,
            created_by=user_id,
            title=title,
        )
        self.db.add(conversation)
        self.db.commit()
        self.db.refresh(conversation)
        return conversation

    def delete_conversation(self, conversation_id: UUID) -> bool:
        conversation = self.get_conversation(conversation_id)
        if conversation:
            self.db.delete(conversation)
            self.db.commit()
            return True
        return False

    def add_message(self, conversation_id: UUID, role: str, content: str) -> AdvisorMessage:
        message = AdvisorMessage(
            conversation_id=conversation_id,
            role=role,
            content=content,
        )
        self.db.add(message)
        
        # Update conversation updated_at time
        conversation = self.get_conversation(conversation_id)
        if conversation:
            conversation.updated_at = datetime.now(timezone.utc)
            self.db.add(conversation)
            
        self.db.commit()
        self.db.refresh(message)
        return message

    def update_conversation_title(self, conversation_id: UUID, title: str) -> Optional[AdvisorConversation]:
        conversation = self.get_conversation(conversation_id)
        if conversation:
            conversation.title = title
            conversation.updated_at = datetime.now(timezone.utc)
            self.db.add(conversation)
            self.db.commit()
            self.db.refresh(conversation)
        return conversation
