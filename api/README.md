# Resume Scoring API

A FastAPI-based backend system for LLM-powered resume scoring and analysis. This system processes resumes received via email, analyzes them against job descriptions using OpenAI's GPT-4, and provides automated scoring and response generation.

## Features

- **Email Processing**: POP3/SMTP integration for automated resume collection
- **Resume Parsing**: Extract structured data from PDF, DOC, and DOCX files
- **LLM Scoring**: AI-powered resume analysis using OpenAI GPT-4
- **Job Description Management**: Store and manage multiple job descriptions
- **Automated Responses**: Generate and send scoring summaries via email
- **User Management**: Multi-user system with role-based access
- **Audit Logging**: Track all system activities
- **RESTful API**: Complete CRUD operations for all entities

## Technology Stack

- **Framework**: FastAPI
- **Database**: PostgreSQL
- **ORM**: SQLAlchemy
- **Authentication**: JWT with bcrypt
- **AI/ML**: OpenAI GPT-4
- **File Processing**: PyPDF2, python-docx
- **Email**: smtplib, poplib
- **Documentation**: Auto-generated OpenAPI/Swagger

## Project Structure

```
api/
├── app/
│   ├── __init__.py
│   ├── config.py              # Configuration settings
│   ├── database.py            # Database connection
│   ├── auth.py               # Authentication utilities
│   ├── models/               # SQLAlchemy models
│   │   ├── __init__.py
│   │   ├── user.py
│   │   ├── email_config.py
│   │   ├── job_description.py
│   │   ├── resume_submission.py
│   │   ├── parsed_resume.py
│   │   ├── scoring_result.py
│   │   ├── email_response.py
│   │   ├── email_template.py
│   │   ├── system_config.py
│   │   ├── audit_log.py
│   │   └── processing_queue.py
│   ├── schemas/              # Pydantic schemas
│   │   ├── __init__.py
│   │   ├── user.py
│   │   ├── job_description.py
│   │   ├── resume_submission.py
│   │   ├── scoring_result.py
│   │   ├── email_config.py
│   │   └── email_template.py
│   ├── routers/              # API endpoints
│   │   ├── __init__.py
│   │   ├── auth.py
│   │   ├── users.py
│   │   ├── job_descriptions.py
│   │   ├── resume_submissions.py
│   │   ├── scoring_results.py
│   │   ├── email_configs.py
│   │   └── email_templates.py
│   └── services/             # Business logic
│       ├── __init__.py
│       ├── resume_parser.py
│       ├── llm_scorer.py
│       ├── email_processor.py
│       └── file_processor.py
├── main.py                   # FastAPI application
├── requirements.txt          # Python dependencies
├── env_example.txt          # Environment variables template
└── README.md               # This file
```

## Installation

### Prerequisites

- Python 3.8+
- PostgreSQL 12+
- Redis (for Celery tasks - optional)

### Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd resume-scoring-001/api
   ```

2. **Create virtual environment**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Set up environment variables**
   ```bash
   cp env_example.txt .env
   # Edit .env with your configuration
   ```

5. **Set up PostgreSQL database**
   ```sql
   CREATE DATABASE resume_scoring_db;
   ```

6. **Run database migrations**
   ```bash
   # The application will create tables automatically on startup
   # Or you can run the SQL schema manually
   ```

7. **Start the application**
   ```bash
   python main.py
   ```

## Configuration

### Environment Variables

Copy `env_example.txt` to `.env` and configure:

```env
# Database
DATABASE_URL=postgresql://username:password@localhost:5432/resume_scoring_db

# Security
SECRET_KEY=your-secret-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# OpenAI
OPENAI_API_KEY=your-openai-api-key-here
OPENAI_MODEL=gpt-4

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=your-email@gmail.com
SMTP_PASSWORD=your-app-password

# Redis (optional)
REDIS_URL=redis://localhost:6379/0

# File Upload
UPLOAD_DIR=uploads
MAX_FILE_SIZE=10485760

