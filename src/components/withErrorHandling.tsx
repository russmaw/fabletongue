import React, { ComponentType } from 'react';
import { ComponentErrorBoundary } from './ComponentErrorBoundary';

interface WithErrorHandlingOptions {
  componentName?: string;
  fallback?: React.ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
  onRetry?: () => void;
}

export function withErrorHandling<P extends object>(
  WrappedComponent: ComponentType<P>,
  options: WithErrorHandlingOptions = {}
) {
  const componentName = options.componentName || WrappedComponent.displayName || WrappedComponent.name;

  // Override console.error and console.warn to capture errors
  const originalError = console.error;
  const originalWarn = console.warn;

  console.error = (...args: any[]) => {
    // Log the error to your error reporting service
    if (options.onError) {
      const error = args[0] instanceof Error ? args[0] : new Error(args.join(' '));
      options.onError(error, { componentStack: '' });
    }
    // Call the original console.error
    originalError.apply(console, args);
  };

  console.warn = (...args: any[]) => {
    // Log the warning to your error reporting service
    if (options.onError) {
      const warning = new Error(args.join(' '));
      options.onError(warning, { componentStack: '' });
    }
    // Call the original console.warn
    originalWarn.apply(console, args);
  };

  const WithErrorHandling: React.FC<P> = (props) => {
    return (
      <ComponentErrorBoundary
        componentName={componentName}
        fallback={options.fallback}
        onError={options.onError}
        onRetry={options.onRetry}
      >
        <WrappedComponent {...props} />
      </ComponentErrorBoundary>
    );
  };

  WithErrorHandling.displayName = `withErrorHandling(${componentName})`;

  return WithErrorHandling;
}

// Usage example:
/*
const MyComponentWithErrorHandling = withErrorHandling(MyComponent, {
  componentName: 'MyComponent',
  onError: (error, errorInfo) => {
    // Handle error
  },
  onRetry: () => {
    // Handle retry
  },
});
*/ 