from sqlalchemy import Column, String, Boolean, DateTime, Integer, ForeignKey, Text, Numeric, JSON
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.database import Base
import uuid


class ScoringResult(Base):
    __tablename__ = "scoring_results"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    resume_submission_id = Column(UUID(as_uuid=True), ForeignKey("resume_submissions.id", ondelete="CASCADE"))
    job_description_id = Column(UUID(as_uuid=True), ForeignKey("job_descriptions.id"))
    
    # Overall Scores
    total_score = Column(Integer, nullable=False)
    confidence_level = Column(Numeric(3, 2))
    
    # Category Scores
    job_match_score = Column(Integer)
    experience_score = Column(Integer)
    education_score = Column(Integer)
    stability_score = Column(Integer)
    presentation_score = Column(Integer)
    
    # Recommendation
    recommendation = Column(String(50))
    
    # Detailed Analysis
    keyword_matches = Column(JSONB)
    skill_gaps = Column(JSONB)
    experience_analysis = Column(JSONB)
    education_analysis = Column(JSONB)
    stability_analysis = Column(JSONB)
    
    # Red Flags
    red_flags = Column(JSONB)
    red_flag_count = Column(Integer, default=0)
    
    # LLM Response
    llm_analysis_text = Column(Text)
    llm_prompt_used = Column(Text)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    resume_submission = relationship("ResumeSubmission", back_populates="scoring_results")
    job_description = relationship("JobDescription", back_populates="scoring_results")
    email_responses = relationship("EmailResponse", back_populates="scoring_result") 