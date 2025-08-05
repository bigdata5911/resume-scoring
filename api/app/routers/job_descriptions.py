from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.auth import get_current_active_user
from app.models.user import User
from app.models.job_description import JobDescription, JobKeyword
from app.schemas.job_description import (
    JobDescriptionCreate, 
    JobDescriptionUpdate, 
    JobDescriptionResponse,
    JobKeywordCreate
)

router = APIRouter(prefix="/job-descriptions", tags=["job-descriptions"])


@router.post("/", response_model=JobDescriptionResponse)
async def create_job_description(
    job_description: JobDescriptionCreate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Create a new job description"""
    db_job_description = JobDescription(
        user_id=current_user.id,
        title=job_description.title,
        company=job_description.company,
        description=job_description.description,
        requirements=job_description.requirements,
        skills_required=job_description.skills_required,
        experience_level=job_description.experience_level,
        industry=job_description.industry,
        location=job_description.location,
        salary_range_min=job_description.salary_range_min,
        salary_range_max=job_description.salary_range_max
    )
    
    db.add(db_job_description)
    db.commit()
    db.refresh(db_job_description)
    
    # Add keywords if provided
    if job_description.keywords:
        for keyword_data in job_description.keywords:
            db_keyword = JobKeyword(
                job_description_id=db_job_description.id,
                keyword=keyword_data.keyword,
                category=keyword_data.category,
                weight=keyword_data.weight
            )
            db.add(db_keyword)
        
        db.commit()
        db.refresh(db_job_description)
    
    return db_job_description


@router.get("/", response_model=List[JobDescriptionResponse])
async def get_job_descriptions(
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Get all job descriptions for the current user"""
    job_descriptions = db.query(JobDescription).filter(
        JobDescription.user_id == current_user.id
    ).offset(skip).limit(limit).all()
    
    return job_descriptions


@router.get("/{job_description_id}", response_model=JobDescriptionResponse)
async def get_job_description(
    job_description_id: str,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Get a specific job description"""
    job_description = db.query(JobDescription).filter(
        JobDescription.id == job_description_id,
        JobDescription.user_id == current_user.id
    ).first()
    
    if not job_description:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Job description not found"
        )
    
    return job_description


@router.put("/{job_description_id}", response_model=JobDescriptionResponse)
async def update_job_description(
    job_description_id: str,
    job_description_update: JobDescriptionUpdate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Update a job description"""
    db_job_description = db.query(JobDescription).filter(
        JobDescription.id == job_description_id,
        JobDescription.user_id == current_user.id
    ).first()
    
    if not db_job_description:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Job description not found"
        )
    
    update_data = job_description_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_job_description, field, value)
    
    db.commit()
    db.refresh(db_job_description)
    
    return db_job_description


@router.delete("/{job_description_id}")
async def delete_job_description(
    job_description_id: str,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Delete a job description"""
    db_job_description = db.query(JobDescription).filter(
        JobDescription.id == job_description_id,
        JobDescription.user_id == current_user.id
    ).first()
    
    if not db_job_description:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Job description not found"
        )
    
    db.delete(db_job_description)
    db.commit()
    
    return {"message": "Job description deleted successfully"} 