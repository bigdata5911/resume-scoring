from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.auth import get_current_active_user
from app.models.user import User
from app.models.resume_submission import ResumeSubmission
from app.models.email_config import EmailConfig
from app.schemas.resume_submission import ResumeSubmissionResponse, ResumeSubmissionCreate

router = APIRouter(prefix="/resume-submissions", tags=["resume-submissions"])


@router.post("/", response_model=ResumeSubmissionResponse)
async def create_resume_submission(
    resume_submission: ResumeSubmissionCreate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Create a new resume submission"""
    # Verify email config belongs to current user
    email_config = db.query(EmailConfig).filter(
        EmailConfig.id == resume_submission.email_config_id,
        EmailConfig.user_id == current_user.id
    ).first()
    
    if not email_config:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Email configuration not found"
        )
    
    db_resume_submission = ResumeSubmission(
        email_config_id=resume_submission.email_config_id,
        job_description_id=resume_submission.job_description_id,
        candidate_email=resume_submission.candidate_email,
        candidate_name=resume_submission.candidate_name,
        position_applied=resume_submission.position_applied,
        original_email_subject=resume_submission.original_email_subject,
        original_email_body=resume_submission.original_email_body,
        attachment_filename=resume_submission.attachment_filename,
        attachment_path=resume_submission.attachment_path,
        file_size_bytes=resume_submission.file_size_bytes,
        file_type=resume_submission.file_type
    )
    
    db.add(db_resume_submission)
    db.commit()
    db.refresh(db_resume_submission)
    
    return db_resume_submission


@router.get("/", response_model=List[ResumeSubmissionResponse])
async def get_resume_submissions(
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Get all resume submissions for the current user"""
    resume_submissions = db.query(ResumeSubmission).join(EmailConfig).filter(
        EmailConfig.user_id == current_user.id
    ).offset(skip).limit(limit).all()
    
    return resume_submissions


@router.get("/{resume_submission_id}", response_model=ResumeSubmissionResponse)
async def get_resume_submission(
    resume_submission_id: str,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Get a specific resume submission"""
    resume_submission = db.query(ResumeSubmission).join(EmailConfig).filter(
        ResumeSubmission.id == resume_submission_id,
        EmailConfig.user_id == current_user.id
    ).first()
    
    if not resume_submission:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Resume submission not found"
        )
    
    return resume_submission


@router.delete("/{resume_submission_id}")
async def delete_resume_submission(
    resume_submission_id: str,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Delete a resume submission"""
    resume_submission = db.query(ResumeSubmission).join(EmailConfig).filter(
        ResumeSubmission.id == resume_submission_id,
        EmailConfig.user_id == current_user.id
    ).first()
    
    if not resume_submission:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Resume submission not found"
        )
    
    db.delete(resume_submission)
    db.commit()
    
    return {"message": "Resume submission deleted successfully"} 