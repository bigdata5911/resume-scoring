LLM-Based Resume Scoring System - Requirements Document
1. Project Overview
1.1 Purpose
Develop an automated resume scoring system that evaluates candidate resumes against job descriptions using Large Language Model (LLM) technology. The system will process resumes received via email, analyze them against predefined criteria, and automatically respond with scoring summaries.
1.2 Scope
• Email-based resume processing
• LLM-powered resume analysis and scoring
• Automated email response system
• Web-based dashboard for configuration and monitoring
2. Functional Requirements
2.1 Email Processing System
• Retrieve new emails: script will get the new emails from last-scrapped timestamp
• Attachment Extraction: Extract and process PDF, DOC, DOCX resume attachments
• Email Parsing: Extract relevant information from email body (position applied for, candidate details)
• File Validation: Validate file formats and sizes (max 10MB per attachment)
• Error Handling: Handle corrupted files, unsupported formats, and oversized attachments
2.2 Resume Analysis Engine
2.2.1 Core Scoring Criteria (100-point scale)
1. Job Description Match (30 points)
o Keyword alignment analysis
o Skills matching (technical and soft skills)
o Experience relevance scoring
o Industry background alignment
2. Experience Depth Assessment (25 points)
o Years of experience in relevant skills
o Progressive career growth
o Leadership and management experience
o Project complexity and scale
3. Education & Certifications (15 points)
o Degree relevance to position
o Educational institution ranking/recognition
o Professional certifications
o Continuous learning indicators
4. Career Stability (20 points)
o Job tenure analysis
o Career progression logic
o Employment gap identification
o Frequency of job changes
5. Overall Presentation (10 points)
o Resume formatting and clarity
o Grammar and language quality
o Professional presentation
o Completeness of information
2.2.2 Red Flag Detection System
• Frequent Job Changes: Flag candidates with >3 jobs in 2 years
• Employment Gaps: Identify unexplained gaps >6 months
• Skill Misalignment: Major disconnect between claimed skills and experience
• Inconsistent Information: Date overlaps, conflicting information
• Over-qualification: Significantly overqualified candidates (flight risk)
• Under-qualification: Missing critical requirements
2.3 LLM Integration Requirements
• Model Selection: Support for LLM provider (OpenAI GPT-4)
• Prompt Engineering: Sophisticated prompting system for consistent scoring
• Context Management: Handle long resumes and job descriptions efficiently
• Bias Mitigation: Implement fairness checks to avoid discriminatory scoring
• Confidence Scoring: Provide confidence levels for each assessment
2.4 Job Description Management
• JD Storage: Store and manage multiple job descriptions
• JD Parsing: Extract key requirements, skills, and qualifications
• Dynamic Matching: Match incoming resumes to appropriate job descriptions
2.5 Automated Response System
• Email Templates: Customizable response templates
• Score Summary: Generate human-readable scoring summaries
• Recommendation Categories: 
o Highly Recommended (80-100 points)
o Recommended (60-79 points)
o Consider with Caution (40-59 points)
o Not Recommended (<40 points)
• Detailed Breakdown: Provide scoring breakdown by category
• Next Steps: Include relevant next steps based on score
3. Integration Requirements
3.1 Email Configuration
• Support for email provider with pop3
• Multiple email account monitoring
• Customizable email parsing rules
