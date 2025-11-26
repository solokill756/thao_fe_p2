import React from 'react';
import { render, screen } from '@testing-library/react';
import Providers from '../../providers/SessionProvider';

// Mock next-auth/react
jest.mock('next-auth/react', () => ({
  SessionProvider: jest.fn(({ children }) => <div>{children}</div>),
}));

describe('SessionProvider Component', () => {
  it('should render children', () => {
    render(
      <Providers>
        <div>Test Content</div>
      </Providers>
    );

    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('should render multiple children', () => {
    render(
      <Providers>
        <div>Child 1</div>
        <div>Child 2</div>
      </Providers>
    );

    expect(screen.getByText('Child 1')).toBeInTheDocument();
    expect(screen.getByText('Child 2')).toBeInTheDocument();
  });

  it('should wrap children with SessionProvider', () => {
    const { SessionProvider } = require('next-auth/react');
    render(
      <Providers>
        <div>Test</div>
      </Providers>
    );

    expect(SessionProvider).toHaveBeenCalled();
  });
});
