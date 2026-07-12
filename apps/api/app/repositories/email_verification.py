from datetime import datetime, timezone
from typing import Optional
from uuid import UUID
from sqlalchemy.orm import Session

from app.models.email_verification import EmailVerification


class EmailVerificationRepository:
    def __init__(self, db: Session):
        self.db = db

    def create(self, user_id: UUID, otp: str, expires_at: datetime) -> EmailVerification:
        # Deactivate any previous unused verifications for this user by expiring them
        self.db.query(EmailVerification).filter(
            EmailVerification.user_id == user_id,
            EmailVerification.verified_at.is_(None)
        ).update({"expires_at": datetime.now(timezone.utc)})
        
        verification = EmailVerification(
            user_id=user_id,
            otp=otp,
            expires_at=expires_at,
            attempts=0
        )
        self.db.add(verification)
        self.db.commit()
        self.db.refresh(verification)
        return verification

    def get_latest_by_user_id(self, user_id: UUID) -> Optional[EmailVerification]:
        return (
            self.db.query(EmailVerification)
            .filter(EmailVerification.user_id == user_id)
            .order_by(EmailVerification.created_at.desc())
            .first()
        )

    def increment_attempts(self, verification: EmailVerification) -> EmailVerification:
        verification.attempts += 1
        self.db.add(verification)
        self.db.commit()
        self.db.refresh(verification)
        return verification

    def mark_verified(self, verification: EmailVerification) -> EmailVerification:
        verification.verified_at = datetime.now(timezone.utc)
        self.db.add(verification)
        self.db.commit()
        self.db.refresh(verification)
        return verification
