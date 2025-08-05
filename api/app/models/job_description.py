from sqlalchemy import Column, String, Boolean, DateTime, Integer, ForeignKey, Text, ARRAY
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.database import Base
import uuid


class JobDescription(Base):
    __tablename__ = "job_descriptions"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"))
    title = Column(String(255), nullable=False)
    company = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)
    requirements = Column(Text)
    skills_required = Column(ARRAY(String))
    experience_level = Column(String(50))
    industry = Column(String(100))
    location = Column(String(255))
    salary_range_min = Column(Integer)
    salary_range_max = Column(Integer)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    
    # Relationships
    user = relationship("User", back_populates="job_descriptions")
    keywords = relationship("JobKeyword", back_populates="job_description", cascade="all, delete-orphan")
    resume_submissions = relationship("ResumeSubmission", back_populates="job_description")
    scoring_results = relationship("ScoringResult", back_populates="job_description")


class JobKeyword(Base):
    __tablename__ = "job_keywords"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    job_description_id = Column(UUID(as_uuid=True), ForeignKey("job_descriptions.id", ondelete="CASCADE"))
    keyword = Column(String(255), nullable=False)
    category = Column(String(100))
    weight = Column(Integer, default=1)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    job_description = relationship("JobDescription", back_populates="keywords") 