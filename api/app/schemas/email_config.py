from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime
from uuid import UUID


class EmailConfigBase(BaseModel):
    email_address: EmailStr
    email_provider: str
    pop3_host: Optional[str] = None
    pop3_port: int = 995
    pop3_username: Optional[str] = None
    pop3_password: Optional[str] = None
    smtp_host: Optional[str] = None
    smtp_port: int = 587
    smtp_username: Optional[str] = None
    smtp_password: Optional[str] = None


class EmailConfigCreate(EmailConfigBase):
    user_id: UUID


class EmailConfigUpdate(BaseModel):
    email_address: Optional[EmailStr] = None
    email_provider: Optional[str] = None
    pop3_host: Optional[str] = None
    pop3_port: Optional[int] = None
    pop3_username: Optional[str] = None
    pop3_password: Optional[str] = None
    smtp_host: Optional[str] = None
    smtp_port: Optional[int] = None
    smtp_username: Optional[str] = None
    smtp_password: Optional[str] = None
    is_active: Optional[bool] = None


class EmailConfigResponse(EmailConfigBase):
    id: UUID
    user_id: UUID
    is_active: bool
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True 