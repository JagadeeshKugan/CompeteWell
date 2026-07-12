from datetime import datetime
from typing import Optional
from uuid import UUID
from sqlalchemy.orm import Session

from app.models.user_session import UserSession


class UserSessionRepository:
    def __init__(self, db: Session):
        self.db = db

    def create(
        self,
        user_id: UUID,
        refresh_token_hash: str,
        expires_at: datetime,
        device_name: Optional[str] = None,
        ip_address: Optional[str] = None,
        user_agent: Optional[str] = None,
    ) -> UserSession:
        session = UserSession(
            user_id=user_id,
            refresh_token_hash=refresh_token_hash,
            expires_at=expires_at,
            device_name=device_name,
            ip_address=ip_address,
            user_agent=user_agent
        )
        self.db.add(session)
        self.db.commit()
        self.db.refresh(session)
        return session

    def get_by_refresh_token_hash(self, refresh_token_hash: str) -> Optional[UserSession]:
        return (
            self.db.query(UserSession)
            .filter(UserSession.refresh_token_hash == refresh_token_hash)
            .first()
        )

    def delete_session(self, session: UserSession) -> None:
        self.db.delete(session)
        self.db.commit()

    def delete_all_for_user(self, user_id: UUID) -> None:
        self.db.query(UserSession).filter(UserSession.user_id == user_id).delete()
        self.db.commit()
