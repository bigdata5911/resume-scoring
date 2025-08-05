from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from app.config import settings
from app.database import engine, Base
from app.routers import (
    auth_router,
    users_router,
    job_descriptions_router,
    resume_submissions_router,
    scoring_results_router,
    email_configs_router,
    email_templates_router
)

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
app.include_router(auth_router)
app.include_router(users_router)
app.include_router(job_descriptions_router)
app.include_router(resume_submissions_router)
app.include_router(scoring_results_router)
app.include_router(email_configs_router)
app.include_router(email_templates_router)


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


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host=settings.host,
        port=settings.port,
        reload=settings.debug
    ) 