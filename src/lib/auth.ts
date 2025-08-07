/**
 * Authentication API service for Repair Shop Dashboard
 * Handles login, token storage, and authentication state management
 */

// TypeScript interfaces for authentication data structures
export interface LoginRequest {
  identifier: string; // Strapi uses 'identifier' for email/username
  password: string;
}

export interface LoginResponse {
  jwt: string;
  user: {
    id: number;
    username: string;
    email: string;
    confirmed: boolean;
    blocked: boolean;
    createdAt: string;
    updatedAt: string;
  };
}

export interface AuthError {
  error: {
    status: number;
    name: string;
    message: string;
    details?: unknown;
  };
}

export interface AuthUser {
  id: number;
  username: string;
  email: string;
  confirmed: boolean;
  blocked: boolean;
}

// Token storage keys
const TOKEN_STORAGE_KEY = 'repair_shop_auth_token';
const USER_STORAGE_KEY = 'repair_shop_auth_user';

/**
 * Secure token storage utilities
 */
export const tokenStorage = {
  /**
   * Store JWT token securely
   */
  setToken(token: string): void {
    try {
      localStorage.setItem(TOKEN_STORAGE_KEY, token);
    } catch (error) {
      console.error('Failed to store auth token:', error);
      throw new Error('Unable to store authentication token');
    }
  },

  /**
   * Retrieve stored JWT token
   */
  getToken(): string | null {
    try {
      return localStorage.getItem(TOKEN_STORAGE_KEY);
    } catch (error) {
      console.error('Failed to retrieve auth token:', error);
      return null;
    }
  },

  /**
   * Remove stored JWT token
   */
  removeToken(): void {
    try {
      localStorage.removeItem(TOKEN_STORAGE_KEY);
    } catch (error) {
      console.error('Failed to remove auth token:', error);
    }
  },

  /**
   * Validate token exists and is not empty
   */
  hasValidToken(): boolean {
    const token = this.getToken();
    return Boolean(token && token.trim().length > 0);
  }
};

/**
 * User data storage utilities
 */
export const userStorage = {
  /**
   * Store user data
   */
  setUser(user: AuthUser): void {
    try {
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
    } catch (error) {
      console.error('Failed to store user data:', error);
      throw new Error('Unable to store user data');
    }
  },

  /**
   * Retrieve stored user data
   */
  getUser(): AuthUser | null {
    try {
      const userData = localStorage.getItem(USER_STORAGE_KEY);
      if (!userData) return null;
      return JSON.parse(userData) as AuthUser;
    } catch (error) {
      console.error('Failed to retrieve user data:', error);
      return null;
    }
  },

  /**
   * Remove stored user data
   */
  removeUser(): void {
    try {
      localStorage.removeItem(USER_STORAGE_KEY);
    } catch (error) {
      console.error('Failed to remove user data:', error);
    }
  }
};

/**
 * Authentication API client
 */
export class AuthAPI {
  private baseUrl: string;

  constructor() {
    // Get API URL from environment variables
    this.baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:1337/api';
  }

  /**
   * Login with email/username and password
   */
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/auth/local`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();

      if (!response.ok) {
        // Handle specific error responses
        const authError: AuthError = {
          error: {
            status: response.status,
            name: data.error?.name || 'Authentication Error',
            message: data.error?.message || 'Login failed',
            details: data.error?.details,
          },
        };
        throw authError;
      }

      return data as LoginResponse;
    } catch (error) {
      // Handle network errors and other exceptions
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw {
          error: {
            status: 0,
            name: 'NetworkError',
            message: 'Unable to connect to the authentication server. Please check your internet connection.',
          },
        } as AuthError;
      }

      // Re-throw AuthError instances
      if (typeof error === 'object' && error !== null && 'error' in error) {
        throw error;
      }

      // Handle unknown errors
      throw {
        error: {
          status: 500,
          name: 'UnknownError',
          message: 'An unexpected error occurred during login',
        },
      } as AuthError;
    }
  }

  /**
   * Logout user and clear stored data
   */
  logout(): void {
    tokenStorage.removeToken();
    userStorage.removeUser();
  }

  /**
   * Check if user is currently authenticated
   */
  isAuthenticated(): boolean {
    return tokenStorage.hasValidToken() && userStorage.getUser() !== null;
  }

  /**
   * Get current authenticated user
   */
  getCurrentUser(): AuthUser | null {
    if (!this.isAuthenticated()) return null;
    return userStorage.getUser();
  }

  /**
   * Get authorization header for API requests
   */
  getAuthHeader(): Record<string, string> {
    const token = tokenStorage.getToken();
    if (!token) return {};
    
    return {
      'Authorization': `Bearer ${token}`,
    };
  }
}

// Export singleton instance
export const authAPI = new AuthAPI();

/**
 * Helper function to handle login process
 */
export async function handleLogin(email: string, password: string): Promise<{
  success: boolean;
  user?: AuthUser;
  error?: string;
}> {
  try {
    const loginRequest: LoginRequest = {
      identifier: email,
      password: password,
    };

    const response = await authAPI.login(loginRequest);

    // Store token and user data securely
    tokenStorage.setToken(response.jwt);
    userStorage.setUser({
      id: response.user.id,
      username: response.user.username,
      email: response.user.email,
      confirmed: response.user.confirmed,
      blocked: response.user.blocked,
    });

    return {
      success: true,
      user: {
        id: response.user.id,
        username: response.user.username,
        email: response.user.email,
        confirmed: response.user.confirmed,
        blocked: response.user.blocked,
      },
    };
  } catch (error) {
    const authError = error as AuthError;
    return {
      success: false,
      error: authError.error.message,
    };
  }
}