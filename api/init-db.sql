-- Initialize database for Resume Scoring System
-- This script runs when PostgreSQL container starts for the first time

-- Create database if it doesn't exist
SELECT 'CREATE DATABASE resume_scoring'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'resume_scoring')\gexec

-- Connect to the database
\c resume_scoring;

-- Create extensions if needed
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create a function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create tables
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    role VARCHAR(50) DEFAULT 'user',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS email_configs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    email_address VARCHAR(255) NOT NULL,
    smtp_host VARCHAR(255) NOT NULL,
    smtp_port INTEGER NOT NULL,
    smtp_username VARCHAR(255) NOT NULL,
    smtp_password VARCHAR(255) NOT NULL,
    use_ssl BOOLEAN DEFAULT TRUE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS job_descriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    company VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    requirements TEXT,
    location VARCHAR(255),
    salary_range VARCHAR(100),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS job_keywords (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    job_description_id UUID REFERENCES job_descriptions(id) ON DELETE CASCADE,
    keyword VARCHAR(100) NOT NULL,
    weight DECIMAL(3,2) DEFAULT 1.0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS resume_submissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email_config_id UUID REFERENCES email_configs(id) ON DELETE SET NULL,
    job_description_id UUID REFERENCES job_descriptions(id) ON DELETE SET NULL,
    candidate_email VARCHAR(255) NOT NULL,
    candidate_name VARCHAR(255),
    file_path VARCHAR(500),
    file_name VARCHAR(255),
    file_size INTEGER,
    file_type VARCHAR(50),
    status VARCHAR(50) DEFAULT 'pending',
    processing_started_at TIMESTAMP,
    processing_completed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS parsed_resumes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    resume_submission_id UUID REFERENCES resume_submissions(id) ON DELETE CASCADE,
    full_name VARCHAR(255),
    email VARCHAR(255),
    phone VARCHAR(50),
    linkedin_url VARCHAR(500),
    skills TEXT,
    experience_years INTEGER,
    education TEXT,
    certifications TEXT,
    summary TEXT,
    raw_text TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS scoring_results (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    resume_submission_id UUID REFERENCES resume_submissions(id) ON DELETE CASCADE,
    job_description_id UUID REFERENCES job_descriptions(id) ON DELETE SET NULL,
    overall_score DECIMAL(5,2),
    technical_score DECIMAL(5,2),
    experience_score DECIMAL(5,2),
    education_score DECIMAL(5,2),
    skills_score DECIMAL(5,2),
    communication_score DECIMAL(5,2),
    red_flags TEXT,
    strengths TEXT,
    weaknesses TEXT,
    recommendation VARCHAR(50),
    llm_response TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS email_responses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    resume_submission_id UUID REFERENCES resume_submissions(id) ON DELETE CASCADE,
    scoring_result_id UUID REFERENCES scoring_results(id) ON DELETE SET NULL,
    recipient_email VARCHAR(255) NOT NULL,
    subject VARCHAR(255) NOT NULL,
    body TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    sent_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS email_templates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    subject VARCHAR(255) NOT NULL,
    body TEXT NOT NULL,
    template_type VARCHAR(50) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS system_config (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    config_key VARCHAR(255) UNIQUE NOT NULL,
    config_value TEXT,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS audit_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    action VARCHAR(255) NOT NULL,
    resource_type VARCHAR(100),
    resource_id UUID,
    details JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS processing_queue (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    resume_submission_id UUID REFERENCES resume_submissions(id) ON DELETE CASCADE,
    task_type VARCHAR(100) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    priority INTEGER DEFAULT 0,
    retry_count INTEGER DEFAULT 0,
    max_retries INTEGER DEFAULT 3,
    scheduled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    started_at TIMESTAMP,
    completed_at TIMESTAMP,
    error_message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_resume_submissions_status ON resume_submissions(status);
CREATE INDEX IF NOT EXISTS idx_resume_submissions_created_at ON resume_submissions(created_at);
CREATE INDEX IF NOT EXISTS idx_scoring_results_overall_score ON scoring_results(overall_score);
CREATE INDEX IF NOT EXISTS idx_audit_log_created_at ON audit_log(created_at);
CREATE INDEX IF NOT EXISTS idx_processing_queue_status ON processing_queue(status);
CREATE INDEX IF NOT EXISTS idx_processing_queue_scheduled_at ON processing_queue(scheduled_at);

-- Create triggers for updated_at columns
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_email_configs_updated_at BEFORE UPDATE ON email_configs
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_job_descriptions_updated_at BEFORE UPDATE ON job_descriptions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_resume_submissions_updated_at BEFORE UPDATE ON resume_submissions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_parsed_resumes_updated_at BEFORE UPDATE ON parsed_resumes
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_scoring_results_updated_at BEFORE UPDATE ON scoring_results
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_email_responses_updated_at BEFORE UPDATE ON email_responses
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_email_templates_updated_at BEFORE UPDATE ON email_templates
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_system_config_updated_at BEFORE UPDATE ON system_config
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_processing_queue_updated_at BEFORE UPDATE ON processing_queue
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data

-- Sample users
INSERT INTO users (id, email, password_hash, first_name, last_name, role) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'admin@company.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/HS.i8m.', 'Admin', 'User', 'admin'),
('550e8400-e29b-41d4-a716-446655440002', 'hr@company.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/HS.i8m.', 'HR', 'Manager', 'user'),
('550e8400-e29b-41d4-a716-446655440003', 'recruiter@company.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/HS.i8m.', 'John', 'Recruiter', 'user')
ON CONFLICT (email) DO NOTHING;

-- Sample email configs
INSERT INTO email_configs (id, user_id, email_address, smtp_host, smtp_port, smtp_username, smtp_password) VALUES
('550e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440001', 'hr@company.com', 'smtp.gmail.com', 587, 'hr@company.com', 'app_password_here')
ON CONFLICT DO NOTHING;

-- Sample job descriptions
INSERT INTO job_descriptions (id, user_id, title, company, description, requirements, location, salary_range) VALUES
('550e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440001', 'Senior Python Developer', 'TechCorp', 
'We are looking for a Senior Python Developer to join our team. You will be responsible for developing and maintaining high-quality software solutions.',
'5+ years of Python experience, FastAPI, PostgreSQL, Docker, AWS', 'Remote', '$80,000 - $120,000'),
('550e8400-e29b-41d4-a716-446655440006', '550e8400-e29b-41d4-a716-446655440001', 'Data Scientist', 'DataCorp', 
'Join our data science team to build machine learning models and analyze complex datasets.',
'3+ years ML experience, Python, TensorFlow, SQL, Statistics', 'New York', '$90,000 - $130,000'),
('550e8400-e29b-41d4-a716-446655440007', '550e8400-e29b-41d4-a716-446655440001', 'Frontend Developer', 'WebCorp', 
'We need a talented Frontend Developer to create beautiful and responsive user interfaces.',
'3+ years React/Vue experience, JavaScript, CSS, HTML', 'San Francisco', '$70,000 - $110,000')
ON CONFLICT DO NOTHING;

-- Sample job keywords
INSERT INTO job_keywords (job_description_id, keyword, weight) VALUES
('550e8400-e29b-41d4-a716-446655440005', 'Python', 1.0),
('550e8400-e29b-41d4-a716-446655440005', 'FastAPI', 0.9),
('550e8400-e29b-41d4-a716-446655440005', 'PostgreSQL', 0.8),
('550e8400-e29b-41d4-a716-446655440005', 'Docker', 0.7),
('550e8400-e29b-41d4-a716-446655440005', 'AWS', 0.6),
('550e8400-e29b-41d4-a716-446655440006', 'Python', 1.0),
('550e8400-e29b-41d4-a716-446655440006', 'Machine Learning', 0.9),
('550e8400-e29b-41d4-a716-446655440006', 'TensorFlow', 0.8),
('550e8400-e29b-41d4-a716-446655440006', 'SQL', 0.7),
('550e8400-e29b-41d4-a716-446655440007', 'React', 1.0),
('550e8400-e29b-41d4-a716-446655440007', 'JavaScript', 0.9),
('550e8400-e29b-41d4-a716-446655440007', 'CSS', 0.8),
('550e8400-e29b-41d4-a716-446655440007', 'HTML', 0.7)
ON CONFLICT DO NOTHING;

-- Sample resume submissions
INSERT INTO resume_submissions (id, email_config_id, job_description_id, candidate_email, candidate_name, file_name, file_size, file_type, status) VALUES
('550e8400-e29b-41d4-a716-446655440008', '550e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440005', 'john.doe@email.com', 'John Doe', 'john_doe_resume.pdf', 2048576, 'pdf', 'completed'),
('550e8400-e29b-41d4-a716-446655440009', '550e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440006', 'jane.smith@email.com', 'Jane Smith', 'jane_smith_resume.pdf', 1536000, 'pdf', 'completed'),
('550e8400-e29b-41d4-a716-446655440010', '550e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440007', 'mike.johnson@email.com', 'Mike Johnson', 'mike_johnson_resume.docx', 1024000, 'docx', 'pending')
ON CONFLICT DO NOTHING;

-- Sample parsed resumes
INSERT INTO parsed_resumes (id, resume_submission_id, full_name, email, phone, linkedin_url, skills, experience_years, education, summary) VALUES
('550e8400-e29b-41d4-a716-446655440011', '550e8400-e29b-41d4-a716-446655440008', 'John Doe', 'john.doe@email.com', '+1-555-0123', 'linkedin.com/in/johndoe', 
'Python, FastAPI, PostgreSQL, Docker, AWS, Git, REST APIs', 6, 'BS Computer Science, University of Technology', 
'Experienced Python developer with 6 years of experience in web development and cloud technologies.'),
('550e8400-e29b-41d4-a716-446655440012', '550e8400-e29b-41d4-a716-446655440009', 'Jane Smith', 'jane.smith@email.com', '+1-555-0456', 'linkedin.com/in/janesmith', 
'Python, Machine Learning, TensorFlow, SQL, Pandas, Scikit-learn', 4, 'MS Data Science, Stanford University', 
'Data scientist with expertise in machine learning and statistical analysis.')
ON CONFLICT DO NOTHING;

-- Sample scoring results
INSERT INTO scoring_results (id, resume_submission_id, job_description_id, overall_score, technical_score, experience_score, education_score, skills_score, communication_score, red_flags, strengths, weaknesses, recommendation) VALUES
('550e8400-e29b-41d4-a716-446655440013', '550e8400-e29b-41d4-a716-446655440008', '550e8400-e29b-41d4-a716-446655440005', 85.5, 90.0, 88.0, 85.0, 87.0, 82.0, 
'None identified', 'Strong Python experience, Good FastAPI knowledge, Cloud experience with AWS', 'Could improve documentation skills', 'Strongly Recommend'),
('550e8400-e29b-41d4-a716-446655440014', '550e8400-e29b-41d4-a716-446655440009', '550e8400-e29b-41d4-a716-446655440006', 92.0, 95.0, 90.0, 95.0, 94.0, 88.0, 
'None identified', 'Excellent ML background, Strong academic credentials, Relevant experience', 'Could benefit from more production experience', 'Strongly Recommend')
ON CONFLICT DO NOTHING;

-- Sample email templates
INSERT INTO email_templates (id, user_id, name, subject, body, template_type) VALUES
('550e8400-e29b-41d4-a716-446655440015', '550e8400-e29b-41d4-a716-446655440001', 'Strong Recommendation', 
'Thank you for your application - Strong Candidate', 
'Dear {candidate_name},\n\nThank you for your application for the {position} role at {company}.\n\nWe are pleased to inform you that your application has been reviewed favorably. Your background and experience align well with our requirements.\n\nWe would like to proceed with the next steps in our hiring process. Our HR team will contact you within the next few days to schedule an interview.\n\nBest regards,\n{company} HR Team', 'strong_recommend'),
('550e8400-e29b-41d4-a716-446655440016', '550e8400-e29b-41d4-a716-446655440001', 'Consider Recommendation', 
'Thank you for your application - Under Consideration', 
'Dear {candidate_name},\n\nThank you for your application for the {position} role at {company}.\n\nYour application is currently under review. While we see some potential, we would like to gather additional information before making a decision.\n\nWe will contact you within the next week with an update on your application status.\n\nBest regards,\n{company} HR Team', 'consider'),
('550e8400-e29b-41d4-a716-446655440017', '550e8400-e29b-41d4-a716-446655440001', 'Not Recommended', 
'Thank you for your application', 
'Dear {candidate_name},\n\nThank you for your interest in the {position} role at {company} and for taking the time to submit your application.\n\nAfter careful review of your qualifications and experience, we regret to inform you that we will not be moving forward with your application at this time.\n\nWe appreciate your interest in joining our team and wish you the best in your future endeavors.\n\nBest regards,\n{company} HR Team', 'not_recommend')
ON CONFLICT DO NOTHING;

-- Sample system config
INSERT INTO system_config (config_key, config_value, description) VALUES
('default_max_file_size', '10485760', 'Default maximum file size for resume uploads (10MB)'),
('allowed_file_types', 'pdf,docx,doc', 'Allowed file types for resume uploads'),
('scoring_threshold_strong', '80', 'Score threshold for strong recommendation'),
('scoring_threshold_consider', '60', 'Score threshold for consider recommendation'),
('email_auto_send', 'true', 'Whether to automatically send emails after scoring'),
('openai_model', 'gpt-4', 'Default OpenAI model for resume scoring'),
('max_processing_time', '300', 'Maximum processing time for resume analysis (seconds)')
ON CONFLICT (config_key) DO NOTHING;

-- Sample audit log entries
INSERT INTO audit_log (user_id, action, resource_type, resource_id, details, ip_address) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'LOGIN', 'user', '550e8400-e29b-41d4-a716-446655440001', '{"ip": "192.168.1.100"}', '192.168.1.100'),
('550e8400-e29b-41d4-a716-446655440001', 'CREATE', 'job_description', '550e8400-e29b-41d4-a716-446655440005', '{"title": "Senior Python Developer"}', '192.168.1.100'),
('550e8400-e29b-41d4-a716-446655440001', 'UPLOAD', 'resume_submission', '550e8400-e29b-41d4-a716-446655440008', '{"file_name": "john_doe_resume.pdf"}', '192.168.1.100')
ON CONFLICT DO NOTHING;

-- Grant necessary permissions
GRANT ALL PRIVILEGES ON DATABASE resume_scoring TO postgres;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO postgres;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO postgres;

-- Set timezone
SET timezone = 'UTC'; 