import React from 'react';
import { ComponentErrorBoundary } from '../components/ComponentErrorBoundary';

interface ErrorBoundaryOptions {
  componentName?: string;
  fallback?: React.ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
  onRetry?: () => void;
}

export function useErrorBoundary(options: ErrorBoundaryOptions = {}) {
  const Wrapper: React.FC<{ children: React.ReactNode }> = React.useCallback(
    ({ children }) => (
      <ComponentErrorBoundary
        componentName={options.componentName}
        fallback={options.fallback}
        onError={options.onError}
        onRetry={options.onRetry}
      >
        {children}
      </ComponentErrorBoundary>
    ),
    [options.componentName, options.fallback, options.onError, options.onRetry]
  );

  return {
    ErrorBoundary: Wrapper,
  };
}

// Usage example:
/*
function MyComponent() {
  const { ErrorBoundary } = useErrorBoundary({
    componentName: 'MyComponent',
    onError: (error, errorInfo) => {
      // Handle error
    },
    onRetry: () => {
      // Handle retry
    },
  });

  return (
    <ErrorBoundary>
      {* Your component content *}
    </ErrorBoundary>
  );
}
*/ 