// Export all API services
export { default as apiService } from './api';
export { default as authApi } from './authApi';
export { default as userProfileApi } from './userProfileApi';
export { default as jobApi } from './jobApi';
export { default as emailApi } from './emailApi';

// Export types
export type {
  User,
  LoginCredentials,
  RegisterData,
  LoginResponse,
  ApiError,
} from './api';

export type {
  UpdateProfileData,
  ChangePasswordData,
} from './userProfileApi';

export type {
  JobDescription,
  JobKeyword,
  CreateJobDescription,
  CreateJobKeyword,
  UpdateJobDescription,
  ResumeSubmission,
  CreateResumeSubmission,
  ScoringResult,
} from './jobApi';

export type {
  EmailConfig,
  CreateEmailConfig,
  UpdateEmailConfig,
  EmailTemplate,
  CreateEmailTemplate,
  UpdateEmailTemplate,
  EmailResponse,
} from './emailApi'; 