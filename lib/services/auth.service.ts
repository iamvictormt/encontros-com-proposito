// Authentication Service
import { apiClient } from "./api-client";
import { API_CONFIG } from "@/lib/config/api.config";

export interface LoginCredentials {
  emailOrPhone: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterData {
  fullName: string;
  email: string;
  phone: string;
  password: string;
}

export interface AuthUser {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  birthDate?: string;
  isAdmin: boolean;
}

export interface AuthResponse {
  message?: string;
  user: AuthUser;
}

class AuthService {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>(
      API_CONFIG.endpoints.auth.login,
      credentials,
    );
    return response;
  }

  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>(API_CONFIG.endpoints.auth.register, data);
    return response;
  }

  async logout(): Promise<void> {
    await apiClient.post(API_CONFIG.endpoints.auth.logout);
  }

  async getCurrentUser(): Promise<AuthUser | null> {
    try {
      const response = await apiClient.get<{ user: AuthUser }>(API_CONFIG.endpoints.auth.me);
      return response.user;
    } catch (error) {
      return null;
    }
  }

  async forgotPassword(email: string): Promise<{ message: string }> {
    const response = await apiClient.post<{ message: string }>("/api/auth/forgot-password", { email });
    return response;
  }

  async resetPassword(data: any): Promise<{ message: string }> {
    const response = await apiClient.post<{ message: string }>("/api/auth/reset-password", data);
    return response;
  }
}

// Create singleton instance
const authService = new AuthService();

// Explicit named export
export { authService };
