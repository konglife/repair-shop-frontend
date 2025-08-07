/**
 * Unit tests for AuthContext
 */

import React from 'react';
import { render, screen, act, waitFor } from '@testing-library/react';
import { AuthProvider, useAuth } from './AuthContext';
import * as authModule from '@/lib/auth';

// Mock Next.js navigation
const mockPush = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

// Mock the auth module
jest.mock('@/lib/auth', () => ({
  authAPI: {
    isAuthenticated: jest.fn(),
    getCurrentUser: jest.fn(),
    logout: jest.fn(),
  },
  handleLogin: jest.fn(),
  tokenStorage: {
    getToken: jest.fn(),
    setToken: jest.fn(),
    removeToken: jest.fn(),
    hasValidToken: jest.fn(),
  },
  userStorage: {
    getUser: jest.fn(),
    setUser: jest.fn(),
    removeUser: jest.fn(),
  },
}));

// Test component to access auth context
function TestComponent() {
  const { isAuthenticated, user, loading, error, login, logout, clearError } = useAuth();

  return (
    <div>
      <div data-testid="authenticated">{isAuthenticated.toString()}</div>
      <div data-testid="loading">{loading.toString()}</div>
      <div data-testid="error">{error || 'no-error'}</div>
      <div data-testid="user">{user ? user.email : 'no-user'}</div>
      <button
        data-testid="login-button"
        onClick={() => login('test@example.com', 'password')}
      >
        Login
      </button>
      <button data-testid="logout-button" onClick={() => logout()}>
        Logout
      </button>
      <button data-testid="logout-no-redirect-button" onClick={() => logout(false)}>
        Logout No Redirect
      </button>
      <button data-testid="clear-error-button" onClick={clearError}>
        Clear Error
      </button>
    </div>
  );
}

const mockUser = {
  id: 1,
  username: 'testuser',
  email: 'test@example.com',
  confirmed: true,
  blocked: false,
};

