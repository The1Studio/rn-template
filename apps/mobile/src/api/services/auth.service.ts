import apiClient from '../axios-config';
import { API_BASE_URL, Endpoint } from '../endpoint';

// Types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
}

export interface LoginResponse {
  user: User;
  access_token: string;
  refresh_token: string;
}

export interface LogoutResponse {
  success: boolean;
}

// Auth Service
export const authService = {
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    const response = await apiClient.post<LoginResponse>(
      `${API_BASE_URL}${Endpoint.login}`,
      data
    );
    return response.data;
  },

  logout: async (): Promise<LogoutResponse> => {
    const response = await apiClient.post<LogoutResponse>(
      `${API_BASE_URL}${Endpoint.logout}`
    );
    return response.data;
  },
};
