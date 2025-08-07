import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import UnauthorizedAccess from './UnauthorizedAccess';
import { RouteAccessError } from '@/lib/route-protection';

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

const mockPush = jest.fn();
const mockUseRouter = useRouter as jest.MockedFunction<typeof useRouter>;

describe('UnauthorizedAccess', () => {
  beforeEach(() => {
    mockUseRouter.mockReturnValue({
      push: mockPush,
    } as ReturnType<typeof useRouter>);
    mockPush.mockClear();
  });

  it('should display unauthorized error with login button', () => {
    const error: RouteAccessError = {
      type: 'unauthorized',
      message: 'You must be logged in to access this page.',
      redirectTo: '/login'
    };

    render(<UnauthorizedAccess error={error} />);
    
    expect(screen.getByText('Access Denied')).toBeInTheDocument();
    expect(screen.getByText(error.message)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /go to dashboard/i })).toBeInTheDocument();
  });

  it('should display forbidden error without login button', () => {
    const error: RouteAccessError = {
      type: 'forbidden',
      message: 'You do not have permission to access this page.',
      redirectTo: '/'
    };

    render(<UnauthorizedAccess error={error} />);
    
    expect(screen.getByText(error.message)).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /login/i })).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: /go to dashboard/i })).toBeInTheDocument();
  });

  it('should display token expired error with login button', () => {
    const error: RouteAccessError = {
      type: 'token_expired',
      message: 'Your session has expired. Please log in again.',
      redirectTo: '/login'
    };

    render(<UnauthorizedAccess error={error} />);
    
    expect(screen.getByText(error.message)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
  });

  it('should navigate to login when login button is clicked', () => {
    const error: RouteAccessError = {
      type: 'unauthorized',
      message: 'Test message',
      redirectTo: '/login'
    };

    render(<UnauthorizedAccess error={error} />);
    
    const loginButton = screen.getByRole('button', { name: /login/i });
    fireEvent.click(loginButton);
    
    expect(mockPush).toHaveBeenCalledWith('/login');
  });

  it('should navigate to dashboard when dashboard button is clicked', () => {
    const error: RouteAccessError = {
      type: 'forbidden',
      message: 'Test message'
    };

    render(<UnauthorizedAccess error={error} />);
    
    const dashboardButton = screen.getByRole('button', { name: /go to dashboard/i });
    fireEvent.click(dashboardButton);
    
    expect(mockPush).toHaveBeenCalledWith('/');
  });

  it('should not display action buttons when showActions is false', () => {
    const error: RouteAccessError = {
      type: 'unauthorized',
      message: 'Test message'
    };

    render(<UnauthorizedAccess error={error} showActions={false} />);
    
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });
});