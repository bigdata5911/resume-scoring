import smtplib
import poplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from email import message_from_bytes
from typing import List, Dict, Any, Optional
from datetime import datetime
from app.config import settings


class EmailProcessor:
    """Service for processing emails (POP3 and SMTP)"""
    
    def __init__(self):
        self.smtp_host = settings.smtp_host
        self.smtp_port = settings.smtp_port
        self.smtp_username = settings.smtp_username
        self.smtp_password = settings.smtp_password
    
    def send_email(self, to_email: str, subject: str, body: str, from_email: Optional[str] = None) -> bool:
        """Send an email using SMTP"""
        try:
            msg = MIMEMultipart()
            msg['From'] = from_email or self.smtp_username
            msg['To'] = to_email
            msg['Subject'] = subject
            
            msg.attach(MIMEText(body, 'plain'))
            
            server = smtplib.SMTP(self.smtp_host, self.smtp_port)
            server.starttls()
            server.login(self.smtp_username, self.smtp_password)
            
            text = msg.as_string()
            server.sendmail(self.smtp_username, to_email, text)
            server.quit()
            
            return True
            
        except Exception as e:
            print(f"Error sending email: {str(e)}")
            return False
    
    def fetch_emails(self, email_config: Dict[str, Any], last_fetch_time: Optional[datetime] = None) -> List[Dict[str, Any]]:
        """Fetch new emails using POP3"""
        try:
            # Connect to POP3 server
            server = poplib.POP3_SSL(
                email_config['pop3_host'],
                email_config['pop3_port']
            )
            
            # Authenticate
            server.user(email_config['pop3_username'])
            server.pass_(email_config['pop3_password'])
            
            # Get email count
            num_messages = len(server.list()[1])
            
            emails = []
            
            # Fetch recent emails (last 10 for now)
            for i in range(max(1, num_messages - 9), num_messages + 1):
                try:
                    # Get email
                    response, lines, octets = server.retr(i)
                    
                    # Parse email
                    email_data = self._parse_email(lines, email_config)
                    
                    if email_data:
                        emails.append(email_data)
                        
                except Exception as e:
                    print(f"Error processing email {i}: {str(e)}")
                    continue
            
            server.quit()
            return emails
            
        except Exception as e:
            print(f"Error fetching emails: {str(e)}")
            return []
    
    def _parse_email(self, lines: List[bytes], email_config: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        """Parse email content and extract relevant information"""
        try:
            # Convert bytes to string
            email_content = b'\n'.join(lines).decode('utf-8', errors='ignore')
            
            # Parse email message
            msg = message_from_bytes(b'\n'.join(lines))
            
            # Extract basic information
            subject = msg.get('Subject', '')
            from_email = msg.get('From', '')
            to_email = msg.get('To', '')
            date = msg.get('Date', '')
            
            # Extract body
            body = self._extract_email_body(msg)
            
            # Extract attachments
            attachments = self._extract_attachments(msg)
            
            return {
                'subject': subject,
                'from_email': from_email,
                'to_email': to_email,
                'date': date,
                'body': body,
                'attachments': attachments,
                'email_config_id': email_config['id']
            }
            
        except Exception as e:
            print(f"Error parsing email: {str(e)}")
            return None
    
    def _extract_email_body(self, msg) -> str:
        """Extract email body text"""
        body = ""
        
        if msg.is_multipart():
            for part in msg.walk():
                if part.get_content_type() == "text/plain":
                    try:
                        body += part.get_payload(decode=True).decode('utf-8', errors='ignore')
                    except:
                        continue
        else:
            try:
                body = msg.get_payload(decode=True).decode('utf-8', errors='ignore')
            except:
                body = str(msg.get_payload())
        
        return body
    
    def _extract_attachments(self, msg) -> List[Dict[str, Any]]:
        """Extract email attachments"""
        attachments = []
        
        if msg.is_multipart():
            for part in msg.walk():
                if part.get_filename():
                    try:
                        filename = part.get_filename()
                        content = part.get_payload(decode=True)
                        
                        attachments.append({
                            'filename': filename,
                            'content': content,
                            'content_type': part.get_content_type()
                        })
                    except Exception as e:
                        print(f"Error extracting attachment: {str(e)}")
                        continue
        
        return attachments
    
    def validate_email_config(self, email_config: Dict[str, Any]) -> bool:
        """Validate email configuration by testing connection"""
        try:
            # Test POP3 connection
            pop3_server = poplib.POP3_SSL(
                email_config['pop3_host'],
                email_config['pop3_port']
            )
            pop3_server.user(email_config['pop3_username'])
            pop3_server.pass_(email_config['pop3_password'])
            pop3_server.quit()
            
            # Test SMTP connection
            smtp_server = smtplib.SMTP(
                email_config['smtp_host'],
                email_config['smtp_port']
            )
            smtp_server.starttls()
            smtp_server.login(email_config['smtp_username'], email_config['smtp_password'])
            smtp_server.quit()
            
            return True
            
        except Exception as e:
            print(f"Email config validation failed: {str(e)}")
            return False 