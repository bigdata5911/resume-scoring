from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func, text
from datetime import datetime, timedelta
from typing import List, Dict, Any
from app.database import get_db
from app.models.resume_submission import ResumeSubmission
from app.models.scoring_result import ScoringResult
from app.models.email_response import EmailResponse
from app.models.processing_queue import ProcessingQueue

dashboard_router = APIRouter(prefix="/api/dashboard", tags=["dashboard"])


@dashboard_router.get("/metrics")
async def get_dashboard_metrics(db: Session = Depends(get_db)):
    """Get dashboard metrics"""
    try:
        # Get total submissions
        total_submissions = db.query(ResumeSubmission).count()
        
        # Get submissions from last month for comparison
        last_month = datetime.now() - timedelta(days=30)
        last_month_submissions = db.query(ResumeSubmission).filter(
            ResumeSubmission.created_at >= last_month
        ).count()
        
        # Calculate submissions change percentage
        submissions_change = 0
        if last_month_submissions > 0:
            submissions_change = ((total_submissions - last_month_submissions) / last_month_submissions) * 100
        
        # Get processing queue count
        processing_queue = db.query(ProcessingQueue).filter(
            ProcessingQueue.status.in_(["pending", "processing"])
        ).count()
        
        # Get average score
        avg_score_result = db.query(func.avg(ScoringResult.score)).scalar()
        average_score = round(avg_score_result, 1) if avg_score_result else 0
        
        # Get email responses count
        email_responses = db.query(EmailResponse).count()
        
        # Get email responses from last month for comparison
        last_month_emails = db.query(EmailResponse).filter(
            EmailResponse.created_at >= last_month
        ).count()
        
        # Calculate email change percentage
        email_change = 0
        if last_month_emails > 0:
            email_change = ((email_responses - last_month_emails) / last_month_emails) * 100
        
        # Calculate queue change (mock data for now)
        queue_change = 0
        
        # Calculate score change (mock data for now)
        score_change = 0
        
        return {
            "totalSubmissions": total_submissions,
            "submissionsChange": round(submissions_change, 1),
            "processingQueue": processing_queue,
            "queueChange": queue_change,
            "averageScore": average_score,
            "scoreChange": score_change,
            "emailResponses": email_responses,
            "emailChange": round(email_change, 1)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching metrics: {str(e)}")


@dashboard_router.get("/processing-stats")
async def get_processing_stats(db: Session = Depends(get_db)):
    """Get processing statistics for the last 7 days"""
    try:
        # Get data for the last 7 days
        end_date = datetime.now()
        start_date = end_date - timedelta(days=7)
        
        processing_stats = []
        
        for i in range(7):
            current_date = start_date + timedelta(days=i)
            next_date = current_date + timedelta(days=1)
            
            # Get submissions for this day
            submissions = db.query(ResumeSubmission).filter(
                ResumeSubmission.created_at >= current_date,
                ResumeSubmission.created_at < next_date
            ).count()
            
            # Get processed submissions (completed scoring results)
            processed = db.query(ScoringResult).join(ResumeSubmission).filter(
                ScoringResult.created_at >= current_date,
                ScoringResult.created_at < next_date
            ).count()
            
            # Calculate failed (submissions - processed)
            failed = max(0, submissions - processed)
            
            processing_stats.append({
                "date": current_date.strftime("%Y-%m-%d"),
                "submissions": submissions,
                "processed": processed,
                "failed": failed
            })
        
        return processing_stats
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching processing stats: {str(e)}")


@dashboard_router.get("/scoring-stats")
async def get_scoring_stats(db: Session = Depends(get_db)):
    """Get scoring statistics"""
    try:
        # Get score distribution
        score_ranges = [
            (90, 100, "90-100"),
            (80, 89, "80-89"),
            (70, 79, "70-79"),
            (60, 69, "60-69"),
            (0, 59, "0-59")
        ]
        
        distribution = []
        total_scored = 0
        
        for min_score, max_score, range_label in score_ranges:
            count = db.query(ScoringResult).filter(
                ScoringResult.score >= min_score,
                ScoringResult.score <= max_score
            ).count()
            
            total_scored += count
            
            if count > 0:
                distribution.append({
                    "score_range": range_label,
                    "count": count,
                    "percentage": 0  # Will calculate below
                })
        
        # Calculate percentages
        for item in distribution:
            if total_scored > 0:
                item["percentage"] = round((item["count"] / total_scored) * 100, 1)
        
        # Get score trends for the last 7 days
        end_date = datetime.now()
        start_date = end_date - timedelta(days=7)
        
        trends = []
        
        for i in range(7):
            current_date = start_date + timedelta(days=i)
            next_date = current_date + timedelta(days=1)
            
            # Get average score for this day
            avg_score_result = db.query(func.avg(ScoringResult.score)).filter(
                ScoringResult.created_at >= current_date,
                ScoringResult.created_at < next_date
            ).scalar()
            
            # Get total submissions for this day
            total_submissions = db.query(ScoringResult).filter(
                ScoringResult.created_at >= current_date,
                ScoringResult.created_at < next_date
            ).count()
            
            if avg_score_result and total_submissions > 0:
                trends.append({
                    "date": current_date.strftime("%Y-%m-%d"),
                    "average_score": round(avg_score_result, 1),
                    "total_submissions": total_submissions
                })
        
        return {
            "distribution": distribution,
            "trends": trends
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching scoring stats: {str(e)}") 