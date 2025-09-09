import { ConversionJob, BatchConversion } from '@/types';

// Error types
export enum ErrorType {
  FILE_VALIDATION = 'FILE_VALIDATION',
  CODEC_LOADING = 'CODEC_LOADING',
  IMAGE_PROCESSING = 'IMAGE_PROCESSING',
  EDGE_PROCESSING = 'EDGE_PROCESSING',
  WORKER_ERROR = 'WORKER_ERROR',
  NETWORK_ERROR = 'NETWORK_ERROR',
  MEMORY_ERROR = 'MEMORY_ERROR',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
}

export interface AppError {
  type: ErrorType;
  message: string;
  details?: any;
  timestamp: Date;
  context?: {
    file?: string;
    batchId?: string;
    jobId?: string;
    settings?: any;
  };
}

// Error handler class
export class ErrorHandler {
  private errors: AppError[] = [];
  private maxErrors = 100; // Keep only last 100 errors

  /**
   * Handle and log an error
   */
  handleError(
    error: Error | string,
    type: ErrorType = ErrorType.UNKNOWN_ERROR,
    context?: AppError['context']
  ): AppError {
    const appError: AppError = {
      type,
      message: typeof error === 'string' ? error : error.message,
      details: typeof error === 'object' ? error : undefined,
      timestamp: new Date(),
      context,
    };

    this.errors.unshift(appError);
    
    // Keep only the last maxErrors
    if (this.errors.length > this.maxErrors) {
      this.errors = this.errors.slice(0, this.maxErrors);
    }

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('App Error:', appError);
    }

