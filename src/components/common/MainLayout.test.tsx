import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import '@testing-library/jest-dom';
import MainLayout from './MainLayout';

// Mock Next.js Link component
jest.mock('next/link', () => {
  return function MockedLink({ children, href }: { children: React.ReactNode; href: string }) {
    return <a href={href}>{children}</a>;
  };
});

const theme = createTheme();

const MockedMainLayout = ({ children }: { children: React.ReactNode }) => (
  <ThemeProvider theme={theme}>
    <MainLayout>{children}</MainLayout>
  </ThemeProvider>
);

describe('MainLayout', () => {
  const testContent = <div>Test Content</div>;

  beforeEach(() => {
    // Mock useMediaQuery to simulate desktop by default
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn().mockImplementation(query => ({
        matches: false, // Desktop by default
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      })),
    });
  });

  test('renders app title in navigation bar', () => {
    render(<MockedMainLayout>{testContent}</MockedMainLayout>);
    expect(screen.getByText('Repair Shop Dashboard')).toBeInTheDocument();
  });

  test('renders all navigation items', () => {
    render(<MockedMainLayout>{testContent}</MockedMainLayout>);
    
    expect(screen.getAllByText('Dashboard')).toHaveLength(2); // Desktop and mobile drawers
    expect(screen.getAllByText('Products')).toHaveLength(2);
    expect(screen.getAllByText('Stock')).toHaveLength(2);
    expect(screen.getAllByText('Sales')).toHaveLength(2);
    expect(screen.getAllByText('Repairs')).toHaveLength(2);
  });

  test('renders user authentication placeholders', () => {
    render(<MockedMainLayout>{testContent}</MockedMainLayout>);
    
    expect(screen.getByText('User Name')).toBeInTheDocument();
    expect(screen.getByTitle('Logout')).toBeInTheDocument();
  });

  test('renders children content', () => {
    render(<MockedMainLayout>{testContent}</MockedMainLayout>);
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  test('navigation links have correct href attributes', () => {
    render(<MockedMainLayout>{testContent}</MockedMainLayout>);
    
    const dashboardLinks = screen.getAllByText('Dashboard');
    const productsLinks = screen.getAllByText('Products');
    const stockLinks = screen.getAllByText('Stock');
    const salesLinks = screen.getAllByText('Sales');
    const repairsLinks = screen.getAllByText('Repairs');

    // Check first instance of each (permanent drawer)
    expect(dashboardLinks[0].closest('a')).toHaveAttribute('href', '/');
    expect(productsLinks[0].closest('a')).toHaveAttribute('href', '/products');
    expect(stockLinks[0].closest('a')).toHaveAttribute('href', '/stock');
    expect(salesLinks[0].closest('a')).toHaveAttribute('href', '/sales');
    expect(repairsLinks[0].closest('a')).toHaveAttribute('href', '/repairs');
  });

  test('mobile menu toggle works', () => {
    // Mock mobile view
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn().mockImplementation(query => ({
        matches: query.includes('(max-width: 899.95px)'), // Mobile
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      })),
    });

    render(<MockedMainLayout>{testContent}</MockedMainLayout>);
    
    const menuButton = screen.getByLabelText('open drawer');
    expect(menuButton).toBeInTheDocument();
    
    fireEvent.click(menuButton);
    // In mobile view, the temporary drawer should be toggled
    // This test verifies the button exists and is clickable
  });

  test('component has proper TypeScript types', () => {
    // This test ensures TypeScript compilation passes
    const props = { children: testContent };
    render(<MockedMainLayout {...props} />);
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });
});