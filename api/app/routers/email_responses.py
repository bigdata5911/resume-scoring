from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models.email_response import EmailResponse
from app.schemas.email_response import EmailResponseResponse

router = APIRouter(prefix="/email-responses", tags=["email-responses"])


@router.get("/", response_model=List[EmailResponseResponse])
async def get_email_responses(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    """Get all email responses"""
    try:
        email_responses = db.query(EmailResponse).offset(skip).limit(limit).all()
        return email_responses
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching email responses: {str(e)}")


@router.get("/{email_response_id}", response_model=EmailResponseResponse)
async def get_email_response(
    email_response_id: str,
    db: Session = Depends(get_db)
):
    """Get a specific email response by ID"""
    try:
        email_response = db.query(EmailResponse).filter(EmailResponse.id == email_response_id).first()
        if not email_response:
            raise HTTPException(status_code=404, detail="Email response not found")
        return email_response
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching email response: {str(e)}") 