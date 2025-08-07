import React from 'react';
import { render, screen } from '@testing-library/react';
import { useAuth } from '@/contexts/AuthContext';
import ProductsPage from './page';

// Mock the useAuth hook
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

describe('ProductsPage', () => {
  it('should render the products page with correct title', () => {
    renderWithAuth(<ProductsPage />);
    
    expect(screen.getByRole('heading', { name: 'Products' })).toBeInTheDocument();
  });

  it('should display add product button', () => {
    renderWithAuth(<ProductsPage />);
    
    expect(screen.getByRole('button', { name: /add product/i })).toBeInTheDocument();
  });

  it('should display product management sections', () => {
    renderWithAuth(<ProductsPage />);
    
    expect(screen.getByText('Product Catalog')).toBeInTheDocument();
    expect(screen.getByText('Add New Product')).toBeInTheDocument();
    expect(screen.getByText('Total Products')).toBeInTheDocument();
  });

  it('should display descriptive text', () => {
    renderWithAuth(<ProductsPage />);
    
    expect(screen.getByText('Manage your inventory of products and services.')).toBeInTheDocument();
  });
});