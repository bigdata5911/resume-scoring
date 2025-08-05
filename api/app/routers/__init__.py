from .auth import router as auth_router
from .users import router as users_router
from .job_descriptions import router as job_descriptions_router
from .resume_submissions import router as resume_submissions_router
from .scoring_results import router as scoring_results_router
from .email_configs import router as email_configs_router
from .email_templates import router as email_templates_router

__all__ = [
    "auth_router",
    "users_router",
    "job_descriptions_router",
    "resume_submissions_router",
    "scoring_results_router",
    "email_configs_router",
    "email_templates_router"
] 