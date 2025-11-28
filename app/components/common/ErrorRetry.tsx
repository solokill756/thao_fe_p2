'use client';

import React from 'react';
import { FiAlertCircle, FiRefreshCw } from 'react-icons/fi';

interface ErrorRetryProps {
  /** Error object, string, or null. If Error object, will use error.message */
  error?: Error | string | null;
  /** Callback function when retry button is clicked */
  onRetry?: () => void;
  /** Optional title text displayed above error message */
  title?: string;
  /** Custom error message. If not provided, will use error.message or default message */
  message?: string;
  /** Label text for retry button. Default: "Retry" */
  retryLabel?: string;
  /** Size variant: 'sm' | 'md' | 'lg'. Default: 'md' */
  size?: 'sm' | 'md' | 'lg';
  /** Style variant: 'default' (red), 'minimal' (transparent), 'card' (white card). Default: 'default' */
  variant?: 'default' | 'minimal' | 'card';
  /** Additional CSS classes */
  className?: string;
  /** Show/hide error icon. Default: true */
  showIcon?: boolean;
  /** Show/hide retry button. Default: true */
  showRetry?: boolean;
}

const ErrorRetry: React.FC<ErrorRetryProps> = ({
  error,
  onRetry,
  title,
  message,
  retryLabel = 'Retry',
  size = 'md',
  variant = 'default',
  className = '',
  showIcon = true,
  showRetry = true,
}) => {
  const getErrorMessage = (): string => {
    if (message) return message;
    if (typeof error === 'string') return error;
    if (error instanceof Error) return error.message;
    return 'An error occurred. Please try again.';
  };

  const errorMessage = getErrorMessage();

  const sizeClasses = {
    sm: {
      container: 'py-4 px-4',
      icon: 'w-5 h-5',
      title: 'text-sm font-semibold',
      message: 'text-xs',
      button: 'px-3 py-1.5 text-xs',
    },
    md: {
      container: 'py-8 px-6',
      icon: 'w-6 h-6',
      title: 'text-base font-semibold',
      message: 'text-sm',
      button: 'px-4 py-2 text-sm',
    },
    lg: {
      container: 'py-12 px-8',
      icon: 'w-8 h-8',
      title: 'text-lg font-semibold',
      message: 'text-base',
      button: 'px-6 py-3 text-base',
    },
  };

  const variantClasses = {
    default: 'bg-red-50 border border-red-200 text-red-800',
    minimal: 'bg-transparent text-gray-700',
    card: 'bg-white border border-gray-200 shadow-sm text-gray-800 rounded-lg',
  };

  const buttonVariantClasses = {
    default: 'bg-red-600 hover:bg-red-700 text-white',
    minimal: 'bg-gray-200 hover:bg-gray-300 text-gray-700',
    card: 'bg-blue-600 hover:bg-blue-700 text-white',
  };

  const currentSize = sizeClasses[size];
  const currentVariant = variantClasses[variant];
  const currentButtonVariant = buttonVariantClasses[variant];

  const content = (
    <div
      className={`
        ${currentSize.container}
        ${currentVariant}
        ${className}
        flex flex-col items-center justify-center text-center
      `}
    >
      {showIcon && (
        <div className="mb-4">
          <FiAlertCircle
            className={`${currentSize.icon} ${
              variant === 'minimal' ? 'text-red-500' : 'text-red-600'
            }`}
          />
        </div>
      )}

      {title && <h3 className={`${currentSize.title} mb-2`}>{title}</h3>}

      <p className={`${currentSize.message} mb-6 max-w-md`}>{errorMessage}</p>

      {showRetry && onRetry && (
        <button
          onClick={onRetry}
          className={`
            ${currentSize.button}
            ${currentButtonVariant}
            rounded-md
            font-medium
            transition-colors
            duration-200
            flex items-center gap-2
            focus:outline-none focus:ring-2 focus:ring-offset-2
            ${
              variant === 'default'
                ? 'focus:ring-red-500'
                : variant === 'minimal'
                  ? 'focus:ring-gray-400'
                  : 'focus:ring-blue-500'
            }
          `}
          type="button"
        >
          <FiRefreshCw className="w-4 h-4" />
          {retryLabel}
        </button>
      )}
    </div>
  );

  if (variant === 'card') {
    return <div className="max-w-lg mx-auto">{content}</div>;
  }

  return content;
};

export default ErrorRetry;
