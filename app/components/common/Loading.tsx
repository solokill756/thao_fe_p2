import React from 'react';

interface LoadingProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  overlay?: boolean;
  variant?: 'spinner' | 'dots' | 'bars' | 'pulse';
  backdropColor?: string;
  textColor?: string;
  spinnerColor?: string;
  fullScreen?: boolean;
}

const Loading: React.FC<LoadingProps> = ({
  size = 'md',
  text,
  overlay = false,
  variant = 'spinner',
  backdropColor = 'bg-black bg-opacity-50',
  textColor = 'text-gray-600',
  spinnerColor = 'border-t-blue-600',
  fullScreen = false,
}) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
  };

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
  };

  const renderSpinner = () => {
    switch (variant) {
      case 'dots':
        return (
          <div className="flex gap-1">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className={`${sizeClasses[size]} rounded-full ${spinnerColor} animate-bounce`}
                style={{ animationDelay: `${i * 0.1}s` }}
              />
            ))}
          </div>
        );
      case 'bars':
        return (
          <div className="flex gap-1">
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className={`w-1 h-8 ${spinnerColor} animate-pulse`}
                style={{ animationDelay: `${i * 0.1}s` }}
              />
            ))}
          </div>
        );
      case 'pulse':
        return (
          <div
            className={`${sizeClasses[size]} rounded-full ${spinnerColor} animate-pulse`}
          />
        );
      default:
        return (
          <div
            className={`${sizeClasses[size]} animate-spin rounded-full border-2 border-gray-300 ${spinnerColor}`}
          />
        );
    }
  };

  const spinnerContent = (
    <div className="flex flex-col items-center justify-center gap-3">
      {renderSpinner()}
      {text && (
        <p className={`${textColor} ${textSizeClasses[size]}`}>{text}</p>
      )}
    </div>
  );

  if (overlay) {
    return (
      <div
        className={`${
          fullScreen ? 'fixed' : 'absolute'
        } inset-0 ${backdropColor} flex items-center justify-center z-50`}
      >
        <div className="bg-white p-6 rounded-lg shadow-lg">
          {spinnerContent}
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center py-8">
      {spinnerContent}
    </div>
  );
};

export default Loading;
