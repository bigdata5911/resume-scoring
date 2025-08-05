from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
from uuid import UUID


class JobKeywordBase(BaseModel):
    keyword: str
    category: Optional[str] = None
    weight: int = 1


class JobKeywordCreate(JobKeywordBase):
    pass


class JobKeywordResponse(JobKeywordBase):
    id: UUID
    job_description_id: UUID
    created_at: datetime
    
    class Config:
        from_attributes = True


class JobDescriptionBase(BaseModel):
    title: str
    company: str
    description: str
    requirements: Optional[str] = None
    skills_required: Optional[List[str]] = None
    experience_level: Optional[str] = None
    industry: Optional[str] = None
    location: Optional[str] = None
    salary_range_min: Optional[int] = None
    salary_range_max: Optional[int] = None


class JobDescriptionCreate(JobDescriptionBase):
    keywords: Optional[List[JobKeywordCreate]] = None


class JobDescriptionUpdate(BaseModel):
    title: Optional[str] = None
    company: Optional[str] = None
    description: Optional[str] = None
    requirements: Optional[str] = None
    skills_required: Optional[List[str]] = None
    experience_level: Optional[str] = None
    industry: Optional[str] = None
    location: Optional[str] = None
    salary_range_min: Optional[int] = None
    salary_range_max: Optional[int] = None
    is_active: Optional[bool] = None


class JobDescriptionResponse(JobDescriptionBase):
    id: UUID
    user_id: UUID
    is_active: bool
    created_at: datetime
    updated_at: datetime
    keywords: List[JobKeywordResponse] = []
    
    class Config:
        from_attributes = True 