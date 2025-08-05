import { render, screen } from '@testing-library/react';
import LoginPage from './page';

describe('Login Page', () => {
  it('renders without crashing', () => {
    render(<LoginPage />);
    expect(screen.getByText('Login Page')).toBeInTheDocument();
  });

  it('displays placeholder message', () => {
    render(<LoginPage />);
    expect(screen.getByText('Login functionality will be implemented in future stories.')).toBeInTheDocument();
  });
});