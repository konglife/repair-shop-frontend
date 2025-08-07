import React from 'react';
import { render, screen } from '@testing-library/react';
import { usePathname } from 'next/navigation';
import Breadcrumbs from './Breadcrumbs';

// Mock Next.js navigation
jest.mock('next/navigation', () => ({
  usePathname: jest.fn(),
}));

const mockUsePathname = usePathname as jest.MockedFunction<typeof usePathname>;

describe('Breadcrumbs', () => {
  it('should not render breadcrumbs for root path', () => {
    mockUsePathname.mockReturnValue('/');
    
    const { container } = render(<Breadcrumbs />);
    expect(container.firstChild).toBeNull();
  });

  it('should render breadcrumbs for nested paths', () => {
    mockUsePathname.mockReturnValue('/products');
    
    render(<Breadcrumbs />);
    
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Products')).toBeInTheDocument();
  });

  it('should render custom breadcrumb items', () => {
    const customItems = [
      { label: 'Home', href: '/' },
      { label: 'Custom Section', href: '/custom' },
      { label: 'Current Page' }
    ];

    render(<Breadcrumbs items={customItems} />);
    
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Custom Section')).toBeInTheDocument();
    expect(screen.getByText('Current Page')).toBeInTheDocument();
  });

  it('should render links for navigable breadcrumbs', () => {
    mockUsePathname.mockReturnValue('/products');
    
    render(<Breadcrumbs />);
    
    const dashboardLink = screen.getByText('Dashboard').closest('a');
    expect(dashboardLink).toHaveAttribute('href', '/');
    
    // Current page should not be a link
    const productsText = screen.getByText('Products');
    expect(productsText.closest('a')).toBeNull();
  });

  it('should display home icon for dashboard', () => {
    mockUsePathname.mockReturnValue('/products');
    
    render(<Breadcrumbs />);
    
    const homeIcon = screen.getByTestId('HomeIcon');
    expect(homeIcon).toBeInTheDocument();
  });

  it('should render breadcrumbs for purchases path', () => {
    mockUsePathname.mockReturnValue('/purchases');
    
    render(<Breadcrumbs />);
    
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Purchases')).toBeInTheDocument();
  });
});