describe('AuthContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockPush.mockClear();
    // Mock console.error to avoid noise during tests
    jest.spyOn(console, 'error').mockImplementation(() => {});
    
    // Mock timers for periodic token validation tests
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.restoreAllMocks();
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  describe('useAuth hook', () => {
    it('should throw error when used outside AuthProvider', () => {
      // Suppress console.error for this test
      const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});

      expect(() => {
        render(<TestComponent />);
      }).toThrow('useAuth must be used within an AuthProvider');

      consoleError.mockRestore();
    });
  });

  describe('AuthProvider', () => {
    it('should initialize with loading state', () => {
      (authModule.authAPI.isAuthenticated as jest.Mock).mockReturnValue(false);
      (authModule.authAPI.getCurrentUser as jest.Mock).mockReturnValue(null);

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      expect(screen.getByTestId('authenticated')).toHaveTextContent('false');
      expect(screen.getByTestId('loading')).toHaveTextContent('false');
      expect(screen.getByTestId('error')).toHaveTextContent('no-error');
      expect(screen.getByTestId('user')).toHaveTextContent('no-user');
    });

    it('should initialize authenticated state when user is logged in', () => {
      (authModule.authAPI.isAuthenticated as jest.Mock).mockReturnValue(true);
      (authModule.authAPI.getCurrentUser as jest.Mock).mockReturnValue(mockUser);

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      expect(screen.getByTestId('authenticated')).toHaveTextContent('true');
      expect(screen.getByTestId('user')).toHaveTextContent('test@example.com');
    });

    it('should handle successful login', async () => {
      (authModule.authAPI.isAuthenticated as jest.Mock).mockReturnValue(false);
      (authModule.authAPI.getCurrentUser as jest.Mock).mockReturnValue(null);
      (authModule.handleLogin as jest.Mock).mockResolvedValue({
        success: true,
        user: mockUser,
      });

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      // Initial state
      expect(screen.getByTestId('authenticated')).toHaveTextContent('false');

      // Perform login
      act(() => {
        screen.getByTestId('login-button').click();
      });

      // Should show loading state
      expect(screen.getByTestId('loading')).toHaveTextContent('true');

      // Wait for login to complete
      await waitFor(() => {
        expect(screen.getByTestId('authenticated')).toHaveTextContent('true');
      });

      expect(screen.getByTestId('user')).toHaveTextContent('test@example.com');
      expect(screen.getByTestId('loading')).toHaveTextContent('false');
      expect(screen.getByTestId('error')).toHaveTextContent('no-error');
    });

    it('should handle login failure', async () => {
      (authModule.authAPI.isAuthenticated as jest.Mock).mockReturnValue(false);
      (authModule.authAPI.getCurrentUser as jest.Mock).mockReturnValue(null);
      (authModule.handleLogin as jest.Mock).mockResolvedValue({
        success: false,
        error: 'Invalid credentials',
      });

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      // Perform login
      act(() => {
        screen.getByTestId('login-button').click();
      });

      // Wait for login to complete
      await waitFor(() => {
        expect(screen.getByTestId('error')).toHaveTextContent('Invalid credentials');
      });

      expect(screen.getByTestId('authenticated')).toHaveTextContent('false');
      expect(screen.getByTestId('loading')).toHaveTextContent('false');
    });

    it('should handle login exception', async () => {
      (authModule.authAPI.isAuthenticated as jest.Mock).mockReturnValue(false);
      (authModule.authAPI.getCurrentUser as jest.Mock).mockReturnValue(null);
      (authModule.handleLogin as jest.Mock).mockRejectedValue(new Error('Network error'));

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      // Perform login
      act(() => {
        screen.getByTestId('login-button').click();
      });

      // Wait for error to appear
      await waitFor(() => {
        expect(screen.getByTestId('error')).toHaveTextContent('Network error');
      });

      expect(screen.getByTestId('authenticated')).toHaveTextContent('false');
      expect(screen.getByTestId('loading')).toHaveTextContent('false');
    });

    it('should handle logout', () => {
      (authModule.authAPI.isAuthenticated as jest.Mock).mockReturnValue(true);
      (authModule.authAPI.getCurrentUser as jest.Mock).mockReturnValue(mockUser);

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      // Initial authenticated state
      expect(screen.getByTestId('authenticated')).toHaveTextContent('true');

      // Perform logout
      act(() => {
        screen.getByTestId('logout-button').click();
      });

      expect(authModule.authAPI.logout).toHaveBeenCalled();
      expect(screen.getByTestId('authenticated')).toHaveTextContent('false');
      expect(screen.getByTestId('user')).toHaveTextContent('no-user');
    });

    it('should handle logout error gracefully', () => {
      (authModule.authAPI.isAuthenticated as jest.Mock).mockReturnValue(true);
      (authModule.authAPI.getCurrentUser as jest.Mock).mockReturnValue(mockUser);
      (authModule.authAPI.logout as jest.Mock).mockImplementation(() => {
        throw new Error('Logout failed');
      });

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      // Perform logout
      act(() => {
        screen.getByTestId('logout-button').click();
      });

      // Should still clear auth state despite error
      expect(screen.getByTestId('authenticated')).toHaveTextContent('false');
      expect(screen.getByTestId('user')).toHaveTextContent('no-user');
    });

    it('should clear error', async () => {
      (authModule.authAPI.isAuthenticated as jest.Mock).mockReturnValue(false);
      (authModule.authAPI.getCurrentUser as jest.Mock).mockReturnValue(null);
      (authModule.handleLogin as jest.Mock).mockResolvedValue({
        success: false,
        error: 'Test error',
      });

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      // Create an error first
      act(() => {
        screen.getByTestId('login-button').click();
      });

      await waitFor(() => {
        expect(screen.getByTestId('error')).toHaveTextContent('Test error');
      });

      // Clear error
      act(() => {
        screen.getByTestId('clear-error-button').click();
      });

      expect(screen.getByTestId('error')).toHaveTextContent('no-error');
    });

    it('should handle auth status check error gracefully', () => {
      (authModule.authAPI.isAuthenticated as jest.Mock).mockImplementation(() => {
        throw new Error('Auth check failed');
      });

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      // Should show error message
      expect(screen.getByTestId('error')).toHaveTextContent('Authentication check failed');
      expect(screen.getByTestId('authenticated')).toHaveTextContent('false');
      expect(screen.getByTestId('user')).toHaveTextContent('no-user');
    });

    it('should redirect to login on logout by default', () => {
      (authModule.authAPI.isAuthenticated as jest.Mock).mockReturnValue(true);
      (authModule.authAPI.getCurrentUser as jest.Mock).mockReturnValue(mockUser);

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      // Perform logout
      act(() => {
        screen.getByTestId('logout-button').click();
      });

      expect(authModule.authAPI.logout).toHaveBeenCalled();
      expect(mockPush).toHaveBeenCalledWith('/login');
      expect(screen.getByTestId('authenticated')).toHaveTextContent('false');
    });

    it('should not redirect when logout called with redirectToLogin=false', () => {
      (authModule.authAPI.isAuthenticated as jest.Mock).mockReturnValue(true);
      (authModule.authAPI.getCurrentUser as jest.Mock).mockReturnValue(mockUser);

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      // Perform logout without redirect
      act(() => {
        screen.getByTestId('logout-no-redirect-button').click();
      });

      expect(authModule.authAPI.logout).toHaveBeenCalled();
      expect(mockPush).not.toHaveBeenCalled();
      expect(screen.getByTestId('authenticated')).toHaveTextContent('false');
    });

    it('should handle token expiration during initialization', () => {
      (authModule.authAPI.isAuthenticated as jest.Mock).mockReturnValue(false);
      (authModule.authAPI.getCurrentUser as jest.Mock)
        .mockReturnValueOnce(mockUser) // First call returns user (simulating expired token scenario)
        .mockReturnValue(null);

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      expect(screen.getByTestId('error')).toHaveTextContent('Your session has expired. Please log in again.');
      expect(screen.getByTestId('authenticated')).toHaveTextContent('false');
    });

    it('should perform periodic token validation', () => {
      (authModule.authAPI.isAuthenticated as jest.Mock)
        .mockReturnValueOnce(true) // Initial check
        .mockReturnValueOnce(false); // Periodic check - token expired
      (authModule.authAPI.getCurrentUser as jest.Mock).mockReturnValue(mockUser);

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      // Initial state should be authenticated
      expect(screen.getByTestId('authenticated')).toHaveTextContent('true');

      // Fast-forward 5 minutes to trigger periodic check
      act(() => {
        jest.advanceTimersByTime(5 * 60 * 1000);
      });

      // Should detect token expiration and logout
      expect(screen.getByTestId('error')).toHaveTextContent('Your session has expired. Please log in again.');
      expect(screen.getByTestId('authenticated')).toHaveTextContent('false');
      expect(mockPush).toHaveBeenCalledWith('/login');
    });

    it('should not run periodic validation when not authenticated', () => {
      const mockIsAuthenticated = jest.fn().mockReturnValue(false);
      (authModule.authAPI.isAuthenticated as jest.Mock) = mockIsAuthenticated;
      (authModule.authAPI.getCurrentUser as jest.Mock).mockReturnValue(null);

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      // Clear the initial call
      mockIsAuthenticated.mockClear();

      // Fast-forward 5 minutes
      act(() => {
        jest.advanceTimersByTime(5 * 60 * 1000);
      });

      // Should not call isAuthenticated again since user is not logged in
      expect(mockIsAuthenticated).not.toHaveBeenCalled();
    });
  });
});