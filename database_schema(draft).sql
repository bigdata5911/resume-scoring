-- LLM-Based Resume Scoring System Database Schema
-- PostgreSQL Database Design

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users and Authentication
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'user', -- admin, user, viewer
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Email Configuration
CREATE TABLE email_configs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    email_address VARCHAR(255) NOT NULL,
    email_provider VARCHAR(50) NOT NULL, -- gmail, outlook, custom
    pop3_host VARCHAR(255),
    pop3_port INTEGER DEFAULT 995,
    pop3_username VARCHAR(255),
    pop3_password VARCHAR(255),
    smtp_host VARCHAR(255),
    smtp_port INTEGER DEFAULT 587,
    smtp_username VARCHAR(255),
    smtp_password VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Job Descriptions
CREATE TABLE job_descriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    company VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    requirements TEXT,
    skills_required TEXT[], -- Array of required skills
    experience_level VARCHAR(50), -- entry, mid, senior, executive
    industry VARCHAR(100),
    location VARCHAR(255),
    salary_range_min INTEGER,
    salary_range_max INTEGER,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Keywords and Skills for Job Descriptions
CREATE TABLE job_keywords (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    job_description_id UUID REFERENCES job_descriptions(id) ON DELETE CASCADE,
    keyword VARCHAR(255) NOT NULL,
    category VARCHAR(100), -- technical, soft_skill, tool, certification
    weight INTEGER DEFAULT 1, -- Importance weight (1-10)
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Resume Submissions
CREATE TABLE resume_submissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email_config_id UUID REFERENCES email_configs(id) ON DELETE CASCADE,
    job_description_id UUID REFERENCES job_descriptions(id),
    candidate_email VARCHAR(255) NOT NULL,
    candidate_name VARCHAR(255),
    position_applied VARCHAR(255),
    original_email_subject VARCHAR(500),
    original_email_body TEXT,
    attachment_filename VARCHAR(255),
    attachment_path VARCHAR(500),
    file_size_bytes BIGINT,
    file_type VARCHAR(50), -- pdf, doc, docx
    status VARCHAR(50) DEFAULT 'pending', -- pending, processing, completed, failed
    processing_started_at TIMESTAMP WITH TIME ZONE,
    processing_completed_at TIMESTAMP WITH TIME ZONE,
    error_message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Parsed Resume Data
CREATE TABLE parsed_resumes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    resume_submission_id UUID REFERENCES resume_submissions(id) ON DELETE CASCADE,
    raw_text TEXT,
    extracted_name VARCHAR(255),
    extracted_email VARCHAR(255),
    extracted_phone VARCHAR(50),
    extracted_linkedin VARCHAR(255),
    extracted_skills TEXT[],
    extracted_experience JSONB, -- Structured experience data
    extracted_education JSONB, -- Structured education data
    extracted_certifications JSONB,
    years_of_experience INTEGER,
    parsed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Scoring Results
CREATE TABLE scoring_results (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    resume_submission_id UUID REFERENCES resume_submissions(id) ON DELETE CASCADE,
    job_description_id UUID REFERENCES job_descriptions(id),
    
    -- Overall Scores
    total_score INTEGER NOT NULL, -- 0-100
    confidence_level DECIMAL(3,2), -- 0.00-1.00
    
    -- Category Scores
    job_match_score INTEGER, -- 0-30
    experience_score INTEGER, -- 0-25
    education_score INTEGER, -- 0-15
    stability_score INTEGER, -- 0-20
    presentation_score INTEGER, -- 0-10
    
    -- Recommendation
    recommendation VARCHAR(50), -- highly_recommended, recommended, consider_caution, not_recommended
    
    -- Detailed Analysis
    keyword_matches JSONB, -- Detailed keyword analysis
    skill_gaps JSONB, -- Missing skills analysis
    experience_analysis JSONB, -- Experience depth analysis
    education_analysis JSONB, -- Education relevance
    stability_analysis JSONB, -- Job stability analysis
    
    -- Red Flags
    red_flags JSONB, -- Array of detected red flags
    red_flag_count INTEGER DEFAULT 0,
    
    -- LLM Response
    llm_analysis_text TEXT, -- Full LLM analysis
    llm_prompt_used TEXT, -- The prompt that was used
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Email Responses
CREATE TABLE email_responses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    resume_submission_id UUID REFERENCES resume_submissions(id) ON DELETE CASCADE,
    scoring_result_id UUID REFERENCES scoring_results(id) ON DELETE CASCADE,
    recipient_email VARCHAR(255) NOT NULL,
    subject VARCHAR(500),
    body TEXT,
    template_used VARCHAR(100),
    sent_at TIMESTAMP WITH TIME ZONE,
    delivery_status VARCHAR(50), -- sent, delivered, failed
    error_message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Email Templates
CREATE TABLE email_templates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    subject_template VARCHAR(500) NOT NULL,
    body_template TEXT NOT NULL,
    is_default BOOLEAN DEFAULT FALSE,
    recommendation_type VARCHAR(50), -- highly_recommended, recommended, consider_caution, not_recommended
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- System Configuration
CREATE TABLE system_config (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    config_key VARCHAR(255) UNIQUE NOT NULL,
    config_value TEXT,
    description TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Audit Log
CREATE TABLE audit_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id),
    action VARCHAR(100) NOT NULL,
    resource_type VARCHAR(50), -- resume, job_description, scoring, etc.
    resource_id UUID,
    details JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Processing Queue
CREATE TABLE processing_queue (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    resume_submission_id UUID REFERENCES resume_submissions(id) ON DELETE CASCADE,
    priority INTEGER DEFAULT 0,
    status VARCHAR(50) DEFAULT 'queued', -- queued, processing, completed, failed
    retry_count INTEGER DEFAULT 0,
    max_retries INTEGER DEFAULT 3,
    scheduled_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    error_message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for Performance
CREATE INDEX idx_resume_submissions_email_config ON resume_submissions(email_config_id);
CREATE INDEX idx_resume_submissions_job_description ON resume_submissions(job_description_id);
CREATE INDEX idx_resume_submissions_status ON resume_submissions(status);
CREATE INDEX idx_resume_submissions_created_at ON resume_submissions(created_at);

CREATE INDEX idx_scoring_results_resume_submission ON scoring_results(resume_submission_id);
CREATE INDEX idx_scoring_results_job_description ON scoring_results(job_description_id);
CREATE INDEX idx_scoring_results_total_score ON scoring_results(total_score);
CREATE INDEX idx_scoring_results_recommendation ON scoring_results(recommendation);

CREATE INDEX idx_parsed_resumes_resume_submission ON parsed_resumes(resume_submission_id);

CREATE INDEX idx_job_keywords_job_description ON job_keywords(job_description_id);
CREATE INDEX idx_job_keywords_keyword ON job_keywords(keyword);

CREATE INDEX idx_processing_queue_status ON processing_queue(status);
CREATE INDEX idx_processing_queue_scheduled_at ON processing_queue(scheduled_at);

CREATE INDEX idx_audit_log_user_id ON audit_log(user_id);
CREATE INDEX idx_audit_log_created_at ON audit_log(created_at);
CREATE INDEX idx_audit_log_action ON audit_log(action);

-- Triggers for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_email_configs_updated_at BEFORE UPDATE ON email_configs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_job_descriptions_updated_at BEFORE UPDATE ON job_descriptions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_resume_submissions_updated_at BEFORE UPDATE ON resume_submissions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_email_templates_updated_at BEFORE UPDATE ON email_templates FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_system_config_updated_at BEFORE UPDATE ON system_config FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert default system configurations
INSERT INTO system_config (config_key, config_value, description) VALUES
('max_file_size_mb', '10', 'Maximum file size in MB for resume attachments'),
('supported_file_types', 'pdf,doc,docx', 'Comma-separated list of supported file types'),
('llm_model', 'gpt-4', 'Default LLM model to use for analysis'),
('scoring_weights', '{"job_match": 30, "experience": 25, "education": 15, "stability": 20, "presentation": 10}', 'JSON object with scoring weights'),
('red_flag_thresholds', '{"job_changes_2_years": 3, "employment_gap_months": 6}', 'JSON object with red flag thresholds'),
('recommendation_thresholds', '{"highly_recommended": 80, "recommended": 60, "consider_caution": 40}', 'JSON object with recommendation score thresholds'); 