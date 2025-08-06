import apiService from './api';
import { LoginCredentials, RegisterData, User, LoginResponse } from './api';

class AuthApiService {
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    return await apiService.login(credentials);
  }

  async register(data: RegisterData): Promise<User> {
    return await apiService.register(data);
  }

  async getCurrentUser(): Promise<User> {
    return await apiService.getCurrentUser();
  }

  async refreshToken(): Promise<LoginResponse> {
    // This would be implemented if the backend supports token refresh
    throw new Error('Token refresh not implemented');
  }

  async logout(): Promise<void> {
    // This would be implemented if the backend supports logout endpoint
    // For now, we just remove the token locally
    apiService.removeToken();
  }

  // Token management methods
  setToken(token: string): void {
    apiService.setToken(token);
  }

  removeToken(): void {
    apiService.removeToken();
  }

  getToken(): string | null {
    return apiService.getToken();
  }

  // Error handling
  handleError(error: any): string {
    return apiService.handleError(error);
  }
}

export const authApi = new AuthApiService();
export default authApi; 