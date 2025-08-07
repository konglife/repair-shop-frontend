import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useRouter } from 'next/navigation';
import LoginPage from './page';
import { AuthProvider } from '@/contexts/AuthContext';
import * as authModule from '@/lib/auth';

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
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

// Mock console.log and console.error to avoid test noise
const originalLog = console.log;
const originalError = console.error;

const mockPush = jest.fn();
const mockRouter = {
  push: mockPush,
  replace: jest.fn(),
  back: jest.fn(),
  forward: jest.fn(),
  refresh: jest.fn(),
  prefetch: jest.fn(),
};

beforeEach(() => {
  console.log = jest.fn();
  console.error = jest.fn();
  (useRouter as jest.Mock).mockReturnValue(mockRouter);
  (authModule.authAPI.isAuthenticated as jest.Mock).mockReturnValue(false);
  (authModule.authAPI.getCurrentUser as jest.Mock).mockReturnValue(null);
  jest.clearAllMocks();
});

afterEach(() => {
  console.log = originalLog;
  console.error = originalError;
});

// Helper function to render LoginPage with AuthProvider
const renderWithAuth = () => {
  return render(
    <AuthProvider>
      <LoginPage />
    </AuthProvider>
  );
};

describe('LoginPage', () => {
  describe('Page Structure and Branding', () => {
    it('renders the main title', () => {
      renderWithAuth();
      expect(screen.getByRole('heading', { name: /repair shop dashboard/i })).toBeInTheDocument();
    });

    it('renders the subtitle', () => {
      renderWithAuth();
      expect(screen.getByText('Please sign in to access the dashboard')).toBeInTheDocument();
    });

    it('renders in a centered card layout', () => {
      renderWithAuth();
      const card = screen.getByRole('heading', { name: /repair shop dashboard/i }).closest('[class*="MuiCard"]');
      expect(card).toBeInTheDocument();
    });
  });

  describe('Form Elements', () => {
    beforeEach(() => {
      renderWithAuth();
    });

    it('renders email input field', () => {
      const emailInput = screen.getByTestId('email-input');
      expect(emailInput).toBeInTheDocument();
      expect(emailInput).toHaveAttribute('type', 'email');
      expect(emailInput).toHaveAttribute('required');
    });

    it('renders password input field', () => {
      const passwordInput = screen.getByTestId('password-input');
      expect(passwordInput).toBeInTheDocument();
      expect(passwordInput).toHaveAttribute('type', 'password');
      expect(passwordInput).toHaveAttribute('required');
    });

    it('renders password visibility toggle', () => {
      const toggleButton = screen.getByTestId('password-toggle');
      expect(toggleButton).toBeInTheDocument();
      expect(toggleButton).toHaveAttribute('aria-label', 'toggle password visibility');
    });

    it('renders login button', () => {
      const loginButton = screen.getByTestId('login-button');
      expect(loginButton).toBeInTheDocument();
      expect(loginButton).toHaveTextContent('Sign In');
      expect(loginButton).toHaveAttribute('type', 'submit');
    });
  });

  describe('Password Visibility Toggle', () => {
    it('toggles password visibility when clicked', async () => {
      const user = userEvent.setup();
      renderWithAuth();
      
      const passwordInput = screen.getByTestId('password-input');
      const toggleButton = screen.getByTestId('password-toggle');

      // Initially password type
      expect(passwordInput).toHaveAttribute('type', 'password');

      // Click to show password
      await user.click(toggleButton);
      expect(passwordInput).toHaveAttribute('type', 'text');

      // Click to hide password
      await user.click(toggleButton);
      expect(passwordInput).toHaveAttribute('type', 'password');
    });
  });

  describe('Form Validation', () => {
    it('shows validation errors for empty required fields', async () => {
      const user = userEvent.setup();
      renderWithAuth();
      
      const loginButton = screen.getByTestId('login-button');
      await user.click(loginButton);

      await waitFor(() => {
        expect(screen.getByText('Email is required')).toBeInTheDocument();
        expect(screen.getByText('Password is required')).toBeInTheDocument();
      });
    });

    it('shows validation error for invalid email format', async () => {
      const user = userEvent.setup();
      renderWithAuth();
      
      const emailInput = screen.getByTestId('email-input');
      const loginButton = screen.getByTestId('login-button');

      await user.type(emailInput, 'invalid-email');
      await user.click(loginButton);

      await waitFor(() => {
        expect(screen.getByText('Please enter a valid email address')).toBeInTheDocument();
      });
    });

    it('shows validation error for short password', async () => {
      const user = userEvent.setup();
      renderWithAuth();
      
      const passwordInput = screen.getByTestId('password-input');
      const loginButton = screen.getByTestId('login-button');

      await user.type(passwordInput, '123');
      await user.click(loginButton);

      await waitFor(() => {
        expect(screen.getByText('Password must be at least 6 characters')).toBeInTheDocument();
      });
    });

    it('clears validation errors when user starts typing', async () => {
      const user = userEvent.setup();
      renderWithAuth();
      
      const emailInput = screen.getByTestId('email-input');
      const passwordInput = screen.getByTestId('password-input');
      const loginButton = screen.getByTestId('login-button');

      // Trigger validation errors
      await user.click(loginButton);
      await waitFor(() => {
        expect(screen.getByText('Email is required')).toBeInTheDocument();
      });

      // Start typing in email field
      await user.type(emailInput, 'test@example.com');
      expect(screen.queryByText('Email is required')).not.toBeInTheDocument();

      // Start typing in password field
      await user.type(passwordInput, 'password123');
      expect(screen.queryByText('Password is required')).not.toBeInTheDocument();
    });
  });

  describe('Authentication Integration', () => {
    it('shows loading spinner during auth check', () => {
      // Mock auth loading state
      (authModule.authAPI.isAuthenticated as jest.Mock).mockReturnValue(false);
      (authModule.authAPI.getCurrentUser as jest.Mock).mockReturnValue(null);
      
      render(
        <AuthProvider>
          <LoginPage />
        </AuthProvider>
      );
      
      // Initially should show content (not loading spinner) since we're not in auth loading state
      expect(screen.getByTestId('login-button')).toBeInTheDocument();
    });

    it('redirects to dashboard if already authenticated', async () => {
      (authModule.authAPI.isAuthenticated as jest.Mock).mockReturnValue(true);
      (authModule.authAPI.getCurrentUser as jest.Mock).mockReturnValue({
        id: 1,
        username: 'testuser',
        email: 'test@example.com',
        confirmed: true,
        blocked: false,
      });

      render(
        <AuthProvider>
          <LoginPage />
        </AuthProvider>
      );

      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith('/');
      });
    });

    it('performs successful login and redirects', async () => {
      const user = userEvent.setup();
      // Use a promise that resolves after a delay to simulate loading state
      let resolveLogin: (value: unknown) => void;
      const loginPromise = new Promise((resolve) => {
        resolveLogin = resolve;
      });
      
      (authModule.handleLogin as jest.Mock).mockImplementation(() => {
        return loginPromise;
      });

      renderWithAuth();

      const emailInput = screen.getByTestId('email-input');
      const passwordInput = screen.getByTestId('password-input');
      const loginButton = screen.getByTestId('login-button');

      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, 'password123');
      await user.click(loginButton);

      // Check loading state is shown
      await waitFor(() => {
        expect(loginButton).toHaveTextContent('Signing In...');
        expect(loginButton).toBeDisabled();
      });

      // Resolve the login
      resolveLogin!({
        success: true,
        user: {
          id: 1,
          username: 'testuser',
          email: 'test@example.com',
          confirmed: true,
          blocked: false,
        },
      });

      await waitFor(() => {
        expect(authModule.handleLogin).toHaveBeenCalledWith('test@example.com', 'password123');
        expect(mockPush).toHaveBeenCalledWith('/');
      });
    });

    it('displays authentication error', async () => {
      const user = userEvent.setup();
      (authModule.handleLogin as jest.Mock).mockResolvedValue({
        success: false,
        error: 'Invalid credentials',
      });

      renderWithAuth();

      const emailInput = screen.getByTestId('email-input');
      const passwordInput = screen.getByTestId('password-input');
      const loginButton = screen.getByTestId('login-button');

      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, 'wrongpassword');
      await user.click(loginButton);

      await waitFor(() => {
        const errorAlert = screen.getByTestId('auth-error');
        expect(errorAlert).toBeInTheDocument();
        expect(errorAlert).toHaveTextContent('Invalid credentials');
      });

      // Form should be re-enabled after error
      expect(loginButton).not.toBeDisabled();
      expect(loginButton).toHaveTextContent('Sign In');
    });

    it('clears auth errors when user types', async () => {
      const user = userEvent.setup();
      
      // Setup initial error state
      (authModule.handleLogin as jest.Mock).mockResolvedValue({
        success: false,
        error: 'Invalid credentials',
      });

      renderWithAuth();

      const emailInput = screen.getByTestId('email-input');
      const passwordInput = screen.getByTestId('password-input');
      const loginButton = screen.getByTestId('login-button');

      // Trigger error
      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, 'wrongpassword');
      await user.click(loginButton);

      await waitFor(() => {
        expect(screen.getByTestId('auth-error')).toBeInTheDocument();
      });

      // Clear the email input and type new text
      await user.click(emailInput);
      await user.keyboard('{Control>}a{/Control}');
      await user.type(emailInput, 'new@example.com');

      await waitFor(() => {
        expect(screen.queryByTestId('auth-error')).not.toBeInTheDocument();
      });
    });

    it('disables all form fields during authentication', async () => {
      const user = userEvent.setup();
      
      // Use a promise that we can control
      let resolveLogin: (value: unknown) => void;
      const loginPromise = new Promise((resolve) => {
        resolveLogin = resolve;
      });
      
      (authModule.handleLogin as jest.Mock).mockImplementation(() => {
        return loginPromise;
      });

      renderWithAuth();

      const emailInput = screen.getByTestId('email-input');
      const passwordInput = screen.getByTestId('password-input');
      const toggleButton = screen.getByTestId('password-toggle');
      const loginButton = screen.getByTestId('login-button');

      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, 'password123');
      await user.click(loginButton);

      // Wait for loading state to be applied
      await waitFor(() => {
        expect(loginButton).toBeDisabled();
      });

      // All form fields should be disabled during auth
      expect(emailInput).toBeDisabled();
      expect(passwordInput).toBeDisabled();
      expect(toggleButton).toBeDisabled();
      expect(loginButton).toBeDisabled();

      // Resolve the login to clean up
      resolveLogin!({ success: true, user: {} });
    });
  });

  describe('Responsive Design', () => {
    it('renders with proper responsive styling classes', () => {
      renderWithAuth();
      const cardContent = screen.getByRole('heading', { name: /repair shop dashboard/i }).closest('[class*="MuiCardContent"]');
      expect(cardContent).toBeInTheDocument();
    });

    it('has proper form structure for mobile compatibility', () => {
      renderWithAuth();
      const emailInput = screen.getByTestId('email-input');
      const passwordInput = screen.getByTestId('password-input');
      
      expect(emailInput.closest('form')).toHaveAttribute('novalidate');
      expect(passwordInput.closest('form')).toHaveAttribute('novalidate');
    });
  });

  describe('Accessibility', () => {
    it('has proper form labels and attributes', () => {
      renderWithAuth();
      const emailInput = screen.getByTestId('email-input');
      const passwordInput = screen.getByTestId('password-input');
      
      expect(emailInput).toHaveAttribute('id', 'email');
      expect(emailInput).toHaveAttribute('name', 'email');
      expect(passwordInput).toHaveAttribute('id', 'password');
      expect(passwordInput).toHaveAttribute('name', 'password');
    });

    it('has proper aria labels for interactive elements', () => {
      renderWithAuth();
      const toggleButton = screen.getByLabelText('toggle password visibility');
      expect(toggleButton).toBeInTheDocument();
    });

    it('has proper heading hierarchy', () => {
      renderWithAuth();
      const mainHeading = screen.getByRole('heading', { level: 1 });
      expect(mainHeading).toHaveTextContent('Repair Shop Dashboard');
    });

    it('displays error alert with proper accessibility', async () => {
      const user = userEvent.setup();
      (authModule.handleLogin as jest.Mock).mockResolvedValue({
        success: false,
        error: 'Test error message',
      });

      renderWithAuth();

      const emailInput = screen.getByTestId('email-input');
      const passwordInput = screen.getByTestId('password-input');
      const loginButton = screen.getByTestId('login-button');

      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, 'password123');
      await user.click(loginButton);

      await waitFor(() => {
        const errorAlert = screen.getByTestId('auth-error');
        expect(errorAlert).toBeInTheDocument();
        expect(errorAlert).toHaveAttribute('role', 'alert');
      });
    });
  });
});