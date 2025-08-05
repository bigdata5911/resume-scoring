from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from uuid import UUID


class EmailTemplateBase(BaseModel):
    name: str
    subject_template: str
    body_template: str
    is_default: bool = False
    recommendation_type: Optional[str] = None


class EmailTemplateCreate(EmailTemplateBase):
    user_id: UUID


class EmailTemplateUpdate(BaseModel):
    name: Optional[str] = None
    subject_template: Optional[str] = None
    body_template: Optional[str] = None
    is_default: Optional[bool] = None
    recommendation_type: Optional[str] = None
    is_active: Optional[bool] = None


class EmailTemplateResponse(EmailTemplateBase):
    id: UUID
    user_id: UUID
    is_active: bool
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True 