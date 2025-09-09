import { ErrorHandler, ErrorType, getErrorSeverity, isRetryableError, shouldShowErrorToUser } from '../error-handler';

describe('ErrorHandler', () => {
  let errorHandler: ErrorHandler;

  beforeEach(() => {
    errorHandler = new ErrorHandler();
  });

  describe('handleError', () => {
    it('should handle string errors', () => {
      const error = errorHandler.handleError('Test error', ErrorType.UNKNOWN_ERROR);
      
      expect(error.type).toBe(ErrorType.UNKNOWN_ERROR);
      expect(error.message).toBe('Test error');
      expect(error.timestamp).toBeInstanceOf(Date);
    });

    it('should handle Error objects', () => {
      const testError = new Error('Test error message');
      const error = errorHandler.handleError(testError, ErrorType.IMAGE_PROCESSING);
      
      expect(error.type).toBe(ErrorType.IMAGE_PROCESSING);
      expect(error.message).toBe('Test error message');
      expect(error.details).toBe(testError);
    });

    it('should include context when provided', () => {
      const context = { file: 'test.jpg', batchId: 'batch-123' };
      const error = errorHandler.handleError('Test error', ErrorType.FILE_VALIDATION, context);
      
      expect(error.context).toEqual(context);
    });

    it('should maintain error history', () => {
      errorHandler.handleError('Error 1', ErrorType.FILE_VALIDATION);
      errorHandler.handleError('Error 2', ErrorType.IMAGE_PROCESSING);
      
      const errors = errorHandler.getErrors();
      expect(errors).toHaveLength(2);
      expect(errors[0].message).toBe('Error 2'); // Most recent first
      expect(errors[1].message).toBe('Error 1');
    });
  });

  describe('specialized error handlers', () => {
    it('should handle file validation errors', () => {
      const file = new File([''], 'test.jpg', { type: 'image/jpeg' });
      const error = errorHandler.handleFileValidationError(file, 'File too large');
      
      expect(error.type).toBe(ErrorType.FILE_VALIDATION);
      expect(error.message).toContain('File validation failed');
      expect(error.message).toContain('File too large');
      expect(error.context?.file).toBe('test.jpg');
    });

    it('should handle codec loading errors', () => {
      const testError = new Error('Failed to load WASM module');
      const error = errorHandler.handleCodecLoadingError('mozjpeg', testError);
      
      expect(error.type).toBe(ErrorType.CODEC_LOADING);
      expect(error.message).toContain('Failed to load codec mozjpeg');
      expect(error.context?.codecName).toBe('mozjpeg');
    });

    it('should handle image processing errors', () => {
      const file = new File([''], 'test.jpg', { type: 'image/jpeg' });
      const testError = new Error('Canvas processing failed');
      const settings = { format: 'webp', quality: 85 };
      
      const error = errorHandler.handleImageProcessingError(file, testError, settings);
      
      expect(error.type).toBe(ErrorType.IMAGE_PROCESSING);
      expect(error.message).toContain('Image processing failed');
      expect(error.context?.file).toBe('test.jpg');
      expect(error.context?.settings).toBe(settings);
    });

    it('should handle edge processing errors', () => {
      const file = new File([''], 'test.heic', { type: 'image/heic' });
      const testError = new Error('Server processing failed');
      const settings = { format: 'jpg', quality: 90 };
      
      const error = errorHandler.handleEdgeProcessingError(file, testError, settings);
      
      expect(error.type).toBe(ErrorType.EDGE_PROCESSING);
      expect(error.message).toContain('Edge processing failed');
      expect(error.context?.file).toBe('test.heic');
    });

    it('should handle worker errors', () => {
      const testError = new Error('Worker thread crashed');
      const error = errorHandler.handleWorkerError('job-123', testError);
      
      expect(error.type).toBe(ErrorType.WORKER_ERROR);
      expect(error.message).toContain('Worker error');
      expect(error.context?.jobId).toBe('job-123');
    });

    it('should handle network errors', () => {
      const testError = new Error('Connection timeout');
      const error = errorHandler.handleNetworkError('/api/convert', testError);
      
      expect(error.type).toBe(ErrorType.NETWORK_ERROR);
      expect(error.message).toContain('Network error');
      expect(error.context?.url).toBe('/api/convert');
    });

    it('should handle memory errors', () => {
      const testError = new Error('Out of memory');
      const error = errorHandler.handleMemoryError('image processing', testError);
      
      expect(error.type).toBe(ErrorType.MEMORY_ERROR);
      expect(error.message).toContain('Memory error during image processing');
      expect(error.context?.operation).toBe('image processing');
    });
  });

  describe('error management', () => {
    it('should get errors by type', () => {
      errorHandler.handleError('Error 1', ErrorType.FILE_VALIDATION);
      errorHandler.handleError('Error 2', ErrorType.IMAGE_PROCESSING);
      errorHandler.handleError('Error 3', ErrorType.FILE_VALIDATION);
      
      const fileValidationErrors = errorHandler.getErrorsByType(ErrorType.FILE_VALIDATION);
      expect(fileValidationErrors).toHaveLength(2);
      expect(fileValidationErrors[0].message).toBe('Error 3');
      expect(fileValidationErrors[1].message).toBe('Error 1');
    });

    it('should get recent errors', () => {
      errorHandler.handleError('Error 1', ErrorType.FILE_VALIDATION);
      errorHandler.handleError('Error 2', ErrorType.IMAGE_PROCESSING);
      errorHandler.handleError('Error 3', ErrorType.CODEC_LOADING);
      errorHandler.handleError('Error 4', ErrorType.NETWORK_ERROR);
      errorHandler.handleError('Error 5', ErrorType.WORKER_ERROR);
      
      const recentErrors = errorHandler.getRecentErrors(3);
      expect(recentErrors).toHaveLength(3);
      expect(recentErrors[0].message).toBe('Error 5');
      expect(recentErrors[1].message).toBe('Error 4');
      expect(recentErrors[2].message).toBe('Error 3');
    });

    it('should clear all errors', () => {
      errorHandler.handleError('Error 1', ErrorType.FILE_VALIDATION);
      errorHandler.handleError('Error 2', ErrorType.IMAGE_PROCESSING);
      
      expect(errorHandler.getErrors()).toHaveLength(2);
      
      errorHandler.clearErrors();
      expect(errorHandler.getErrors()).toHaveLength(0);
    });

    it('should clear errors by type', () => {
      errorHandler.handleError('Error 1', ErrorType.FILE_VALIDATION);
      errorHandler.handleError('Error 2', ErrorType.IMAGE_PROCESSING);
      errorHandler.handleError('Error 3', ErrorType.FILE_VALIDATION);
      
      errorHandler.clearErrorsByType(ErrorType.FILE_VALIDATION);
      
      const remainingErrors = errorHandler.getErrors();
      expect(remainingErrors).toHaveLength(1);
      expect(remainingErrors[0].type).toBe(ErrorType.IMAGE_PROCESSING);
    });
  });

  describe('error summary', () => {
    it('should provide error summary', () => {
      errorHandler.handleError('Error 1', ErrorType.FILE_VALIDATION);
      errorHandler.handleError('Error 2', ErrorType.IMAGE_PROCESSING);
      errorHandler.handleError('Error 3', ErrorType.FILE_VALIDATION);
      errorHandler.handleError('Error 4', ErrorType.CODEC_LOADING);
      
      const summary = errorHandler.getErrorSummary();
      
      expect(summary.total).toBe(4);
      expect(summary.byType[ErrorType.FILE_VALIDATION]).toBe(2);
      expect(summary.byType[ErrorType.IMAGE_PROCESSING]).toBe(1);
      expect(summary.byType[ErrorType.CODEC_LOADING]).toBe(1);
      expect(summary.recent).toBe(4); // All errors are recent
    });

    it('should detect critical errors', () => {
      errorHandler.handleError('Error 1', ErrorType.FILE_VALIDATION);
      expect(errorHandler.hasCriticalErrors()).toBe(false);
      
      errorHandler.handleError('Error 2', ErrorType.MEMORY_ERROR);
      expect(errorHandler.hasCriticalErrors()).toBe(true);
    });
  });

  describe('user-friendly messages', () => {
    it('should provide user-friendly error messages', () => {
      const fileValidationError = errorHandler.handleError('Test', ErrorType.FILE_VALIDATION);
      const message = errorHandler.getUserFriendlyMessage(fileValidationError);
      
      expect(message).toContain('not supported');
      expect(message).toContain('try a different file');
    });

    it('should provide recovery suggestions', () => {
      const networkError = errorHandler.handleError('Test', ErrorType.NETWORK_ERROR);
      const suggestions = errorHandler.getRecoverySuggestions(networkError);
      
      expect(suggestions).toContain('Check your internet connection');
      expect(suggestions).toContain('Try again in a few moments');
    });
  });
});

