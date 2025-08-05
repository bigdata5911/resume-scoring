from sqlalchemy import Column, String, Boolean, DateTime, Integer, ForeignKey, Text, BigInteger
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.database import Base
import uuid


class ResumeSubmission(Base):
    __tablename__ = "resume_submissions"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email_config_id = Column(UUID(as_uuid=True), ForeignKey("email_configs.id", ondelete="CASCADE"))
    job_description_id = Column(UUID(as_uuid=True), ForeignKey("job_descriptions.id"))
    candidate_email = Column(String(255), nullable=False)
    candidate_name = Column(String(255))
    position_applied = Column(String(255))
    original_email_subject = Column(String(500))
    original_email_body = Column(Text)
    attachment_filename = Column(String(255))
    attachment_path = Column(String(500))
    file_size_bytes = Column(BigInteger)
    file_type = Column(String(50))
    status = Column(String(50), default="pending")
    processing_started_at = Column(DateTime(timezone=True))
    processing_completed_at = Column(DateTime(timezone=True))
    error_message = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    
    # Relationships
    email_config = relationship("EmailConfig", back_populates="resume_submissions")
    job_description = relationship("JobDescription", back_populates="resume_submissions")
    parsed_resume = relationship("ParsedResume", back_populates="resume_submission", uselist=False)
    scoring_results = relationship("ScoringResult", back_populates="resume_submission")
    email_responses = relationship("EmailResponse", back_populates="resume_submission")
    processing_queue = relationship("ProcessingQueue", back_populates="resume_submission", uselist=False) 