from pydantic import BaseModel
from typing import Optional, Dict, Any, List
from datetime import datetime
from uuid import UUID


class ScoringResultResponse(BaseModel):
    id: UUID
    resume_submission_id: UUID
    job_description_id: Optional[UUID] = None
    
    # Overall Scores
    total_score: int
    confidence_level: Optional[float] = None
    
    # Category Scores
    job_match_score: Optional[int] = None
    experience_score: Optional[int] = None
    education_score: Optional[int] = None
    stability_score: Optional[int] = None
    presentation_score: Optional[int] = None
    
    # Recommendation
    recommendation: Optional[str] = None
    
    # Detailed Analysis
    keyword_matches: Optional[Dict[str, Any]] = None
    skill_gaps: Optional[Dict[str, Any]] = None
    experience_analysis: Optional[Dict[str, Any]] = None
    education_analysis: Optional[Dict[str, Any]] = None
    stability_analysis: Optional[Dict[str, Any]] = None
    
    # Red Flags
    red_flags: Optional[List[Dict[str, Any]]] = None
    red_flag_count: int = 0
    
    # LLM Response
    llm_analysis_text: Optional[str] = None
    
    created_at: datetime
    
    class Config:
        from_attributes = True 