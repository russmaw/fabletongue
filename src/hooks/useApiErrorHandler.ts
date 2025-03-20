import { useCallback } from 'react';
import { useErrorHandler } from './useErrorHandler';

interface ApiError extends Error {
  status?: number;
  code?: string;
  response?: {
    data?: any;
    status?: number;
    headers?: Record<string, string>;
  };
}

interface ApiErrorHandlerOptions {
  source?: string;
  retryCount?: number;
  retryDelay?: number;
  onRetry?: () => void;
  onFallback?: () => void;
}

interface ApiErrorHandler {
  handleApiError: (error: ApiError | Error | unknown, options?: ApiErrorHandlerOptions) => void;
  wrapApiCall: <T>(apiCall: () => Promise<T>, options?: ApiErrorHandlerOptions) => Promise<T>;
}

const DEFAULT_RETRY_COUNT = 3;
const DEFAULT_RETRY_DELAY = 1000;

export const useApiErrorHandler = (defaultSource = 'API'): ApiErrorHandler => {
  const { handleError } = useErrorHandler(defaultSource);

  const formatApiError = (error: ApiError): string => {
    if (error.response?.data) {
      return `API Error (${error.response.status}): ${JSON.stringify(error.response.data)}`;
    }
    return error.message || 'Unknown API error';
  };

  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const handleApiError = useCallback((error: ApiError | Error | unknown, options?: ApiErrorHandlerOptions) => {
    const source = options?.source || defaultSource;
    const apiError = error as ApiError;

    // Format error message and metadata
    const errorMessage = formatApiError(apiError);
    const metadata = {
      status: apiError.response?.status,
      code: apiError.code,
      headers: apiError.response?.headers,
      data: apiError.response?.data,
    };

    // Log the error
    handleError(errorMessage, source, metadata);
  }, [defaultSource, handleError]);

  const wrapApiCall = useCallback(async <T>(
    apiCall: () => Promise<T>,
    options?: ApiErrorHandlerOptions
  ): Promise<T> => {
    const retryCount = options?.retryCount ?? DEFAULT_RETRY_COUNT;
    const retryDelay = options?.retryDelay ?? DEFAULT_RETRY_DELAY;
    let attempts = 0;

    while (attempts < retryCount) {
      try {
        return await apiCall();
      } catch (error) {
        attempts++;

        // Handle the error
        handleApiError(error, options);

        // If this was the last attempt, or it's a 4xx error (client error), don't retry
        const apiError = error as ApiError;
        if (
          attempts === retryCount ||
          (apiError.response?.status && apiError.response.status >= 400 && apiError.response.status < 500)
        ) {
          // Try fallback if provided
          if (options?.onFallback) {
            options.onFallback();
          }
          throw error;
        }

        // Notify of retry
        if (options?.onRetry) {
          options.onRetry();
        }

        // Wait before retrying
        await delay(retryDelay * attempts);
      }
    }

    throw new Error('Maximum retry attempts reached');
  }, [handleApiError]);

  return {
    handleApiError,
    wrapApiCall,
  };
};

export default useApiErrorHandler; 