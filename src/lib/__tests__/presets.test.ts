import { 
  PRESETS, 
  getSuggestedFormat, 
  getOptimalSettings, 
  validateSettings 
} from '../presets';
import { ConversionSettings } from '@/types';

describe('presets', () => {
  describe('PRESETS', () => {
    it('should have all required presets', () => {
      expect(PRESETS).toHaveProperty('web-optimized');
      expect(PRESETS).toHaveProperty('visually-lossless');
      expect(PRESETS).toHaveProperty('smallest-size');
      expect(PRESETS).toHaveProperty('print');
    });

    it('should have correct preset structure', () => {
      Object.values(PRESETS).forEach(preset => {
        expect(preset).toHaveProperty('id');
        expect(preset).toHaveProperty('name');
        expect(preset).toHaveProperty('description');
        expect(preset).toHaveProperty('settings');
        expect(preset).toHaveProperty('targetFormats');
        
        expect(preset.settings).toHaveProperty('format');
        // Quality is optional for lossless formats
        if (!preset.settings.lossless) {
          expect(preset.settings).toHaveProperty('quality');
        }
      });
    });

    it('should have valid settings for each preset', () => {
      Object.values(PRESETS).forEach(preset => {
        const errors = validateSettings(preset.settings);
        expect(errors).toHaveLength(0);
      });
    });
  });

  describe('getSuggestedFormat', () => {
    it('should suggest appropriate formats for different source formats', () => {
      expect(getSuggestedFormat('heic')).toBe('jpg');
      expect(getSuggestedFormat('heif')).toBe('jpg');
      expect(getSuggestedFormat('png')).toBe('webp');
      expect(getSuggestedFormat('jpg')).toBe('avif');
      expect(getSuggestedFormat('jpeg')).toBe('avif');
      expect(getSuggestedFormat('bmp')).toBe('png');
      expect(getSuggestedFormat('tiff')).toBe('png');
      expect(getSuggestedFormat('gif')).toBe('webp');
    });

    it('should default to webp for unknown formats', () => {
      expect(getSuggestedFormat('unknown')).toBe('webp');
    });

    it('should be case insensitive', () => {
      expect(getSuggestedFormat('HEIC')).toBe('jpg');
      expect(getSuggestedFormat('PNG')).toBe('webp');
    });
  });

  describe('getOptimalSettings', () => {
    it('should return optimal settings for different format combinations', () => {
      const webpSettings = getOptimalSettings('jpg', 'webp');
      expect(webpSettings).toEqual({
        quality: 85,
        preserveExif: false,
      });

      const avifSettings = getOptimalSettings('png', 'avif');
      expect(avifSettings).toEqual({
        quality: 80,
        preserveExif: false,
      });

      const jpgSettings = getOptimalSettings('png', 'jpg');
      expect(jpgSettings).toEqual({
        quality: 90,
        progressive: true,
        preserveExif: false,
      });

      const pngSettings = getOptimalSettings('jpg', 'png');
      expect(pngSettings).toEqual({
        lossless: true,
        preserveExif: true,
      });
    });

    it('should return empty object for unknown target format', () => {
      const settings = getOptimalSettings('jpg', 'unknown');
      expect(settings).toEqual({});
    });
  });

  describe('validateSettings', () => {
    it('should validate correct settings', () => {
      const validSettings: ConversionSettings = {
        format: 'webp',
        quality: 85,
        preserveExif: false,
        preserveColorProfile: false,
      };

      const errors = validateSettings(validSettings);
      expect(errors).toHaveLength(0);
    });

    it('should catch invalid quality values', () => {
      const invalidSettings: ConversionSettings = {
        format: 'webp',
        quality: 150, // Invalid: > 100
        preserveExif: false,
        preserveColorProfile: false,
      };

      const errors = validateSettings(invalidSettings);
      expect(errors).toContain('Quality must be between 0 and 100');
    });

    it('should catch negative quality values', () => {
      const invalidSettings: ConversionSettings = {
        format: 'webp',
        quality: -10, // Invalid: < 0
        preserveExif: false,
        preserveColorProfile: false,
      };

      const errors = validateSettings(invalidSettings);
      expect(errors).toContain('Quality must be between 0 and 100');
    });

    it('should catch invalid dimensions', () => {
      const invalidSettings: ConversionSettings = {
        format: 'webp',
        quality: 85,
        width: 0, // Invalid: <= 0
        height: -100, // Invalid: <= 0
        preserveExif: false,
        preserveColorProfile: false,
      };

      const errors = validateSettings(invalidSettings);
      expect(errors).toContain('Width must be greater than 0');
      expect(errors).toContain('Height must be greater than 0');
    });

    it('should catch quality setting on lossless formats', () => {
      const invalidSettings: ConversionSettings = {
        format: 'png',
        quality: 85, // Invalid: quality not applicable for lossless
        lossless: true,
        preserveExif: false,
        preserveColorProfile: false,
      };

      const errors = validateSettings(invalidSettings);
      expect(errors).toContain('Quality setting not applicable for lossless formats');
    });

    it('should allow quality setting on lossy formats', () => {
      const validSettings: ConversionSettings = {
        format: 'webp',
        quality: 85,
        lossless: false,
        preserveExif: false,
        preserveColorProfile: false,
      };

      const errors = validateSettings(validSettings);
      expect(errors).toHaveLength(0);
    });

    it('should allow lossless setting on PNG', () => {
      const validSettings: ConversionSettings = {
        format: 'png',
        lossless: true,
        preserveExif: true,
        preserveColorProfile: true,
      };

      const errors = validateSettings(validSettings);
      expect(errors).toHaveLength(0);
    });
  });
});
