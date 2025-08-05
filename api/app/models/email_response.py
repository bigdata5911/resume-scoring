from sqlalchemy import Column, String, Boolean, DateTime, Integer, ForeignKey, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.database import Base
import uuid


class EmailResponse(Base):
    __tablename__ = "email_responses"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    resume_submission_id = Column(UUID(as_uuid=True), ForeignKey("resume_submissions.id", ondelete="CASCADE"))
    scoring_result_id = Column(UUID(as_uuid=True), ForeignKey("scoring_results.id", ondelete="CASCADE"))
    recipient_email = Column(String(255), nullable=False)
    subject = Column(String(500))
    body = Column(Text)
    template_used = Column(String(100))
    sent_at = Column(DateTime(timezone=True))
    delivery_status = Column(String(50))
    error_message = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    resume_submission = relationship("ResumeSubmission", back_populates="email_responses")
    scoring_result = relationship("ScoringResult", back_populates="email_responses") 