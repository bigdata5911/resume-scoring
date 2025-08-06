import apiService from './api';

export interface JobDescription {
  id: string;
  user_id: string;
  title: string;
  company: string;
  description: string;
  requirements?: string;
  skills_required?: string[];
  experience_level?: string;
  industry?: string;
  location?: string;
  salary_range_min?: number;
  salary_range_max?: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface JobKeyword {
  id: string;
  job_description_id: string;
  keyword: string;
  category?: string;
  weight: number;
  created_at: string;
}

export interface CreateJobDescription {
  title: string;
  company: string;
  description: string;
  requirements?: string;
  skills_required?: string[];
  experience_level?: string;
  industry?: string;
  location?: string;
  salary_range_min?: number;
  salary_range_max?: number;
  keywords?: CreateJobKeyword[];
}

export interface CreateJobKeyword {
  keyword: string;
  category?: string;
  weight?: number;
}

export interface UpdateJobDescription {
  title?: string;
  company?: string;
  description?: string;
  requirements?: string;
  skills_required?: string[];
  experience_level?: string;
  industry?: string;
  location?: string;
  salary_range_min?: number;
  salary_range_max?: number;
  is_active?: boolean;
}

export interface ResumeSubmission {
  id: string;
  email_config_id: string;
  job_description_id?: string;
  candidate_email: string;
  candidate_name?: string;
  position_applied?: string;
  original_email_subject?: string;
  original_email_body?: string;
  attachment_filename?: string;
  attachment_path?: string;
  file_size_bytes?: number;
  file_type?: string;
  status: string;
  processing_started_at?: string;
  processing_completed_at?: string;
  error_message?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateResumeSubmission {
  email_config_id: string;
  job_description_id?: string;
  candidate_email: string;
  candidate_name?: string;
  position_applied?: string;
  original_email_subject?: string;
  original_email_body?: string;
  attachment_filename?: string;
  attachment_path?: string;
  file_size_bytes?: number;
  file_type?: string;
}

export interface ScoringResult {
  id: string;
  resume_submission_id: string;
  job_description_id?: string;
  total_score: number;
  confidence_level: number;
  job_match_score: number;
  experience_score: number;
  education_score: number;
  stability_score: number;
  presentation_score: number;
  recommendation: string;
  created_at: string;
  updated_at: string;
}

class JobApiService {
  // Job Descriptions
  async getJobDescriptions(skip = 0, limit = 100): Promise<JobDescription[]> {
    const response = await apiService.api.get(`/job-descriptions?skip=${skip}&limit=${limit}`);
    return response.data;
  }

  async getJobDescription(id: string): Promise<JobDescription> {
    const response = await apiService.api.get(`/job-descriptions/${id}`);
    return response.data;
  }

  async createJobDescription(data: CreateJobDescription): Promise<JobDescription> {
    const response = await apiService.api.post('/job-descriptions', data);
    return response.data;
  }

  async updateJobDescription(id: string, data: UpdateJobDescription): Promise<JobDescription> {
    const response = await apiService.api.put(`/job-descriptions/${id}`, data);
    return response.data;
  }

  async deleteJobDescription(id: string): Promise<void> {
    await apiService.api.delete(`/job-descriptions/${id}`);
  }

  // Resume Submissions
  async getResumeSubmissions(skip = 0, limit = 100): Promise<ResumeSubmission[]> {
    const response = await apiService.api.get(`/resume-submissions?skip=${skip}&limit=${limit}`);
    return response.data;
  }

  async getResumeSubmission(id: string): Promise<ResumeSubmission> {
    const response = await apiService.api.get(`/resume-submissions/${id}`);
    return response.data;
  }

  async createResumeSubmission(data: CreateResumeSubmission): Promise<ResumeSubmission> {
    const response = await apiService.api.post('/resume-submissions', data);
    return response.data;
  }

  async deleteResumeSubmission(id: string): Promise<void> {
    await apiService.api.delete(`/resume-submissions/${id}`);
  }

  // Scoring Results
  async getScoringResults(skip = 0, limit = 100): Promise<ScoringResult[]> {
    const response = await apiService.api.get(`/scoring-results?skip=${skip}&limit=${limit}`);
    return response.data;
  }

  async getScoringResult(id: string): Promise<ScoringResult> {
    const response = await apiService.api.get(`/scoring-results/${id}`);
    return response.data;
  }

  async getScoringResultsByResume(resumeSubmissionId: string): Promise<ScoringResult[]> {
    const response = await apiService.api.get(`/scoring-results/resume/${resumeSubmissionId}`);
    return response.data;
  }
}

export const jobApi = new JobApiService();
export default jobApi; 