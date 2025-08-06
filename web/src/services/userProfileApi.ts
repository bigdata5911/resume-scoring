import apiService from './api';
import { User } from './api';

export interface UpdateProfileData {
  first_name?: string;
  last_name?: string;
  email?: string;
}

export interface ChangePasswordData {
  current_password: string;
  new_password: string;
}

class UserProfileApiService {
  async getCurrentUser(): Promise<User> {
    return await apiService.getCurrentUser();
  }

  async updateProfile(data: UpdateProfileData): Promise<User> {
    return await apiService.updateProfile(data);
  }

  async changePassword(data: ChangePasswordData): Promise<void> {
    return await apiService.changePassword(data.current_password, data.new_password);
  }

  async deleteAccount(): Promise<void> {
    // This would be implemented if the backend supports account deletion
    throw new Error('Account deletion not implemented');
  }
}

export const userProfileApi = new UserProfileApiService();
export default userProfileApi; 