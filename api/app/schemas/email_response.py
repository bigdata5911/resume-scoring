from pydantic import BaseModel
from datetime import datetime
from typing import Optional
from uuid import UUID


class EmailResponseResponse(BaseModel):
    id: UUID
    resume_submission_id: Optional[UUID] = None
    scoring_result_id: Optional[UUID] = None
    recipient_email: str
    subject: Optional[str] = None
    body: Optional[str] = None
    template_used: Optional[str] = None
    sent_at: Optional[datetime] = None
    delivery_status: Optional[str] = None
    error_message: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True 