    return appError;
  }

  /**
   * Handle file validation errors
   */
  handleFileValidationError(
    file: File,
    reason: string
  ): AppError {
    return this.handleError(
      `File validation failed: ${reason}`,
      ErrorType.FILE_VALIDATION,
      { file: file.name }
    );
  }

  /**
   * Handle codec loading errors
   */
  handleCodecLoadingError(
    codecName: string,
    error: Error
  ): AppError {
    return this.handleError(
      `Failed to load codec ${codecName}: ${error.message}`,
      ErrorType.CODEC_LOADING,
      { codecName }
    );
  }

  /**
   * Handle image processing errors
   */
  handleImageProcessingError(
    file: File,
    error: Error,
    settings?: any
  ): AppError {
    return this.handleError(
      `Image processing failed: ${error.message}`,
      ErrorType.IMAGE_PROCESSING,
      { file: file.name, settings }
    );
  }

  /**
   * Handle edge processing errors
   */
  handleEdgeProcessingError(
    file: File,
    error: Error,
    settings?: any
  ): AppError {
    return this.handleError(
      `Edge processing failed: ${error.message}`,
      ErrorType.EDGE_PROCESSING,
      { file: file.name, settings }
    );
  }

  /**
   * Handle worker errors
   */
  handleWorkerError(
    jobId: string,
    error: Error
  ): AppError {
    return this.handleError(
      `Worker error: ${error.message}`,
      ErrorType.WORKER_ERROR,
      { jobId }
    );
  }

  /**
   * Handle network errors
   */
  handleNetworkError(
    url: string,
    error: Error
  ): AppError {
    return this.handleError(
      `Network error: ${error.message}`,
      ErrorType.NETWORK_ERROR,
      { url }
    );
  }

  /**
   * Handle memory errors
   */
  handleMemoryError(
    operation: string,
    error: Error
  ): AppError {
    return this.handleError(
      `Memory error during ${operation}: ${error.message}`,
      ErrorType.MEMORY_ERROR,
      { operation }
    );
  }

  /**
   * Get all errors
   */
  getErrors(): AppError[] {
    return [...this.errors];
  }

  /**
   * Get errors by type
   */
  getErrorsByType(type: ErrorType): AppError[] {
    return this.errors.filter(error => error.type === type);
  }

  /**
   * Get recent errors
   */
  getRecentErrors(count: number = 10): AppError[] {
    return this.errors.slice(0, count);
  }

  /**
   * Clear all errors
   */
  clearErrors(): void {
    this.errors = [];
  }

  /**
   * Clear errors by type
   */
  clearErrorsByType(type: ErrorType): void {
    this.errors = this.errors.filter(error => error.type !== type);
  }

  /**
   * Get error summary
   */
  getErrorSummary(): {
    total: number;
    byType: Record<ErrorType, number>;
    recent: number;
  } {
    const byType = Object.values(ErrorType).reduce((acc, type) => {
      acc[type] = this.getErrorsByType(type).length;
      return acc;
    }, {} as Record<ErrorType, number>);

    return {
      total: this.errors.length,
      byType,
      recent: this.getRecentErrors(5).length,
    };
  }

  /**
   * Check if there are critical errors
   */
  hasCriticalErrors(): boolean {
    const criticalTypes = [
      ErrorType.MEMORY_ERROR,
      ErrorType.CODEC_LOADING,
    ];
    
    return criticalTypes.some(type => 
      this.getErrorsByType(type).length > 0
    );
  }

  /**
   * Get user-friendly error message
   */
  getUserFriendlyMessage(error: AppError): string {
    switch (error.type) {
      case ErrorType.FILE_VALIDATION:
        return 'The selected file is not supported or is corrupted. Please try a different file.';
      
      case ErrorType.CODEC_LOADING:
        return 'Failed to load image processing engine. Please refresh the page and try again.';
      
      case ErrorType.IMAGE_PROCESSING:
        return 'Failed to process the image. The file might be corrupted or in an unsupported format.';
      
      case ErrorType.EDGE_PROCESSING:
        return 'Server processing failed. Please try again or use a different file.';
      
      case ErrorType.WORKER_ERROR:
        return 'Background processing failed. Please try again.';
      
      case ErrorType.NETWORK_ERROR:
        return 'Network connection failed. Please check your internet connection and try again.';
      
      case ErrorType.MEMORY_ERROR:
        return 'Not enough memory to process this file. Please try a smaller file or close other applications.';
      
      default:
        return 'An unexpected error occurred. Please try again.';
    }
  }

  /**
   * Get error recovery suggestions
   */
  getRecoverySuggestions(error: AppError): string[] {
    switch (error.type) {
      case ErrorType.FILE_VALIDATION:
        return [
          'Try a different image file',
          'Check if the file is not corrupted',
          'Ensure the file format is supported',
        ];
      
      case ErrorType.CODEC_LOADING:
        return [
          'Refresh the page',
          'Check your internet connection',
          'Try using a different browser',
        ];
      
      case ErrorType.IMAGE_PROCESSING:
        return [
          'Try a different image file',
          'Reduce the image size',
          'Try a different output format',
        ];
      
      case ErrorType.EDGE_PROCESSING:
        return [
          'Try again in a few moments',
          'Use a smaller file',
          'Try local processing instead',
        ];
      
      case ErrorType.WORKER_ERROR:
        return [
          'Refresh the page',
          'Try processing fewer files at once',
          'Close other browser tabs',
        ];
      
      case ErrorType.NETWORK_ERROR:
        return [
          'Check your internet connection',
          'Try again in a few moments',
          'Use a different network',
        ];
      
      case ErrorType.MEMORY_ERROR:
        return [
          'Close other applications',
          'Try a smaller file',
          'Process files one at a time',
        ];
      
      default:
        return [
          'Refresh the page',
          'Try again',
          'Contact support if the problem persists',
        ];
    }
  }
}

// Singleton instance
export const errorHandler = new ErrorHandler();

// Utility functions
export function isRetryableError(error: AppError): boolean {
  const retryableTypes = [
    ErrorType.NETWORK_ERROR,
    ErrorType.EDGE_PROCESSING,
    ErrorType.WORKER_ERROR,
  ];
  
  return retryableTypes.includes(error.type);
}

export function getErrorSeverity(error: AppError): 'low' | 'medium' | 'high' | 'critical' {
  switch (error.type) {
    case ErrorType.FILE_VALIDATION:
      return 'low';
    
    case ErrorType.IMAGE_PROCESSING:
    case ErrorType.EDGE_PROCESSING:
      return 'medium';
    
    case ErrorType.WORKER_ERROR:
    case ErrorType.NETWORK_ERROR:
      return 'high';
    
    case ErrorType.MEMORY_ERROR:
    case ErrorType.CODEC_LOADING:
      return 'critical';
    
    default:
      return 'medium';
  }
}

export function shouldShowErrorToUser(error: AppError): boolean {
  const severity = getErrorSeverity(error);
  return severity !== 'low';
}

