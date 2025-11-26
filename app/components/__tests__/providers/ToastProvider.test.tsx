import React from 'react';
import { render } from '@testing-library/react';
import { ToastProviders } from '../../providers/ToastProvider';

// Mock react-hot-toast
jest.mock('react-hot-toast', () => ({
  Toaster: jest.fn(() => <div data-testid="toaster" />),
}));

describe('ToastProvider Component', () => {
  it('should render children', () => {
    const { getByText } = render(
      <ToastProviders>
        <div>Test Content</div>
      </ToastProviders>
    );
    expect(getByText('Test Content')).toBeInTheDocument();
  });

  it('should render Toaster component', () => {
    const { getByTestId } = render(
      <ToastProviders>
        <div>Test</div>
      </ToastProviders>
    );
    expect(getByTestId('toaster')).toBeInTheDocument();
  });

  it('should render multiple children', () => {
    const { getByText } = render(
      <ToastProviders>
        <div>Child 1</div>
        <div>Child 2</div>
        <div>Child 3</div>
      </ToastProviders>
    );
    expect(getByText('Child 1')).toBeInTheDocument();
    expect(getByText('Child 2')).toBeInTheDocument();
    expect(getByText('Child 3')).toBeInTheDocument();
  });
});
