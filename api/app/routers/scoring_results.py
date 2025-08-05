from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.auth import get_current_active_user
from app.models.user import User
from app.models.scoring_result import ScoringResult
from app.models.resume_submission import ResumeSubmission
from app.models.email_config import EmailConfig
from app.schemas.scoring_result import ScoringResultResponse

router = APIRouter(prefix="/scoring-results", tags=["scoring-results"])


@router.get("/", response_model=List[ScoringResultResponse])
async def get_scoring_results(
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Get all scoring results for the current user"""
    scoring_results = db.query(ScoringResult).join(ResumeSubmission).join(EmailConfig).filter(
        EmailConfig.user_id == current_user.id
    ).offset(skip).limit(limit).all()
    
    return scoring_results


@router.get("/{scoring_result_id}", response_model=ScoringResultResponse)
async def get_scoring_result(
    scoring_result_id: str,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Get a specific scoring result"""
    scoring_result = db.query(ScoringResult).join(ResumeSubmission).join(EmailConfig).filter(
        ScoringResult.id == scoring_result_id,
        EmailConfig.user_id == current_user.id
    ).first()
    
    if not scoring_result:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Scoring result not found"
        )
    
    return scoring_result


@router.get("/resume/{resume_submission_id}", response_model=List[ScoringResultResponse])
async def get_scoring_results_by_resume(
    resume_submission_id: str,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Get scoring results for a specific resume submission"""
    # Verify resume submission belongs to current user
    resume_submission = db.query(ResumeSubmission).join(EmailConfig).filter(
        ResumeSubmission.id == resume_submission_id,
        EmailConfig.user_id == current_user.id
    ).first()
    
    if not resume_submission:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Resume submission not found"
        )
    
    scoring_results = db.query(ScoringResult).filter(
        ScoringResult.resume_submission_id == resume_submission_id
    ).all()
    
    return scoring_results 