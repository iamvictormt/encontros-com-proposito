import { API_CONFIG } from '@/lib/config/api.config';

export class APIError extends Error {
  constructor(message: string, public status: number, public data?: any) {
    super(message);
    this.name = 'APIError';
  }
}

interface RequestOptions extends RequestInit {
  timeout?: number;
}

class APIClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private async request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    const { timeout = API_CONFIG.timeout, ...fetchOptions } = options;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        ...fetchOptions,
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          ...fetchOptions.headers,
        },
      });

      clearTimeout(timeoutId);

      const data = await response.json();

      if (!response.ok) {
        throw new APIError(data.message || 'Erro na requisição', response.status, data);
      }

      return data;
    } catch (error) {
      clearTimeout(timeoutId);

      if (error instanceof APIError) {
        throw error;
      }

      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new APIError('Tempo de requisição excedido', 408);
        }
        throw new APIError(error.message, 0);
      }

      throw new APIError('Erro desconhecido', 0);
    }
  }

  async get<T>(endpoint: string, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'GET' });
  }

  async post<T>(endpoint: string, body?: any, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: JSON.stringify(body),
    });
  }

  async put<T>(endpoint: string, body?: any, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(body),
    });
  }

  async delete<T>(endpoint: string, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' });
  }
}

export const apiClient = new APIClient(API_CONFIG.baseURL);
