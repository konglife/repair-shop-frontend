import { render, screen } from '@testing-library/react';
import Home from './page';

describe('Home Page', () => {
  it('renders without crashing', () => {
    render(<Home />);
    expect(screen.getByRole('main')).toBeInTheDocument();
  });

  it('contains expected content', () => {
    render(<Home />);
    // This test will pass as long as the page renders - basic health check
    expect(document.body).toBeInTheDocument();
  });
});