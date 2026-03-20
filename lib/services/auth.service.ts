// Authentication Service
import { apiClient } from "./api-client"
import { API_CONFIG } from "@/lib/config/api.config"

export interface LoginCredentials {
  emailOrCpf: string
  password: string
}

export interface RegisterData {
  fullName: string
  email: string
  cpf: string
  password: string
}

export interface AuthUser {
  id: string
  fullName: string
  email: string
  cpf: string
  isAdmin: boolean
}

export interface AuthResponse {
  message?: string
  user: AuthUser
}

class AuthService {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>(API_CONFIG.endpoints.auth.login, credentials)
    return response
  }

  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>(API_CONFIG.endpoints.auth.register, data)
    return response
  }

  async logout(): Promise<void> {
    await apiClient.post(API_CONFIG.endpoints.auth.logout)
  }

  async getCurrentUser(): Promise<AuthUser | null> {
    try {
      const response = await apiClient.get<{ user: AuthUser }>(API_CONFIG.endpoints.auth.me)
      return response.user
    } catch (error) {
      return null
    }
  }
}

// Create singleton instance
const authService = new AuthService()

// Explicit named export
export { authService }
