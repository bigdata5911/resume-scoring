from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.auth import get_current_active_user
from app.models.user import User
from app.models.email_template import EmailTemplate
from app.schemas.email_template import EmailTemplateCreate, EmailTemplateUpdate, EmailTemplateResponse

router = APIRouter(prefix="/email-templates", tags=["email-templates"])


@router.post("/", response_model=EmailTemplateResponse)
async def create_email_template(
    email_template: EmailTemplateCreate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Create a new email template"""
    db_email_template = EmailTemplate(
        user_id=current_user.id,
        name=email_template.name,
        subject_template=email_template.subject_template,
        body_template=email_template.body_template,
        is_default=email_template.is_default,
        recommendation_type=email_template.recommendation_type
    )
    
    db.add(db_email_template)
    db.commit()
    db.refresh(db_email_template)
    
    return db_email_template


@router.get("/", response_model=List[EmailTemplateResponse])
async def get_email_templates(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Get all email templates for the current user"""
    email_templates = db.query(EmailTemplate).filter(
        EmailTemplate.user_id == current_user.id
    ).all()
    
    return email_templates


@router.get("/{email_template_id}", response_model=EmailTemplateResponse)
async def get_email_template(
    email_template_id: str,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Get a specific email template"""
    email_template = db.query(EmailTemplate).filter(
        EmailTemplate.id == email_template_id,
        EmailTemplate.user_id == current_user.id
    ).first()
    
    if not email_template:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Email template not found"
        )
    
    return email_template


@router.put("/{email_template_id}", response_model=EmailTemplateResponse)
async def update_email_template(
    email_template_id: str,
    email_template_update: EmailTemplateUpdate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Update an email template"""
    db_email_template = db.query(EmailTemplate).filter(
        EmailTemplate.id == email_template_id,
        EmailTemplate.user_id == current_user.id
    ).first()
    
    if not db_email_template:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Email template not found"
        )
    
    update_data = email_template_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_email_template, field, value)
    
    db.commit()
    db.refresh(db_email_template)
    
    return db_email_template


@router.delete("/{email_template_id}")
async def delete_email_template(
    email_template_id: str,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Delete an email template"""
    db_email_template = db.query(EmailTemplate).filter(
        EmailTemplate.id == email_template_id,
        EmailTemplate.user_id == current_user.id
    ).first()
    
    if not db_email_template:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Email template not found"
        )
    
    db.delete(db_email_template)
    db.commit()
    
    return {"message": "Email template deleted successfully"} 