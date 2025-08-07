/**
 * Unit tests for authentication API service
 */

import {
  AuthAPI,
  tokenStorage,
  userStorage,
  handleLogin,
  LoginRequest,
  LoginResponse,
  AuthUser,
} from './auth';

// Mock localStorage
const mockLocalStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};

// Mock fetch
global.fetch = jest.fn() as jest.MockedFunction<typeof fetch>;

// Setup mocks
beforeEach(() => {
  Object.defineProperty(window, 'localStorage', {
    value: mockLocalStorage,
  });
  jest.clearAllMocks();
  
  // Mock console.error to avoid noise during tests
  jest.spyOn(console, 'error').mockImplementation(() => {});
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe('tokenStorage', () => {
  describe('setToken', () => {
    it('should store token in localStorage', () => {
      const token = 'test-jwt-token';
      tokenStorage.setToken(token);
      
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        'repair_shop_auth_token',
        token
      );
    });

    it('should throw error if localStorage fails', () => {
      mockLocalStorage.setItem.mockImplementation(() => {
        throw new Error('localStorage error');
      });

      expect(() => tokenStorage.setToken('token')).toThrow(
        'Unable to store authentication token'
      );
    });
  });

  describe('getToken', () => {
    it('should retrieve token from localStorage', () => {
      const token = 'test-jwt-token';
      mockLocalStorage.getItem.mockReturnValue(token);

      const result = tokenStorage.getToken();
      
      expect(mockLocalStorage.getItem).toHaveBeenCalledWith(
        'repair_shop_auth_token'
      );
      expect(result).toBe(token);
    });

    it('should return null if no token exists', () => {
      mockLocalStorage.getItem.mockReturnValue(null);

      const result = tokenStorage.getToken();
      
      expect(result).toBeNull();
    });

    it('should return null if localStorage fails', () => {
      mockLocalStorage.getItem.mockImplementation(() => {
        throw new Error('localStorage error');
      });

      const result = tokenStorage.getToken();
      
      expect(result).toBeNull();
    });
  });

  describe('removeToken', () => {
    it('should remove token from localStorage', () => {
      tokenStorage.removeToken();
      
      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith(
        'repair_shop_auth_token'
      );
    });

    it('should not throw error if localStorage fails', () => {
      mockLocalStorage.removeItem.mockImplementation(() => {
        throw new Error('localStorage error');
      });

      expect(() => tokenStorage.removeToken()).not.toThrow();
    });
  });

  describe('hasValidToken', () => {
    it('should return true for valid token', () => {
      mockLocalStorage.getItem.mockReturnValue('valid-token');
      
      expect(tokenStorage.hasValidToken()).toBe(true);
    });

    it('should return false for empty token', () => {
      mockLocalStorage.getItem.mockReturnValue('');
      
      expect(tokenStorage.hasValidToken()).toBe(false);
    });

    it('should return false for null token', () => {
      mockLocalStorage.getItem.mockReturnValue(null);
      
      expect(tokenStorage.hasValidToken()).toBe(false);
    });

    it('should return false for whitespace-only token', () => {
      mockLocalStorage.getItem.mockReturnValue('   ');
      
      expect(tokenStorage.hasValidToken()).toBe(false);
    });
  });
});

describe('userStorage', () => {
  const mockUser: AuthUser = {
    id: 1,
    username: 'testuser',
    email: 'test@example.com',
    confirmed: true,
    blocked: false,
  };

  describe('setUser', () => {
    it('should store user data in localStorage', () => {
      mockLocalStorage.setItem.mockImplementation(() => {});
      
      userStorage.setUser(mockUser);
      
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        'repair_shop_auth_user',
        JSON.stringify(mockUser)
      );
    });

    it('should throw error if localStorage fails', () => {
      mockLocalStorage.setItem.mockImplementation(() => {
        throw new Error('localStorage error');
      });

      expect(() => userStorage.setUser(mockUser)).toThrow(
        'Unable to store user data'
      );
    });
  });

  describe('getUser', () => {
    it('should retrieve user data from localStorage', () => {
      mockLocalStorage.getItem.mockReturnValue(JSON.stringify(mockUser));

      const result = userStorage.getUser();
      
      expect(mockLocalStorage.getItem).toHaveBeenCalledWith(
        'repair_shop_auth_user'
      );
      expect(result).toEqual(mockUser);
    });

    it('should return null if no user data exists', () => {
      mockLocalStorage.getItem.mockReturnValue(null);

      const result = userStorage.getUser();
      
      expect(result).toBeNull();
    });

    it('should return null if JSON parsing fails', () => {
      mockLocalStorage.getItem.mockReturnValue('invalid-json');

      const result = userStorage.getUser();
      
      expect(result).toBeNull();
    });
  });

  describe('removeUser', () => {
    it('should remove user data from localStorage', () => {
      userStorage.removeUser();
      
      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith(
        'repair_shop_auth_user'
      );
    });
  });
});

