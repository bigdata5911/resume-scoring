import os
import uuid
from typing import Optional, Tuple
from pathlib import Path
from app.config import settings


class FileProcessor:
    """Service for processing file uploads and validation"""
    
    def __init__(self):
        self.upload_dir = Path(settings.upload_dir)
        self.max_file_size = settings.max_file_size
        self.supported_types = ['pdf', 'doc', 'docx']
        
        # Create upload directory if it doesn't exist
        self.upload_dir.mkdir(exist_ok=True)
    
    def save_file(self, file_content: bytes, filename: str, file_type: str) -> Tuple[bool, str, Optional[str]]:
        """Save uploaded file and return success status, message, and file path"""
        try:
            # Validate file type
            if not self._is_valid_file_type(file_type):
                return False, f"Unsupported file type: {file_type}", None
            
            # Validate file size
            if len(file_content) > self.max_file_size:
                return False, f"File size exceeds maximum limit of {self.max_file_size} bytes", None
            
            # Generate unique filename
            unique_filename = self._generate_unique_filename(filename)
            file_path = self.upload_dir / unique_filename
            
            # Save file
            with open(file_path, 'wb') as f:
                f.write(file_content)
            
            return True, "File saved successfully", str(file_path)
            
        except Exception as e:
            return False, f"Error saving file: {str(e)}", None
    
    def delete_file(self, file_path: str) -> bool:
        """Delete a file from the upload directory"""
        try:
            path = Path(file_path)
            if path.exists() and path.is_file():
                path.unlink()
                return True
            return False
        except Exception as e:
            print(f"Error deleting file {file_path}: {str(e)}")
            return False
    
    def get_file_info(self, file_path: str) -> Optional[dict]:
        """Get file information"""
        try:
            path = Path(file_path)
            if not path.exists():
                return None
            
            stat = path.stat()
            return {
                'filename': path.name,
                'size_bytes': stat.st_size,
                'created_time': stat.st_ctime,
                'modified_time': stat.st_mtime,
                'file_type': self._get_file_extension(path.name)
            }
        except Exception as e:
            print(f"Error getting file info: {str(e)}")
            return None
    
    def validate_file(self, file_content: bytes, filename: str, file_type: str) -> Tuple[bool, str]:
        """Validate uploaded file"""
        # Check file type
        if not self._is_valid_file_type(file_type):
            return False, f"Unsupported file type: {file_type}"
        
        # Check file size
        if len(file_content) > self.max_file_size:
            return False, f"File size exceeds maximum limit of {self.max_file_size} bytes"
        
        # Check filename
        if not filename or len(filename) > 255:
            return False, "Invalid filename"
        
        # Check for malicious file extensions
        if self._is_malicious_file(filename):
            return False, "File type not allowed for security reasons"
        
        return True, "File validation passed"
    
    def _is_valid_file_type(self, file_type: str) -> bool:
        """Check if file type is supported"""
        return file_type.lower() in self.supported_types
    
    def _is_malicious_file(self, filename: str) -> bool:
        """Check if file might be malicious"""
        dangerous_extensions = [
            '.exe', '.bat', '.cmd', '.com', '.pif', '.scr', '.vbs', '.js',
            '.jar', '.msi', '.dll', '.sys', '.drv', '.ocx', '.cpl'
        ]
        
        file_ext = Path(filename).suffix.lower()
        return file_ext in dangerous_extensions
    
    def _generate_unique_filename(self, original_filename: str) -> str:
        """Generate a unique filename"""
        name, ext = os.path.splitext(original_filename)
        unique_id = str(uuid.uuid4())
        return f"{name}_{unique_id}{ext}"
    
    def _get_file_extension(self, filename: str) -> str:
        """Get file extension from filename"""
        return Path(filename).suffix.lower().lstrip('.')
    
    def cleanup_old_files(self, max_age_days: int = 30) -> int:
        """Clean up old files from upload directory"""
        import time
        current_time = time.time()
        max_age_seconds = max_age_days * 24 * 60 * 60
        deleted_count = 0
        
        try:
            for file_path in self.upload_dir.iterdir():
                if file_path.is_file():
                    file_age = current_time - file_path.stat().st_mtime
                    if file_age > max_age_seconds:
                        file_path.unlink()
                        deleted_count += 1
        except Exception as e:
            print(f"Error during cleanup: {str(e)}")
        
        return deleted_count 