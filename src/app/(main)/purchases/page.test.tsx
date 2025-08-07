import React from 'react';
import { render, screen } from '@testing-library/react';
import { useAuth } from '@/contexts/AuthContext';
import PurchasesPage from './page';

jest.mock('@/contexts/AuthContext', () => ({
  useAuth: jest.fn(),
}));

const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;

const renderWithAuth = (component: React.ReactElement) => {
  mockUseAuth.mockReturnValue({
    isAuthenticated: true,
    user: {
      id: 1,
      username: 'testuser', 
      email: 'test@example.com',
      confirmed: true,
      blocked: false
    },
    loading: false,
    error: null,
    login: jest.fn(),
    logout: jest.fn(),
    clearError: jest.fn(),
    checkAuthStatus: jest.fn()
  });

  return render(component);
};

describe('PurchasesPage', () => {
  it('should render the purchases page with correct title', () => {
    renderWithAuth(<PurchasesPage />);
    
    expect(screen.getByRole('heading', { name: 'Purchases' })).toBeInTheDocument();
  });

  it('should display new purchase order button', () => {
    renderWithAuth(<PurchasesPage />);
    
    expect(screen.getByRole('button', { name: /new purchase order/i })).toBeInTheDocument();
  });

  it('should display purchase metrics', () => {
    renderWithAuth(<PurchasesPage />);
    
    expect(screen.getByText('Active Purchase Orders')).toBeInTheDocument();
    expect(screen.getByText('Pending Deliveries')).toBeInTheDocument();
    expect(screen.getByText('Monthly Spend')).toBeInTheDocument();
    expect(screen.getByText('Total Value')).toBeInTheDocument();
  });

  it('should display descriptive text', () => {
    renderWithAuth(<PurchasesPage />);
    
    expect(screen.getByText('Record and manage purchase orders for inventory restocking.')).toBeInTheDocument();
  });

  it('should display recent purchase orders section', () => {
    renderWithAuth(<PurchasesPage />);
    
    expect(screen.getByText('Recent Purchase Orders')).toBeInTheDocument();
    expect(screen.getByText('No purchase orders yet. Create your first purchase order to get started.')).toBeInTheDocument();
  });
});