describe('AuthAPI', () => {
  let authAPI: AuthAPI;

  beforeEach(() => {
    authAPI = new AuthAPI();
  });

  describe('login', () => {
    const mockCredentials: LoginRequest = {
      identifier: 'test@example.com',
      password: 'password123',
    };

    const mockSuccessResponse: LoginResponse = {
      jwt: 'test-jwt-token',
      user: {
        id: 1,
        username: 'testuser',
        email: 'test@example.com',
        confirmed: true,
        blocked: false,
        createdAt: '2023-01-01T00:00:00.000Z',
        updatedAt: '2023-01-01T00:00:00.000Z',
      },
    };

    it('should successfully login with valid credentials', async () => {
      (fetch as jest.MockedFunction<typeof fetch>).mockResolvedValueOnce({
        ok: true,
        json: async () => mockSuccessResponse,
      } as Response);

      const result = await authAPI.login(mockCredentials);

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/auth/local'),
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(mockCredentials),
        }
      );
      expect(result).toEqual(mockSuccessResponse);
    });

    it('should throw AuthError for invalid credentials', async () => {
      const errorResponse = {
        error: {
          status: 400,
          name: 'ValidationError',
          message: 'Invalid credentials',
        },
      };

      (fetch as jest.MockedFunction<typeof fetch>).mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: async () => errorResponse,
      } as Response);

      await expect(authAPI.login(mockCredentials)).rejects.toEqual({
        error: {
          status: 400,
          name: 'ValidationError',
          message: 'Invalid credentials',
        },
      });
    });

    it('should throw NetworkError for fetch failures', async () => {
      (fetch as jest.MockedFunction<typeof fetch>).mockRejectedValueOnce(
        new TypeError('fetch failed')
      );

      await expect(authAPI.login(mockCredentials)).rejects.toEqual({
        error: {
          status: 0,
          name: 'NetworkError',
          message: 'Unable to connect to the authentication server. Please check your internet connection.',
        },
      });
    });

    it('should throw UnknownError for unexpected errors', async () => {
      (fetch as jest.MockedFunction<typeof fetch>).mockRejectedValueOnce(
        new Error('Unexpected error')
      );

      await expect(authAPI.login(mockCredentials)).rejects.toEqual({
        error: {
          status: 500,
          name: 'UnknownError',
          message: 'An unexpected error occurred during login',
        },
      });
    });
  });

  describe('logout', () => {
    it('should clear stored token and user data', () => {
      authAPI.logout();

      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith(
        'repair_shop_auth_token'
      );
      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith(
        'repair_shop_auth_user'
      );
    });
  });

  describe('isAuthenticated', () => {
    it('should return true when token and user exist and token is not expired', () => {
      // Create a valid JWT token (not expired)
      const futureTime = Math.floor(Date.now() / 1000) + 3600; // 1 hour from now
      const payload = { exp: futureTime };
      const validToken = `header.${btoa(JSON.stringify(payload))}.signature`;

      mockLocalStorage.getItem.mockImplementation((key) => {
        if (key === 'repair_shop_auth_token') return validToken;
        if (key === 'repair_shop_auth_user') return JSON.stringify({ id: 1 });
        return null;
      });

      expect(authAPI.isAuthenticated()).toBe(true);
    });

    it('should return false and call logout when token is expired', () => {
      // Create an expired JWT token
      const pastTime = Math.floor(Date.now() / 1000) - 3600; // 1 hour ago
      const payload = { exp: pastTime };
      const expiredToken = `header.${btoa(JSON.stringify(payload))}.signature`;

      mockLocalStorage.getItem.mockImplementation((key) => {
        if (key === 'repair_shop_auth_token') return expiredToken;
        if (key === 'repair_shop_auth_user') return JSON.stringify({ id: 1 });
        return null;
      });

      expect(authAPI.isAuthenticated()).toBe(false);
      // Verify that logout was called (token and user should be removed)
      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('repair_shop_auth_token');
      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('repair_shop_auth_user');
    });

    it('should return false when token is missing', () => {
      mockLocalStorage.getItem.mockImplementation((key) => {
        if (key === 'repair_shop_auth_token') return null;
        if (key === 'repair_shop_auth_user') return JSON.stringify({ id: 1 });
        return null;
      });

      expect(authAPI.isAuthenticated()).toBe(false);
    });

    it('should return false when user is missing', () => {
      mockLocalStorage.getItem.mockImplementation((key) => {
        if (key === 'repair_shop_auth_token') return 'valid-token';
        if (key === 'repair_shop_auth_user') return null;
        return null;
      });

      expect(authAPI.isAuthenticated()).toBe(false);
    });

    it('should handle malformed JWT token and return false', () => {
      mockLocalStorage.getItem.mockImplementation((key) => {
        if (key === 'repair_shop_auth_token') return 'invalid-jwt-token';
        if (key === 'repair_shop_auth_user') return JSON.stringify({ id: 1 });
        return null;
      });

      expect(authAPI.isAuthenticated()).toBe(false);
    });
  });

  describe('getCurrentUser', () => {
    const mockUser: AuthUser = {
      id: 1,
      username: 'testuser',
      email: 'test@example.com',
      confirmed: true,
      blocked: false,
    };

    it('should return user when authenticated', () => {
      // Create a valid JWT token (not expired)
      const futureTime = Math.floor(Date.now() / 1000) + 3600; // 1 hour from now
      const payload = { exp: futureTime };
      const validToken = `header.${btoa(JSON.stringify(payload))}.signature`;

      mockLocalStorage.getItem.mockImplementation((key) => {
        if (key === 'repair_shop_auth_token') return validToken;
        if (key === 'repair_shop_auth_user') return JSON.stringify(mockUser);
        return null;
      });

      expect(authAPI.getCurrentUser()).toEqual(mockUser);
    });

    it('should return null when not authenticated', () => {
      mockLocalStorage.getItem.mockReturnValue(null);

      expect(authAPI.getCurrentUser()).toBeNull();
    });
  });

  describe('getAuthHeader', () => {
    it('should return authorization header when token exists', () => {
      mockLocalStorage.getItem.mockReturnValue('test-jwt-token');

      const header = authAPI.getAuthHeader();

      expect(header).toEqual({
        'Authorization': 'Bearer test-jwt-token',
      });
    });

    it('should return empty object when no token exists', () => {
      mockLocalStorage.getItem.mockReturnValue(null);

      const header = authAPI.getAuthHeader();

      expect(header).toEqual({});
    });
  });
});

