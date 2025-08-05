from sqlalchemy import Column, String, Boolean, DateTime, Integer, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.database import Base
import uuid


class EmailConfig(Base):
    __tablename__ = "email_configs"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"))
    email_address = Column(String(255), nullable=False)
    email_provider = Column(String(50), nullable=False)
    pop3_host = Column(String(255))
    pop3_port = Column(Integer, default=995)
    pop3_username = Column(String(255))
    pop3_password = Column(String(255))
    smtp_host = Column(String(255))
    smtp_port = Column(Integer, default=587)
    smtp_username = Column(String(255))
    smtp_password = Column(String(255))
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    
    # Relationships
    user = relationship("User", back_populates="email_configs")
    resume_submissions = relationship("ResumeSubmission", back_populates="email_config") 