describe('error utility functions', () => {
  describe('getErrorSeverity', () => {
    it('should return correct severity levels', () => {
      expect(getErrorSeverity({ type: ErrorType.FILE_VALIDATION, message: 'Test', timestamp: new Date() })).toBe('low');
      expect(getErrorSeverity({ type: ErrorType.IMAGE_PROCESSING, message: 'Test', timestamp: new Date() })).toBe('medium');
      expect(getErrorSeverity({ type: ErrorType.WORKER_ERROR, message: 'Test', timestamp: new Date() })).toBe('high');
      expect(getErrorSeverity({ type: ErrorType.MEMORY_ERROR, message: 'Test', timestamp: new Date() })).toBe('critical');
    });
  });

  describe('isRetryableError', () => {
    it('should identify retryable errors', () => {
      const retryableError = { type: ErrorType.NETWORK_ERROR, message: 'Test', timestamp: new Date() };
      const nonRetryableError = { type: ErrorType.FILE_VALIDATION, message: 'Test', timestamp: new Date() };
      
      expect(isRetryableError(retryableError)).toBe(true);
      expect(isRetryableError(nonRetryableError)).toBe(false);
    });
  });

  describe('shouldShowErrorToUser', () => {
    it('should determine which errors to show to users', () => {
      const lowSeverityError = { type: ErrorType.FILE_VALIDATION, message: 'Test', timestamp: new Date() };
      const highSeverityError = { type: ErrorType.MEMORY_ERROR, message: 'Test', timestamp: new Date() };
      
      expect(shouldShowErrorToUser(lowSeverityError)).toBe(false);
      expect(shouldShowErrorToUser(highSeverityError)).toBe(true);
    });
  });
});