describe('handleLogin', () => {
  const mockSuccessResponse: LoginResponse = {
    jwt: 'test-jwt-token',
    user: {
      id: 1,
      username: 'testuser',
      email: 'test@example.com',
      confirmed: true,
      blocked: false,
      createdAt: '2023-01-01T00:00:00.000Z',
      updatedAt: '2023-01-01T00:00:00.000Z',
    },
  };

  it('should handle successful login', async () => {
    mockLocalStorage.setItem.mockImplementation(() => {});
    
    (fetch as jest.MockedFunction<typeof fetch>).mockResolvedValueOnce({
      ok: true,
      json: async () => mockSuccessResponse,
    } as Response);

    const result = await handleLogin('test@example.com', 'password123');

    expect(result.success).toBe(true);
    expect(result.user).toEqual({
      id: 1,
      username: 'testuser',
      email: 'test@example.com',
      confirmed: true,
      blocked: false,
    });

    expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
      'repair_shop_auth_token',
      'test-jwt-token'
    );
    expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
      'repair_shop_auth_user',
      JSON.stringify({
        id: 1,
        username: 'testuser',
        email: 'test@example.com',
        confirmed: true,
        blocked: false,
      })
    );
  });

  it('should handle login failure', async () => {
    const errorResponse = {
      error: {
        status: 400,
        name: 'ValidationError',
        message: 'Invalid credentials',
      },
    };

    (fetch as jest.MockedFunction<typeof fetch>).mockResolvedValueOnce({
      ok: false,
      status: 400,
      json: async () => errorResponse,
    } as Response);

    const result = await handleLogin('test@example.com', 'wrongpassword');

    expect(result.success).toBe(false);
    expect(result.error).toBe('Invalid credentials');
  });
});