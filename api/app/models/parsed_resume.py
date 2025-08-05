from sqlalchemy import Column, String, Boolean, DateTime, Integer, ForeignKey, Text, ARRAY, JSON
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.database import Base
import uuid


class ParsedResume(Base):
    __tablename__ = "parsed_resumes"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    resume_submission_id = Column(UUID(as_uuid=True), ForeignKey("resume_submissions.id", ondelete="CASCADE"))
    raw_text = Column(Text)
    extracted_name = Column(String(255))
    extracted_email = Column(String(255))
    extracted_phone = Column(String(50))
    extracted_linkedin = Column(String(255))
    extracted_skills = Column(ARRAY(String))
    extracted_experience = Column(JSONB)
    extracted_education = Column(JSONB)
    extracted_certifications = Column(JSONB)
    years_of_experience = Column(Integer)
    parsed_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    resume_submission = relationship("ResumeSubmission", back_populates="parsed_resume") 