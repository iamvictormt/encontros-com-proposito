import { apiClient } from './api-client';
import { API_CONFIG } from '@/lib/config/api.config';
import { setAuthToken, removeAuthToken } from '@/lib/auth';

export interface LoginCredentials {
  emailOrCpf: string;
  password: string;
}

export interface RegisterData {
  fullName: string;
  email?: string;
  cpf?: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
  user?: {
    id: string;
    fullName: string;
    email?: string;
    cpf?: string;
  };
}

class AuthService {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>(API_CONFIG.endpoints.auth.login, credentials);
    setAuthToken(response.access_token);
    return response;
  }

  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>(API_CONFIG.endpoints.auth.register, data);
    setAuthToken(response.access_token);
    return response;
  }

  logout() {
    removeAuthToken();
  }
}

export const authService = new AuthService();
