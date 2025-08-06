from fastapi import FastAPI, HTTPException, APIRouter
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from app.config import settings
from app.database import engine, Base, get_db
from app.routers import (
    auth_router,
    users_router,
    job_descriptions_router,
    resume_submissions_router,
    scoring_results_router,
    email_configs_router,
    email_templates_router,
    dashboard_router
)
import redis
import smtplib
from sqlalchemy import text

# Create database tables
Base.metadata.create_all(bind=engine)

# Create FastAPI app
app = FastAPI(
    title="Resume Scoring API",
    description="LLM-Based Resume Scoring System API",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure this properly for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Add trusted host middleware
app.add_middleware(
    TrustedHostMiddleware,
    allowed_hosts=["*"]  # Configure this properly for production
)

# Include routers
router = APIRouter(prefix="/api")
router.include_router(auth_router)
router.include_router(users_router)
router.include_router(job_descriptions_router)
router.include_router(resume_submissions_router)
router.include_router(scoring_results_router)
router.include_router(email_configs_router)
router.include_router(email_templates_router)
router.include_router(dashboard_router)

app.include_router(router)


@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "Resume Scoring API",
        "version": "1.0.0",
        "docs": "/docs"
    }


@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy"}


@app.get("/api/health/database")
async def database_health_check():
    """Database health check endpoint"""
    try:
        db = next(get_db())
        # Test database connection
        result = db.execute(text("SELECT 1"))
        result.fetchone()
        return {"status": "healthy", "message": "Database connection successful"}
    except Exception as e:
        raise HTTPException(status_code=503, detail=f"Database connection failed: {str(e)}")


@app.get("/api/health/redis")
async def redis_health_check():
    """Redis health check endpoint"""
    try:
        # Try to connect to Redis if configured
        if hasattr(settings, 'REDIS_URL') and settings.REDIS_URL:
            r = redis.from_url(settings.REDIS_URL)
            r.ping()
            return {"status": "healthy", "message": "Redis connection successful"}
        else:
            return {"status": "warning", "message": "Redis not configured"}
    except Exception as e:
        return {"status": "error", "message": f"Redis connection failed: {str(e)}"}


@app.get("/api/health/email")
async def email_health_check():
    """Email service health check endpoint"""
    try:
        # Check if email settings are configured
        if (hasattr(settings, 'SMTP_HOST') and settings.SMTP_HOST and 
            hasattr(settings, 'SMTP_USERNAME') and settings.SMTP_USERNAME):
            return {"status": "healthy", "message": "Email service configured"}
        else:
            return {"status": "warning", "message": "Email service not configured"}
    except Exception as e:
        return {"status": "error", "message": f"Email service check failed: {str(e)}"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host=settings.HOST, port=settings.PORT) 