# Application
DEBUG=True
HOST=0.0.0.0
PORT=8000
```

## API Endpoints

### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login and get access token

### Users
- `GET /users/me` - Get current user info
- `PUT /users/me` - Update current user
- `GET /users/` - Get all users (admin only)
- `GET /users/{user_id}` - Get user by ID (admin only)

### Job Descriptions
- `POST /job-descriptions/` - Create job description
- `GET /job-descriptions/` - Get user's job descriptions
- `GET /job-descriptions/{id}` - Get specific job description
- `PUT /job-descriptions/{id}` - Update job description
- `DELETE /job-descriptions/{id}` - Delete job description

### Resume Submissions
- `POST /resume-submissions/` - Create resume submission
- `GET /resume-submissions/` - Get user's resume submissions
- `GET /resume-submissions/{id}` - Get specific submission
- `DELETE /resume-submissions/{id}` - Delete submission

### Scoring Results
- `GET /scoring-results/` - Get user's scoring results
- `GET /scoring-results/{id}` - Get specific scoring result
- `GET /scoring-results/resume/{resume_id}` - Get results for resume

### Email Configurations
- `POST /email-configs/` - Create email configuration
- `GET /email-configs/` - Get user's email configs
- `GET /email-configs/{id}` - Get specific email config
- `PUT /email-configs/{id}` - Update email config
- `DELETE /email-configs/{id}` - Delete email config

### Email Templates
- `POST /email-templates/` - Create email template
- `GET /email-templates/` - Get user's email templates
- `GET /email-templates/{id}` - Get specific template
- `PUT /email-templates/{id}` - Update template
- `DELETE /email-templates/{id}` - Delete template

## Database Schema

The system uses PostgreSQL with the following main tables:

- **users** - User accounts and authentication
- **email_configs** - Email server configurations
- **job_descriptions** - Job postings and requirements
- **resume_submissions** - Incoming resume data
- **parsed_resumes** - Extracted resume information
- **scoring_results** - LLM analysis results
- **email_responses** - Sent email responses
- **email_templates** - Email response templates
- **audit_log** - System activity tracking
- **processing_queue** - Background task queue

## Scoring System

The resume scoring system evaluates candidates on a 100-point scale across five categories:

1. **Job Description Match (30 points)**
   - Keyword alignment
   - Skills matching
   - Experience relevance
   - Industry background

2. **Experience Depth Assessment (25 points)**
   - Years of relevant experience
   - Career progression
   - Leadership experience
   - Project complexity

3. **Education & Certifications (15 points)**
   - Degree relevance
   - Institution quality
   - Professional certifications
   - Continuous learning

4. **Career Stability (20 points)**
   - Job tenure analysis
   - Employment gaps
   - Job change frequency
   - Career progression logic

5. **Overall Presentation (10 points)**
   - Resume formatting
   - Grammar and language
   - Professional presentation
   - Information completeness

### Recommendation Categories

- **Highly Recommended (80-100 points)**
- **Recommended (60-79 points)**
- **Consider with Caution (40-59 points)**
- **Not Recommended (<40 points)**

## Usage Examples

### 1. Register a User
```bash
curl -X POST "http://localhost:8000/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "securepassword",
    "first_name": "John",
    "last_name": "Doe",
    "role": "user"
  }'
```

### 2. Login and Get Token
```bash
curl -X POST "http://localhost:8000/auth/login" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=user@example.com&password=securepassword"
```

### 3. Create Job Description
```bash
curl -X POST "http://localhost:8000/job-descriptions/" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Senior Python Developer",
    "company": "Tech Corp",
    "description": "We are looking for an experienced Python developer...",
    "requirements": "5+ years of Python experience...",
    "skills_required": ["Python", "Django", "PostgreSQL"],
    "experience_level": "senior"
  }'
```

## Development

### Running in Development Mode
```bash
python main.py
```

The API will be available at:
- **API**: http://localhost:8000
- **Documentation**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

### Testing
```bash
# Install test dependencies
pip install pytest httpx

# Run tests
pytest
```

### Code Quality
```bash
# Install linting tools
pip install black flake8 isort

# Format code
black app/
isort app/

# Check code quality
flake8 app/
```

## Deployment

### Production Considerations

1. **Security**
   - Use strong SECRET_KEY
   - Configure CORS properly
   - Set up HTTPS
   - Use environment variables for secrets

2. **Database**
   - Use connection pooling
   - Set up database backups
   - Configure proper indexes

3. **Performance**
   - Use Redis for caching
   - Set up Celery for background tasks
   - Configure proper logging

4. **Monitoring**
   - Set up application monitoring
   - Configure error tracking
   - Set up health checks

### Docker Deployment
```dockerfile
FROM python:3.9-slim

WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .
EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please open an issue on the repository. 