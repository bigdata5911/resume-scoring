from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime
from uuid import UUID


class ResumeSubmissionBase(BaseModel):
    candidate_email: EmailStr
    candidate_name: Optional[str] = None
    position_applied: Optional[str] = None
    job_description_id: Optional[UUID] = None


class ResumeSubmissionCreate(ResumeSubmissionBase):
    email_config_id: UUID
    original_email_subject: Optional[str] = None
    original_email_body: Optional[str] = None
    attachment_filename: Optional[str] = None
    attachment_path: Optional[str] = None
    file_size_bytes: Optional[int] = None
    file_type: Optional[str] = None


class ResumeSubmissionResponse(ResumeSubmissionBase):
    id: UUID
    email_config_id: UUID
    original_email_subject: Optional[str] = None
    original_email_body: Optional[str] = None
    attachment_filename: Optional[str] = None
    attachment_path: Optional[str] = None
    file_size_bytes: Optional[int] = None
    file_type: Optional[str] = None
    status: str
    processing_started_at: Optional[datetime] = None
    processing_completed_at: Optional[datetime] = None
    error_message: Optional[str] = None
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True 