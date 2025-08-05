from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.auth import get_current_active_user
from app.models.user import User
from app.models.email_config import EmailConfig
from app.schemas.email_config import EmailConfigCreate, EmailConfigUpdate, EmailConfigResponse

router = APIRouter(prefix="/email-configs", tags=["email-configs"])


@router.post("/", response_model=EmailConfigResponse)
async def create_email_config(
    email_config: EmailConfigCreate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Create a new email configuration"""
    db_email_config = EmailConfig(
        user_id=current_user.id,
        email_address=email_config.email_address,
        email_provider=email_config.email_provider,
        pop3_host=email_config.pop3_host,
        pop3_port=email_config.pop3_port,
        pop3_username=email_config.pop3_username,
        pop3_password=email_config.pop3_password,
        smtp_host=email_config.smtp_host,
        smtp_port=email_config.smtp_port,
        smtp_username=email_config.smtp_username,
        smtp_password=email_config.smtp_password
    )
    
    db.add(db_email_config)
    db.commit()
    db.refresh(db_email_config)
    
    return db_email_config


@router.get("/", response_model=List[EmailConfigResponse])
async def get_email_configs(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Get all email configurations for the current user"""
    email_configs = db.query(EmailConfig).filter(
        EmailConfig.user_id == current_user.id
    ).all()
    
    return email_configs


@router.get("/{email_config_id}", response_model=EmailConfigResponse)
async def get_email_config(
    email_config_id: str,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Get a specific email configuration"""
    email_config = db.query(EmailConfig).filter(
        EmailConfig.id == email_config_id,
        EmailConfig.user_id == current_user.id
    ).first()
    
    if not email_config:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Email configuration not found"
        )
    
    return email_config


@router.put("/{email_config_id}", response_model=EmailConfigResponse)
async def update_email_config(
    email_config_id: str,
    email_config_update: EmailConfigUpdate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Update an email configuration"""
    db_email_config = db.query(EmailConfig).filter(
        EmailConfig.id == email_config_id,
        EmailConfig.user_id == current_user.id
    ).first()
    
    if not db_email_config:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Email configuration not found"
        )
    
    update_data = email_config_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_email_config, field, value)
    
    db.commit()
    db.refresh(db_email_config)
    
    return db_email_config


@router.delete("/{email_config_id}")
async def delete_email_config(
    email_config_id: str,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Delete an email configuration"""
    db_email_config = db.query(EmailConfig).filter(
        EmailConfig.id == email_config_id,
        EmailConfig.user_id == current_user.id
    ).first()
    
    if not db_email_config:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Email configuration not found"
        )
    
    db.delete(db_email_config)
    db.commit()
    
    return {"message": "Email configuration deleted successfully"} 