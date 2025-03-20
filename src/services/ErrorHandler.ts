import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface ErrorLog {
  id: string;
  timestamp: string;
  type: 'error' | 'warning';
  message: string;
  source: string;
  stack?: string;
  metadata?: Record<string, unknown>;
}

interface ErrorState {
  errors: ErrorLog[];
  isLoading: boolean;
  maxLogs: number;
}

const STORAGE_KEY = '@error_logs';
const DEFAULT_MAX_LOGS = 100;

export const useErrorStore = create<ErrorState & {
  logError: (error: Error | string, source: string, metadata?: Record<string, unknown>) => Promise<void>;
  logWarning: (message: string, source: string, metadata?: Record<string, unknown>) => Promise<void>;
  clearLogs: () => Promise<void>;
  exportLogs: () => Promise<string>;
}>((set, get) => ({
  errors: [],
  isLoading: false,
  maxLogs: DEFAULT_MAX_LOGS,

  logError: async (error: Error | string, source: string, metadata?: Record<string, unknown>) => {
    try {
      const { errors, maxLogs } = get();
      const errorLog: ErrorLog = {
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        type: 'error',
        message: error instanceof Error ? error.message : error,
        source,
        stack: error instanceof Error ? error.stack : undefined,
        metadata,
      };

      // Add new error and maintain max logs limit
      const updatedErrors = [errorLog, ...errors].slice(0, maxLogs);
      set({ errors: updatedErrors });

      // Save to storage
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedErrors));

      // Log to console in development
      if (__DEV__) {
        console.error(`[${source}] ${errorLog.message}`, {
          stack: errorLog.stack,
          metadata: errorLog.metadata,
        });
      }
    } catch (storageError) {
      console.error('Failed to save error log:', storageError);
    }
  },

  logWarning: async (message: string, source: string, metadata?: Record<string, unknown>) => {
    try {
      const { errors, maxLogs } = get();
      const warningLog: ErrorLog = {
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        type: 'warning',
        message,
        source,
        metadata,
      };

      // Add new warning and maintain max logs limit
      const updatedErrors = [warningLog, ...errors].slice(0, maxLogs);
      set({ errors: updatedErrors });

      // Save to storage
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedErrors));

      // Log to console in development
      if (__DEV__) {
        console.warn(`[${source}] ${warningLog.message}`, {
          metadata: warningLog.metadata,
        });
      }
    } catch (storageError) {
      console.error('Failed to save warning log:', storageError);
    }
  },

  clearLogs: async () => {
    try {
      set({ errors: [] });
      await AsyncStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error('Failed to clear error logs:', error);
    }
  },

  exportLogs: async () => {
    const { errors } = get();
    return JSON.stringify(errors, null, 2);
  },
}));

export const initializeErrorHandler = async () => {
  try {
    // Load saved logs
    const savedLogs = await AsyncStorage.getItem(STORAGE_KEY);
    if (savedLogs) {
      const logs = JSON.parse(savedLogs) as ErrorLog[];
      useErrorStore((state) => ({ ...state, errors: logs }));
    }
  } catch (error) {
    console.error('Failed to initialize error handler:', error);
  }
};

// Helper function to format error for display
export const formatError = (error: ErrorLog): string => {
  const timestamp = new Date(error.timestamp).toLocaleString();
  return `[${timestamp}] ${error.type.toUpperCase()} in ${error.source}: ${error.message}`;
};

// Helper function to get error type color
export const getErrorTypeColor = (type: ErrorLog['type']): string => {
  return type === 'error' ? '#FF4444' : '#FFBB33';
};

export default useErrorStore; 