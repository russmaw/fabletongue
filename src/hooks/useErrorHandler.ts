import { useCallback } from 'react';
import { useErrorStore } from '../services/ErrorHandler';

interface ErrorHandlerHook {
  handleError: (error: Error | string, source: string, metadata?: Record<string, unknown>) => void;
  handleWarning: (message: string, source: string, metadata?: Record<string, unknown>) => void;
  clearErrors: () => void;
  exportErrors: () => Promise<string>;
}

export const useErrorHandler = (defaultSource?: string): ErrorHandlerHook => {
  const { logError, logWarning, clearLogs, exportLogs } = useErrorStore();

  const handleError = useCallback(
    (error: Error | string, source: string = defaultSource || 'unknown', metadata?: Record<string, unknown>) => {
      logError(error, source, metadata).catch((err) => {
        console.error('Failed to log error:', err);
      });
    },
    [logError, defaultSource]
  );

  const handleWarning = useCallback(
    (message: string, source: string = defaultSource || 'unknown', metadata?: Record<string, unknown>) => {
      logWarning(message, source, metadata).catch((err) => {
        console.error('Failed to log warning:', err);
      });
    },
    [logWarning, defaultSource]
  );

  const clearErrors = useCallback(() => {
    clearLogs().catch((err) => {
      console.error('Failed to clear error logs:', err);
    });
  }, [clearLogs]);

  const exportErrors = useCallback(async () => {
    try {
      return await exportLogs();
    } catch (error) {
      console.error('Failed to export error logs:', error);
      return '';
    }
  }, [exportLogs]);

  return {
    handleError,
    handleWarning,
    clearErrors,
    exportErrors,
  };
};

export default useErrorHandler; 