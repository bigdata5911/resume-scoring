import re
from typing import Dict, List, Any, Optional
from datetime import datetime
import PyPDF2
from docx import Document
import io


class ResumeParser:
    """Service for parsing resume files and extracting structured information"""
    
    def __init__(self):
        self.supported_formats = ['pdf', 'doc', 'docx']
    
    def parse_resume(self, file_content: bytes, file_type: str) -> Dict[str, Any]:
        """Parse resume file and extract structured information"""
        if file_type.lower() not in self.supported_formats:
            raise ValueError(f"Unsupported file type: {file_type}")
        
        # Extract raw text
        raw_text = self._extract_text(file_content, file_type)
        
        # Parse structured information
        parsed_data = {
            'raw_text': raw_text,
            'extracted_name': self._extract_name(raw_text),
            'extracted_email': self._extract_email(raw_text),
            'extracted_phone': self._extract_phone(raw_text),
            'extracted_linkedin': self._extract_linkedin(raw_text),
            'extracted_skills': self._extract_skills(raw_text),
            'extracted_experience': self._extract_experience(raw_text),
            'extracted_education': self._extract_education(raw_text),
            'extracted_certifications': self._extract_certifications(raw_text),
            'years_of_experience': self._calculate_years_experience(raw_text)
        }
        
        return parsed_data
    
    def _extract_text(self, file_content: bytes, file_type: str) -> str:
        """Extract text from different file formats"""
        if file_type.lower() == 'pdf':
            return self._extract_pdf_text(file_content)
        elif file_type.lower() in ['doc', 'docx']:
            return self._extract_docx_text(file_content)
        else:
            raise ValueError(f"Unsupported file type: {file_type}")
    
    def _extract_pdf_text(self, file_content: bytes) -> str:
        """Extract text from PDF file"""
        try:
            pdf_reader = PyPDF2.PdfReader(io.BytesIO(file_content))
            text = ""
            for page in pdf_reader.pages:
                text += page.extract_text() + "\n"
            return text
        except Exception as e:
            raise ValueError(f"Error extracting text from PDF: {str(e)}")
    
    def _extract_docx_text(self, file_content: bytes) -> str:
        """Extract text from DOCX file"""
        try:
            doc = Document(io.BytesIO(file_content))
            text = ""
            for paragraph in doc.paragraphs:
                text += paragraph.text + "\n"
            return text
        except Exception as e:
            raise ValueError(f"Error extracting text from DOCX: {str(e)}")
    
    def _extract_name(self, text: str) -> Optional[str]:
        """Extract candidate name from resume text"""
        # Simple name extraction - can be enhanced with NLP
        lines = text.split('\n')
        for line in lines[:10]:  # Check first 10 lines
            line = line.strip()
            if len(line) > 2 and len(line) < 50:
                # Basic name pattern
                if re.match(r'^[A-Z][a-z]+ [A-Z][a-z]+', line):
                    return line
        return None
    
    def _extract_email(self, text: str) -> Optional[str]:
        """Extract email address from resume text"""
        email_pattern = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'
        match = re.search(email_pattern, text)
        return match.group() if match else None
    
    def _extract_phone(self, text: str) -> Optional[str]:
        """Extract phone number from resume text"""
        phone_pattern = r'(\+?1?[-.\s]?)?\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})'
        match = re.search(phone_pattern, text)
        if match:
            return ''.join(match.groups())
        return None
    
    def _extract_linkedin(self, text: str) -> Optional[str]:
        """Extract LinkedIn URL from resume text"""
        linkedin_pattern = r'https?://(?:www\.)?linkedin\.com/in/[a-zA-Z0-9-]+'
        match = re.search(linkedin_pattern, text)
        return match.group() if match else None
    
    def _extract_skills(self, text: str) -> List[str]:
        """Extract skills from resume text"""
        # Common technical skills
        common_skills = [
            'Python', 'Java', 'JavaScript', 'React', 'Angular', 'Vue', 'Node.js',
            'SQL', 'PostgreSQL', 'MySQL', 'MongoDB', 'AWS', 'Azure', 'Docker',
            'Kubernetes', 'Git', 'Django', 'Flask', 'FastAPI', 'Spring Boot',
            'HTML', 'CSS', 'TypeScript', 'C++', 'C#', '.NET', 'PHP', 'Ruby',
            'Go', 'Rust', 'Swift', 'Kotlin', 'Scala', 'R', 'MATLAB'
        ]
        
        found_skills = []
        text_lower = text.lower()
        
        for skill in common_skills:
            if skill.lower() in text_lower:
                found_skills.append(skill)
        
        return found_skills
    
    def _extract_experience(self, text: str) -> List[Dict[str, Any]]:
        """Extract work experience from resume text"""
        # This is a simplified version - can be enhanced with NLP
        experience = []
        
        # Look for date patterns and job titles
        date_pattern = r'(\d{4})\s*[-–]\s*(\d{4}|Present|Current)'
        matches = re.finditer(date_pattern, text)
        
        for match in matches:
            start_year = match.group(1)
            end_year = match.group(2)
            
            # Extract surrounding text as job description
            start_pos = max(0, match.start() - 200)
            end_pos = min(len(text), match.end() + 200)
            job_text = text[start_pos:end_pos]
            
            experience.append({
                'start_year': start_year,
                'end_year': end_year,
                'description': job_text.strip()
            })
        
        return experience
    
    def _extract_education(self, text: str) -> List[Dict[str, Any]]:
        """Extract education information from resume text"""
        education = []
        
        # Look for degree patterns
        degree_patterns = [
            r'Bachelor[^s]*\s+of\s+[A-Za-z]+',
            r'Master[^s]*\s+of\s+[A-Za-z]+',
            r'PhD|Ph\.D\.',
            r'Associate[^s]*\s+of\s+[A-Za-z]+'
        ]
        
        for pattern in degree_patterns:
            matches = re.finditer(pattern, text, re.IGNORECASE)
            for match in matches:
                education.append({
                    'degree': match.group(),
                    'context': text[max(0, match.start()-100):match.end()+100]
                })
        
        return education
    
    def _extract_certifications(self, text: str) -> List[Dict[str, Any]]:
        """Extract certifications from resume text"""
        certifications = []
        
        # Look for certification patterns
        cert_patterns = [
            r'AWS\s+Certified',
            r'Microsoft\s+Certified',
            r'Cisco\s+Certified',
            r'PMP',
            r'Certified\s+[A-Za-z\s]+'
        ]
        
        for pattern in cert_patterns:
            matches = re.finditer(pattern, text, re.IGNORECASE)
            for match in matches:
                certifications.append({
                    'certification': match.group(),
                    'context': text[max(0, match.start()-50):match.end()+50]
                })
        
        return certifications
    
    def _calculate_years_experience(self, text: str) -> int:
        """Calculate years of experience from resume"""
        # Simple calculation based on date patterns
        date_pattern = r'(\d{4})\s*[-–]\s*(\d{4}|Present|Current)'
        matches = re.findall(date_pattern, text)
        
        if not matches:
            return 0
        
        total_years = 0
        current_year = datetime.now().year
        
        for start_year, end_year in matches:
            start = int(start_year)
            end = current_year if end_year in ['Present', 'Current'] else int(end_year)
            total_years += (end - start)
        
        return total_years 