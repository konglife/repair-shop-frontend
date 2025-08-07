import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LoginPage from './page';

// Mock console.log and console.error to avoid test noise
const originalLog = console.log;
const originalError = console.error;

beforeEach(() => {
  console.log = jest.fn();
  console.error = jest.fn();
});

afterEach(() => {
  console.log = originalLog;
  console.error = originalError;
});

describe('LoginPage', () => {
  beforeEach(() => {
    render(<LoginPage />);
  });

  describe('Page Structure and Branding', () => {
    it('renders the main title', () => {
      expect(screen.getByRole('heading', { name: /repair shop dashboard/i })).toBeInTheDocument();
    });

    it('renders the subtitle', () => {
      expect(screen.getByText('Please sign in to access the dashboard')).toBeInTheDocument();
    });

    it('renders in a centered card layout', () => {
      const card = screen.getByRole('heading', { name: /repair shop dashboard/i }).closest('[class*="MuiCard"]');
      expect(card).toBeInTheDocument();
    });
  });

  describe('Form Elements', () => {
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
      const loginButton = screen.getByTestId('login-button');

      await user.click(loginButton);

      await waitFor(() => {
        expect(screen.getByText('Email is required')).toBeInTheDocument();
        expect(screen.getByText('Password is required')).toBeInTheDocument();
      });
    });

    it('shows validation error for invalid email format', async () => {
      const user = userEvent.setup();
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

  describe('Form Submission and Loading State', () => {
    it('shows loading state when form is submitted', async () => {
      const user = userEvent.setup();
      const emailInput = screen.getByTestId('email-input');
      const passwordInput = screen.getByTestId('password-input');
      const loginButton = screen.getByTestId('login-button');

      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, 'password123');
      await user.click(loginButton);

      // Should show loading state
      expect(loginButton).toHaveTextContent('Signing In...');
      expect(loginButton).toBeDisabled();
      expect(emailInput).toBeDisabled();
      expect(passwordInput).toBeDisabled();
    });

    it('disables form fields during loading', async () => {
      const user = userEvent.setup();
      const emailInput = screen.getByTestId('email-input');
      const passwordInput = screen.getByTestId('password-input');
      const toggleButton = screen.getByTestId('password-toggle');
      const loginButton = screen.getByTestId('login-button');

      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, 'password123');
      await user.click(loginButton);

      expect(emailInput).toBeDisabled();
      expect(passwordInput).toBeDisabled();
      expect(toggleButton).toBeDisabled();
    });

    it('submits form with valid data', async () => {
      const user = userEvent.setup();
      const emailInput = screen.getByTestId('email-input');
      const passwordInput = screen.getByTestId('password-input');
      const loginButton = screen.getByTestId('login-button');

      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, 'password123');
      await user.click(loginButton);

      // Wait for form submission to complete
      await waitFor(() => {
        expect(loginButton).toHaveTextContent('Sign In');
        expect(loginButton).not.toBeDisabled();
      }, { timeout: 3000 });

      // Check that console.log was called with form data
      expect(console.log).toHaveBeenCalledWith('Login form submitted:', {
        email: 'test@example.com',
        password: 'password123',
      });
    });
  });

  describe('Responsive Design', () => {
    it('renders with proper responsive styling classes', () => {
      const cardContent = screen.getByRole('heading', { name: /repair shop dashboard/i }).closest('[class*="MuiCardContent"]');
      expect(cardContent).toBeInTheDocument();
    });

    it('has proper form structure for mobile compatibility', () => {
      // Check that form elements exist and are properly structured
      const emailInput = screen.getByTestId('email-input');
      const passwordInput = screen.getByTestId('password-input');
      
      expect(emailInput.closest('form')).toHaveAttribute('novalidate');
      expect(passwordInput.closest('form')).toHaveAttribute('novalidate');
    });
  });

  describe('Accessibility', () => {
    it('has proper form labels and attributes', () => {
      // MUI TextFields use complex label association, test via data-testid instead
      const emailInput = screen.getByTestId('email-input');
      const passwordInput = screen.getByTestId('password-input');
      
      expect(emailInput).toHaveAttribute('id', 'email');
      expect(emailInput).toHaveAttribute('name', 'email');
      expect(passwordInput).toHaveAttribute('id', 'password');
      expect(passwordInput).toHaveAttribute('name', 'password');
    });

    it('has proper aria labels for interactive elements', () => {
      const toggleButton = screen.getByLabelText('toggle password visibility');
      expect(toggleButton).toBeInTheDocument();
    });

    it('has proper heading hierarchy', () => {
      const mainHeading = screen.getByRole('heading', { level: 1 });
      expect(mainHeading).toHaveTextContent('Repair Shop Dashboard');
    });
  });
});