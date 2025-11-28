import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import RenderAuthInput from '../RenderAuthInput';

describe('RenderAuthInput Component', () => {
  const mockOnChange = jest.fn();
  const mockIcon = <svg data-testid="test-icon" />;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Basic Rendering', () => {
    it('should render input with label', () => {
      render(
        <RenderAuthInput
          id="email"
          name="email"
          label="Email"
          icon={mockIcon}
          type="email"
          value=""
          onChange={mockOnChange}
          placeholder="Enter email"
        />
      );
      expect(screen.getByLabelText('Email')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Enter email')).toBeInTheDocument();
    });

    it('should render icon', () => {
      render(
        <RenderAuthInput
          id="email"
          name="email"
          label="Email"
          icon={mockIcon}
          type="email"
          value=""
          onChange={mockOnChange}
          placeholder="Enter email"
        />
      );
      expect(screen.getByTestId('test-icon')).toBeInTheDocument();
    });
  });

  describe('Input Attributes', () => {
    it('should have correct type attribute', () => {
      render(
        <RenderAuthInput
          id="password"
          name="password"
          label="Password"
          icon={mockIcon}
          type="password"
          value=""
          onChange={mockOnChange}
          placeholder="Enter password"
        />
      );
      const input = screen.getByLabelText('Password');
      expect(input).toHaveAttribute('type', 'password');
    });

    it('should have correct id and name', () => {
      render(
        <RenderAuthInput
          id="username"
          name="username"
          label="Username"
          icon={mockIcon}
          type="text"
          value=""
          onChange={mockOnChange}
          placeholder="Enter username"
        />
      );
      const input = screen.getByLabelText('Username');
      expect(input).toHaveAttribute('id', 'username');
      expect(input).toHaveAttribute('name', 'username');
    });

    it('should display value', () => {
      render(
        <RenderAuthInput
          id="email"
          name="email"
          label="Email"
          icon={mockIcon}
          type="email"
          value="test@example.com"
          onChange={mockOnChange}
          placeholder="Enter email"
        />
      );
      const input = screen.getByLabelText('Email');
      expect(input).toHaveValue('test@example.com');
    });
  });

  describe('User Interactions', () => {
    it('should call onChange when input value changes', () => {
      render(
        <RenderAuthInput
          id="email"
          name="email"
          label="Email"
          icon={mockIcon}
          type="email"
          value=""
          onChange={mockOnChange}
          placeholder="Enter email"
        />
      );
      const input = screen.getByLabelText('Email');
      fireEvent.change(input, { target: { value: 'new@example.com' } });
      expect(mockOnChange).toHaveBeenCalledTimes(1);
    });
  });

  describe('Styling', () => {
    it('should have correct input classes', () => {
      render(
        <RenderAuthInput
          id="email"
          name="email"
          label="Email"
          icon={mockIcon}
          type="email"
          value=""
          onChange={mockOnChange}
          placeholder="Enter email"
        />
      );
      const input = screen.getByLabelText('Email');
      expect(input).toHaveClass('w-full', 'pl-10', 'pr-3', 'py-2');
    });
  });
});

