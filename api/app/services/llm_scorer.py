import json
from typing import Dict, List, Any, Optional
from openai import OpenAI
from app.config import settings


class LLMScorer:
    """Service for scoring resumes using LLM"""
    
    def __init__(self):
        self.client = OpenAI(api_key=settings.openai_api_key)
        self.model = settings.openai_model
        
        # Scoring weights
        self.weights = {
            'job_match': 30,
            'experience': 25,
            'education': 15,
            'stability': 20,
            'presentation': 10
        }
        
        # Recommendation thresholds
        self.thresholds = {
            'highly_recommended': 80,
            'recommended': 60,
            'consider_caution': 40
        }
    
    def score_resume(self, resume_data: Dict[str, Any], job_description: Dict[str, Any]) -> Dict[str, Any]:
        """Score a resume against a job description"""
        
        # Create prompt for LLM
        prompt = self._create_scoring_prompt(resume_data, job_description)
        
        try:
            # Call OpenAI API
            response = self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": "You are an expert HR recruiter and resume evaluator. Analyze the resume against the job description and provide detailed scoring."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.3,
                max_tokens=2000
            )
            
            # Parse LLM response
            llm_response = response.choices[0].message.content
            scoring_result = self._parse_llm_response(llm_response)
            
            # Calculate recommendation
            scoring_result['recommendation'] = self._get_recommendation(scoring_result['total_score'])
            
            return {
                **scoring_result,
                'llm_analysis_text': llm_response,
                'llm_prompt_used': prompt
            }
            
        except Exception as e:
            # Fallback scoring if LLM fails
            return self._fallback_scoring(resume_data, job_description)
    
    def _create_scoring_prompt(self, resume_data: Dict[str, Any], job_description: Dict[str, Any]) -> str:
        """Create a detailed prompt for LLM scoring"""
        
        prompt = f"""
Please analyze the following resume against the job description and provide a comprehensive scoring.

JOB DESCRIPTION:
Title: {job_description.get('title', 'N/A')}
Company: {job_description.get('company', 'N/A')}
Description: {job_description.get('description', 'N/A')}
Requirements: {job_description.get('requirements', 'N/A')}
Required Skills: {', '.join(job_description.get('skills_required', []))}
Experience Level: {job_description.get('experience_level', 'N/A')}

RESUME DATA:
Name: {resume_data.get('extracted_name', 'N/A')}
Email: {resume_data.get('extracted_email', 'N/A')}
Skills: {', '.join(resume_data.get('extracted_skills', []))}
Years of Experience: {resume_data.get('years_of_experience', 0)}
Experience Details: {json.dumps(resume_data.get('extracted_experience', []), indent=2)}
Education: {json.dumps(resume_data.get('extracted_education', []), indent=2)}
Certifications: {json.dumps(resume_data.get('extracted_certifications', []), indent=2)}
Raw Text: {resume_data.get('raw_text', '')[:2000]}...

Please provide a detailed analysis with the following scoring criteria (100-point scale):

1. Job Description Match (30 points):
   - Keyword alignment
   - Skills matching
   - Experience relevance
   - Industry background alignment

2. Experience Depth Assessment (25 points):
   - Years of experience in relevant skills
   - Progressive career growth
   - Leadership and management experience
   - Project complexity and scale

3. Education & Certifications (15 points):
   - Degree relevance to position
   - Educational institution ranking
   - Professional certifications
   - Continuous learning indicators

4. Career Stability (20 points):
   - Job tenure analysis
   - Career progression logic
   - Employment gap identification
   - Frequency of job changes

5. Overall Presentation (10 points):
   - Resume formatting and clarity
   - Grammar and language quality
   - Professional presentation
   - Completeness of information

Also identify any red flags such as:
- Frequent job changes (>3 jobs in 2 years)
- Employment gaps (>6 months)
- Skill misalignment
- Inconsistent information
- Over-qualification or under-qualification

Please respond with a JSON object containing:
{{
    "total_score": <0-100>,
    "confidence_level": <0.0-1.0>,
    "job_match_score": <0-30>,
    "experience_score": <0-25>,
    "education_score": <0-15>,
    "stability_score": <0-20>,
    "presentation_score": <0-10>,
    "keyword_matches": {{"matched": [], "missing": []}},
    "skill_gaps": {{"critical": [], "nice_to_have": []}},
    "experience_analysis": {{"strengths": [], "concerns": []}},
    "education_analysis": {{"relevance": "", "strengths": []}},
    "stability_analysis": {{"tenure": "", "gaps": [], "progression": ""}},
    "red_flags": [],
    "detailed_reasoning": ""
}}
"""
        return prompt
    
    def _parse_llm_response(self, response: str) -> Dict[str, Any]:
        """Parse LLM response and extract scoring data"""
        try:
            # Try to extract JSON from response
            start_idx = response.find('{')
            end_idx = response.rfind('}') + 1
            
            if start_idx != -1 and end_idx != 0:
                json_str = response[start_idx:end_idx]
                data = json.loads(json_str)
                
                # Ensure all required fields are present
                required_fields = [
                    'total_score', 'confidence_level', 'job_match_score',
                    'experience_score', 'education_score', 'stability_score',
                    'presentation_score'
                ]
                
                for field in required_fields:
                    if field not in data:
                        data[field] = 0
                
                return data
            else:
                raise ValueError("No JSON found in response")
                
        except (json.JSONDecodeError, ValueError) as e:
            # Fallback parsing
            return self._fallback_parsing(response)
    
    def _fallback_parsing(self, response: str) -> Dict[str, Any]:
        """Fallback parsing when JSON parsing fails"""
        # Extract scores using regex
        import re
        
        scores = {
            'total_score': 0,
            'confidence_level': 0.5,
            'job_match_score': 0,
            'experience_score': 0,
            'education_score': 0,
            'stability_score': 0,
            'presentation_score': 0,
            'keyword_matches': {"matched": [], "missing": []},
            'skill_gaps': {"critical": [], "nice_to_have": []},
            'experience_analysis': {"strengths": [], "concerns": []},
            'education_analysis': {"relevance": "", "strengths": []},
            'stability_analysis': {"tenure": "", "gaps": [], "progression": ""},
            'red_flags': [],
            'detailed_reasoning': response
        }
        
        # Try to extract scores from text
        score_patterns = {
            'total_score': r'total[_\s]?score[:\s]*(\d+)',
            'job_match_score': r'job[_\s]?match[:\s]*(\d+)',
            'experience_score': r'experience[:\s]*(\d+)',
            'education_score': r'education[:\s]*(\d+)',
            'stability_score': r'stability[:\s]*(\d+)',
            'presentation_score': r'presentation[:\s]*(\d+)'
        }
        
        for field, pattern in score_patterns.items():
            match = re.search(pattern, response, re.IGNORECASE)
            if match:
                scores[field] = int(match.group(1))
        
        return scores
    
    def _get_recommendation(self, total_score: int) -> str:
        """Get recommendation based on total score"""
        if total_score >= self.thresholds['highly_recommended']:
            return 'highly_recommended'
        elif total_score >= self.thresholds['recommended']:
            return 'recommended'
        elif total_score >= self.thresholds['consider_caution']:
            return 'consider_caution'
        else:
            return 'not_recommended'
    
    def _fallback_scoring(self, resume_data: Dict[str, Any], job_description: Dict[str, Any]) -> Dict[str, Any]:
        """Fallback scoring when LLM fails"""
        # Simple rule-based scoring
        total_score = 0
        job_match_score = 0
        experience_score = 0
        education_score = 0
        stability_score = 0
        presentation_score = 0
        
        # Job match scoring
        resume_skills = set(skill.lower() for skill in resume_data.get('extracted_skills', []))
        job_skills = set(skill.lower() for skill in job_description.get('skills_required', []))
        
        if job_skills:
            skill_match_ratio = len(resume_skills.intersection(job_skills)) / len(job_skills)
            job_match_score = int(skill_match_ratio * 30)
        
        # Experience scoring
        years_exp = resume_data.get('years_of_experience', 0)
        required_level = job_description.get('experience_level', 'entry')
        
        if required_level == 'entry' and years_exp >= 0:
            experience_score = min(25, years_exp * 5)
        elif required_level == 'mid' and years_exp >= 3:
            experience_score = min(25, (years_exp - 2) * 4)
        elif required_level == 'senior' and years_exp >= 7:
            experience_score = min(25, (years_exp - 6) * 3)
        else:
            experience_score = max(0, min(25, years_exp * 2))
        
        # Education scoring
        education = resume_data.get('extracted_education', [])
        if education:
            education_score = min(15, len(education) * 5)
        
        # Stability scoring (simplified)
        experience = resume_data.get('extracted_experience', [])
        if len(experience) <= 3:
            stability_score = 20
        elif len(experience) <= 5:
            stability_score = 15
        else:
            stability_score = 10
        
        # Presentation scoring
        raw_text = resume_data.get('raw_text', '')
        if len(raw_text) > 500:
            presentation_score = 10
        elif len(raw_text) > 200:
            presentation_score = 7
        else:
            presentation_score = 5
        
        total_score = job_match_score + experience_score + education_score + stability_score + presentation_score
        
        return {
            'total_score': total_score,
            'confidence_level': 0.3,  # Low confidence for fallback
            'job_match_score': job_match_score,
            'experience_score': experience_score,
            'education_score': education_score,
            'stability_score': stability_score,
            'presentation_score': presentation_score,
            'recommendation': self._get_recommendation(total_score),
            'keyword_matches': {"matched": list(resume_skills.intersection(job_skills)), "missing": list(job_skills - resume_skills)},
            'skill_gaps': {"critical": list(job_skills - resume_skills), "nice_to_have": []},
            'experience_analysis': {"strengths": [], "concerns": []},
            'education_analysis': {"relevance": "", "strengths": []},
            'stability_analysis': {"tenure": "", "gaps": [], "progression": ""},
            'red_flags': [],
            'llm_analysis_text': "Fallback scoring used due to LLM failure",
            'llm_prompt_used': "Fallback scoring"
        } 