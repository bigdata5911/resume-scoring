import apiService from './api';

export interface EmailConfig {
  id: string;
  user_id: string;
  email_address: string;
  email_provider: string;
  pop3_host?: string;
  pop3_port?: number;
  pop3_username?: string;
  pop3_password?: string;
  smtp_host?: string;
  smtp_port?: number;
  smtp_username?: string;
  smtp_password?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateEmailConfig {
  email_address: string;
  email_provider: string;
  pop3_host?: string;
  pop3_port?: number;
  pop3_username?: string;
  pop3_password?: string;
  smtp_host?: string;
  smtp_port?: number;
  smtp_username?: string;
  smtp_password?: string;
}

export interface UpdateEmailConfig {
  email_address?: string;
  email_provider?: string;
  pop3_host?: string;
  pop3_port?: number;
  pop3_username?: string;
  pop3_password?: string;
  smtp_host?: string;
  smtp_port?: number;
  smtp_username?: string;
  smtp_password?: string;
  is_active?: boolean;
}

export interface EmailTemplate {
  id: string;
  user_id: string;
  name: string;
  subject_template: string;
  body_template: string;
  is_default: boolean;
  recommendation_type: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateEmailTemplate {
  name: string;
  subject_template: string;
  body_template: string;
  is_default?: boolean;
  recommendation_type: string;
}

export interface UpdateEmailTemplate {
  name?: string;
  subject_template?: string;
  body_template?: string;
  is_default?: boolean;
  recommendation_type?: string;
  is_active?: boolean;
}

export interface EmailResponse {
  id: string;
  email_template_id: string;
  resume_submission_id: string;
  candidate_email: string;
  subject: string;
  body: string;
  sent_at?: string;
  status: string;
  error_message?: string;
  created_at: string;
  updated_at: string;
}

class EmailApiService {
  // Email Configurations
  async getEmailConfigs(): Promise<EmailConfig[]> {
    const response = await apiService.api.get('/email-configs');
    return response.data;
  }

  async getEmailConfig(id: string): Promise<EmailConfig> {
    const response = await apiService.api.get(`/email-configs/${id}`);
    return response.data;
  }

  async createEmailConfig(data: CreateEmailConfig): Promise<EmailConfig> {
    const response = await apiService.api.post('/email-configs', data);
    return response.data;
  }

  async updateEmailConfig(id: string, data: UpdateEmailConfig): Promise<EmailConfig> {
    const response = await apiService.api.put(`/email-configs/${id}`, data);
    return response.data;
  }

  async deleteEmailConfig(id: string): Promise<void> {
    await apiService.api.delete(`/email-configs/${id}`);
  }

  // Email Templates
  async getEmailTemplates(): Promise<EmailTemplate[]> {
    const response = await apiService.api.get('/email-templates');
    return response.data;
  }

  async getEmailTemplate(id: string): Promise<EmailTemplate> {
    const response = await apiService.api.get(`/email-templates/${id}`);
    return response.data;
  }

  async createEmailTemplate(data: CreateEmailTemplate): Promise<EmailTemplate> {
    const response = await apiService.api.post('/email-templates', data);
    return response.data;
  }

  async updateEmailTemplate(id: string, data: UpdateEmailTemplate): Promise<EmailTemplate> {
    const response = await apiService.api.put(`/email-templates/${id}`, data);
    return response.data;
  }

  async deleteEmailTemplate(id: string): Promise<void> {
    await apiService.api.delete(`/email-templates/${id}`);
  }

  // Email Responses
  async getEmailResponses(skip = 0, limit = 100): Promise<EmailResponse[]> {
    const response = await apiService.api.get(`/email-responses?skip=${skip}&limit=${limit}`);
    return response.data;
  }

  async getEmailResponse(id: string): Promise<EmailResponse> {
    const response = await apiService.api.get(`/email-responses/${id}`);
    return response.data;
  }
}

export const emailApi = new EmailApiService();
export default emailApi; 