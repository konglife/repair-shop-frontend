'use client';

import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { Box, CircularProgress } from '@mui/material';
import { authAPI, AuthUser, handleLogin } from '@/lib/auth';

// Authentication state interface
interface AuthState {
  isAuthenticated: boolean;
  user: AuthUser | null;
  loading: boolean;
  error: string | null;
}

// Authentication action types
type AuthAction =
  | { type: 'AUTH_LOADING' }
  | { type: 'AUTH_SUCCESS'; payload: AuthUser }
  | { type: 'AUTH_ERROR'; payload: string }
  | { type: 'AUTH_LOGOUT' }
  | { type: 'AUTH_CLEAR_ERROR' }
  | { type: 'AUTH_TOKEN_EXPIRED' };

// Authentication context interface
interface AuthContextType {
  // State
  isAuthenticated: boolean;
  user: AuthUser | null;
  loading: boolean;
  error: string | null;
  
  // Actions
  login: (email: string, password: string) => Promise<boolean>;
  logout: (redirectToLogin?: boolean) => void;
  clearError: () => void;
  checkAuthStatus: () => void;
}

// Initial state
const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  loading: true, // Start with loading true to check existing auth
  error: null,
};

// Auth reducer
function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'AUTH_LOADING':
      return {
        ...state,
        loading: true,
        error: null,
      };

    case 'AUTH_SUCCESS':
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload,
        loading: false,
        error: null,
      };

    case 'AUTH_ERROR':
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        loading: false,
        error: action.payload,
      };

    case 'AUTH_LOGOUT':
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        loading: false,
        error: null,
      };

    case 'AUTH_CLEAR_ERROR':
      return {
        ...state,
        error: null,
      };

    case 'AUTH_TOKEN_EXPIRED':
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        loading: false,
        error: 'Your session has expired. Please log in again.',
      };

    default:
      return state;
  }
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth provider props
interface AuthProviderProps {
  children: ReactNode;
}

// Auth provider component
export function AuthProvider({ children }: AuthProviderProps) {
  const [state, dispatch] = useReducer(authReducer, initialState);
  const router = useRouter();

  /**
   * Check existing authentication status on app startup
   */
  const checkAuthStatus = () => {
    try {
      const isAuthenticated = authAPI.isAuthenticated();
      
      if (isAuthenticated) {
        const user = authAPI.getCurrentUser();
        if (user) {
          dispatch({ type: 'AUTH_SUCCESS', payload: user });
          return;
        }
      }
      
      // Check if token exists but is expired
      const token = authAPI.getCurrentUser();
      if (!isAuthenticated && token) {
        // Token likely expired during isAuthenticated check
        dispatch({ type: 'AUTH_TOKEN_EXPIRED' });
      } else {
        // If no valid auth, ensure clean state
        dispatch({ type: 'AUTH_LOGOUT' });
      }
    } catch (error) {
      console.error('Auth status check failed:', error);
      dispatch({ type: 'AUTH_ERROR', payload: 'Authentication check failed' });
    }
  };

  /**
   * Login function
   */
  const login = async (email: string, password: string): Promise<boolean> => {
    dispatch({ type: 'AUTH_LOADING' });

    try {
      const result = await handleLogin(email, password);
      
      if (result.success && result.user) {
        dispatch({ type: 'AUTH_SUCCESS', payload: result.user });
        return true;
      } else {
        dispatch({ type: 'AUTH_ERROR', payload: result.error || 'Login failed' });
        return false;
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      dispatch({ type: 'AUTH_ERROR', payload: errorMessage });
      return false;
    }
  };

  /**
   * Logout function with redirect
   */
  const logout = (redirectToLogin = true) => {
    try {
      authAPI.logout();
      dispatch({ type: 'AUTH_LOGOUT' });
      
      // Redirect to login page after logout
      if (redirectToLogin) {
        router.push('/login');
      }
    } catch (error) {
      console.error('Logout error:', error);
      // Still dispatch logout to clear state even if cleanup fails
      dispatch({ type: 'AUTH_LOGOUT' });
      
      // Redirect even if logout fails to ensure user is logged out in UI
      if (redirectToLogin) {
        router.push('/login');
      }
    }
  };

  /**
   * Clear error function
   */
  const clearError = () => {
    dispatch({ type: 'AUTH_CLEAR_ERROR' });
  };

  // Check auth status on mount
  useEffect(() => {
    checkAuthStatus();
  }, []);

  // Periodic token validation (every 5 minutes)
  useEffect(() => {
    if (!state.isAuthenticated) return;

    const interval = setInterval(() => {
      try {
        const isStillAuthenticated = authAPI.isAuthenticated();
        if (!isStillAuthenticated && state.isAuthenticated) {
          // Token expired during periodic check
          dispatch({ type: 'AUTH_TOKEN_EXPIRED' });
          router.push('/login');
        }
      } catch (error) {
        console.error('Periodic auth check failed:', error);
      }
    }, 5 * 60 * 1000); // 5 minutes

    return () => clearInterval(interval);
  }, [state.isAuthenticated, router]);

  // Context value
  const contextValue: AuthContextType = {
    // State
    isAuthenticated: state.isAuthenticated,
    user: state.user,
    loading: state.loading,
    error: state.error,
    
    // Actions
    login,
    logout,
    clearError,
    checkAuthStatus,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * Custom hook to use authentication context
 */
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
}

/**
 * HOC to require authentication for components
 */
// Props interface for the withAuth HOC
export interface WithAuthProps {
  isAuthenticated: boolean;
}

export function withAuth<P extends object>(
  WrappedComponent: React.ComponentType<P>
): React.ComponentType<P> {
  const AuthenticatedComponent = (props: P) => {
    const { isAuthenticated, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
      // Redirect to login if not authenticated and not loading
      if (!loading && !isAuthenticated) {
        router.push('/login');
      }
    }, [isAuthenticated, loading, router]);

    // Show loading state while checking auth
    if (loading) {
      return (
        <Box 
          display="flex" 
          justifyContent="center" 
          alignItems="center" 
          minHeight="200px"
        >
          <CircularProgress />
        </Box>
      );
    }

    // Show loading while redirecting to login
    if (!isAuthenticated) {
      return (
        <Box 
          display="flex" 
          justifyContent="center" 
          alignItems="center" 
          minHeight="200px"
        >
          <CircularProgress />
        </Box>
      );
    }

    return <WrappedComponent {...props} />;
  };

  AuthenticatedComponent.displayName = `withAuth(${WrappedComponent.displayName || WrappedComponent.name})`;

  return AuthenticatedComponent;
}

/**
 * Hook to protect routes and handle authentication requirements
 */
export function useAuthGuard(options: { redirectTo?: string; showLoading?: boolean } = {}) {
  const { redirectTo = '/login' } = options;
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Redirect to specified route if not authenticated and not loading
    if (!loading && !isAuthenticated) {
      router.push(redirectTo);
    }
  }, [isAuthenticated, loading, router, redirectTo]);

  return {
    isAuthenticated,
    loading,
    isProtected: !loading && !isAuthenticated, // True when should show loading due to redirect
  };
}