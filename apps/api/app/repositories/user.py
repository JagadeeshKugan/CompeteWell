from datetime import datetime, timezone
from typing import Optional
from uuid import UUID
from sqlalchemy.orm import Session

from app.models.user import User


class UserRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_by_id(self, user_id: UUID) -> Optional[User]:
        return self.db.query(User).filter(User.id == user_id).first()

    def get_by_email(self, email: str) -> Optional[User]:
        return self.db.query(User).filter(User.email == email.lower().strip()).first()

    def create(self, full_name: str, email: str, password_hash: str) -> User:
        user = User(
            full_name=full_name,
            email=email.lower().strip(),
            password_hash=password_hash,
            is_verified=False,
            onboarding_completed=False,
            status="active"
        )
        self.db.add(user)
        self.db.commit()
        self.db.refresh(user)
        return user

    def update_verification_status(self, user: User, is_verified: bool) -> User:
        user.is_verified = is_verified
        user.updated_at = datetime.now(timezone.utc)
        self.db.add(user)
        self.db.commit()
        self.db.refresh(user)
        return user

    def update_onboarding_status(self, user: User, onboarding_completed: bool) -> User:
        user.onboarding_completed = onboarding_completed
        user.updated_at = datetime.now(timezone.utc)
        self.db.add(user)
        self.db.commit()
        self.db.refresh(user)
        return user

    def update_last_login(self, user: User) -> User:
        user.last_login = datetime.now(timezone.utc)
        user.updated_at = datetime.now(timezone.utc)
        self.db.add(user)
        self.db.commit()
        self.db.refresh(user)
        return user

    def update_password_hash(self, user: User, password_hash: str) -> User:
        user.password_hash = password_hash
        user.updated_at = datetime.now(timezone.utc)
        self.db.add(user)
        self.db.commit()
        self.db.refresh(user)
        return user
