import { 
  extractImageMetadata, 
  validateImageFile, 
  formatFileSize, 
  calculateCompressionRatio 
} from '../image-metadata';

// Mock File constructor
const createMockFile = (name: string, type: string, size: number): File => {
  const file = new File([''], name, { type });
  Object.defineProperty(file, 'size', { value: size });
  return file;
};

// Mock Image constructor
const mockImage = {
  naturalWidth: 1920,
  naturalHeight: 1080,
  onload: null,
  onerror: null,
  src: '',
};

// Mock URL.createObjectURL and URL.revokeObjectURL
const mockCreateObjectURL = jest.fn(() => 'mock-url');
const mockRevokeObjectURL = jest.fn();

global.URL.createObjectURL = mockCreateObjectURL;
global.URL.revokeObjectURL = mockRevokeObjectURL;

// Mock Image constructor
global.Image = jest.fn(() => mockImage) as any;

describe('image-metadata', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('extractImageMetadata', () => {
    it('should extract metadata from a valid image file', async () => {
      const file = createMockFile('test.jpg', 'image/jpeg', 1024000);
      
      // Mock successful image load
      setTimeout(() => {
        if (mockImage.onload) {
          mockImage.onload(new Event('load'));
        }
      }, 0);

      const metadata = await extractImageMetadata(file);

      expect(metadata).toEqual({
        width: 1920,
        height: 1080,
        format: 'jpg',
        size: 1024000,
        hasAlpha: false,
        hasExif: false,
      });

      expect(mockCreateObjectURL).toHaveBeenCalledWith(file);
      expect(mockRevokeObjectURL).toHaveBeenCalledWith('mock-url');
    });

    it('should handle different file formats', async () => {
      const pngFile = createMockFile('test.png', 'image/png', 2048000);
      
      setTimeout(() => {
        if (mockImage.onload) {
          mockImage.onload(new Event('load'));
        }
      }, 0);

      const metadata = await extractImageMetadata(pngFile);

      expect(metadata.format).toBe('png');
      expect(metadata.hasAlpha).toBe(true);
    });

    it('should handle image load errors', async () => {
      const file = createMockFile('test.jpg', 'image/jpeg', 1024000);
      
      setTimeout(() => {
        if (mockImage.onerror) {
          mockImage.onerror(new Event('error'));
        }
      }, 0);

      await expect(extractImageMetadata(file)).rejects.toThrow('Failed to load image');
    });
  });

  describe('validateImageFile', () => {
    it('should validate a valid image file', () => {
      const file = createMockFile('test.jpg', 'image/jpeg', 1024000);
      const result = validateImageFile(file);

      expect(result.valid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('should reject files that are too large', () => {
      const file = createMockFile('test.jpg', 'image/jpeg', 300 * 1024 * 1024); // 300MB
      const result = validateImageFile(file);

      expect(result.valid).toBe(false);
      expect(result.error).toContain('exceeds maximum allowed size');
    });

    it('should reject unsupported file types', () => {
      const file = createMockFile('test.txt', 'text/plain', 1024);
      const result = validateImageFile(file);

      expect(result.valid).toBe(false);
      expect(result.error).toContain('Unsupported file type');
    });

    it('should accept various supported image types', () => {
      const supportedTypes = [
        'image/jpeg',
        'image/png',
        'image/webp',
        'image/avif',
        'image/heic',
        'image/heif',
        'image/tiff',
        'image/bmp',
        'image/gif',
        'image/svg+xml'
      ];

      supportedTypes.forEach(type => {
        const file = createMockFile('test', type, 1024000);
        const result = validateImageFile(file);
        expect(result.valid).toBe(true);
      });
    });
  });

  describe('formatFileSize', () => {
    it('should format bytes correctly', () => {
      expect(formatFileSize(0)).toBe('0 Bytes');
      expect(formatFileSize(1024)).toBe('1 KB');
      expect(formatFileSize(1024 * 1024)).toBe('1 MB');
      expect(formatFileSize(1024 * 1024 * 1024)).toBe('1 GB');
    });

    it('should handle decimal values', () => {
      expect(formatFileSize(1536)).toBe('1.5 KB');
      expect(formatFileSize(1536 * 1024)).toBe('1.5 MB');
    });
  });

  describe('calculateCompressionRatio', () => {
    it('should calculate compression ratio correctly', () => {
      expect(calculateCompressionRatio(1000, 500)).toBe(50);
      expect(calculateCompressionRatio(1000, 800)).toBe(20);
      expect(calculateCompressionRatio(1000, 1000)).toBe(0);
    });

    it('should handle zero original size', () => {
      expect(calculateCompressionRatio(0, 500)).toBe(0);
    });

    it('should handle negative compression (file got larger)', () => {
      expect(calculateCompressionRatio(1000, 1200)).toBe(-20);
    });
  });
});
