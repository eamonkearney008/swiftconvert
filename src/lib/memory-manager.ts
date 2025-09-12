/**
 * Memory Manager for handling low memory situations on mobile browsers
 * Especially useful when multiple tabs are open
 */

export class MemoryManager {
  private static instance: MemoryManager;
  private memoryPressureLevel: 'low' | 'medium' | 'high' = 'low';
  private cleanupCallbacks: (() => void)[] = [];
  private isMonitoring = false;

  private constructor() {
    this.startMemoryMonitoring();
  }

  static getInstance(): MemoryManager {
    if (!MemoryManager.instance) {
      MemoryManager.instance = new MemoryManager();
    }
    return MemoryManager.instance;
  }

  /**
   * Start monitoring memory pressure
   */
  private startMemoryMonitoring() {
    if (this.isMonitoring) return;
    this.isMonitoring = true;

    // Check memory pressure every 5 seconds
    setInterval(() => {
      this.checkMemoryPressure();
    }, 5000);

    // Listen for memory pressure events if available
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      if (memory) {
        setInterval(() => {
          this.analyzeMemoryUsage(memory);
        }, 3000);
      }
    }

    // Listen for visibility changes (tab switching)
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.handleTabHidden();
      } else {
        this.handleTabVisible();
      }
    });
  }

  /**
   * Check current memory pressure level
   */
  private checkMemoryPressure() {
    const isMobile = window.innerWidth <= 768;
    const tabCount = this.estimateTabCount();
    
    // Estimate memory pressure based on various factors
    let pressure = 'low';
    
    if (isMobile) {
      if (tabCount > 3) {
        pressure = 'high';
      } else if (tabCount > 1) {
        pressure = 'medium';
      }
    }

    // Check if we're in a low memory situation
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      if (memory) {
        const usedRatio = memory.usedJSHeapSize / memory.jsHeapSizeLimit;
        if (usedRatio > 0.8) {
          pressure = 'high';
        } else if (usedRatio > 0.6) {
          pressure = 'medium';
        }
      }
    }

    this.memoryPressureLevel = pressure as 'low' | 'medium' | 'high';
  }

  /**
   * Analyze memory usage from performance.memory
   */
  private analyzeMemoryUsage(memory: any) {
    const usedRatio = memory.usedJSHeapSize / memory.jsHeapSizeLimit;
    
    if (usedRatio > 0.85) {
      this.triggerAggressiveCleanup();
    } else if (usedRatio > 0.7) {
      this.triggerLightCleanup();
    }
  }

  /**
   * Estimate number of open tabs (rough approximation)
   */
  private estimateTabCount(): number {
    // This is a rough estimate based on available memory and performance
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      if (memory) {
        const usedRatio = memory.usedJSHeapSize / memory.jsHeapSizeLimit;
        // Rough estimate: more memory usage = more tabs
        if (usedRatio > 0.8) return 5;
        if (usedRatio > 0.6) return 3;
        if (usedRatio > 0.4) return 2;
      }
    }
    return 1;
  }

  /**
   * Handle tab becoming hidden
   */
  private handleTabHidden() {
    // When tab is hidden, we can be more aggressive with cleanup
    this.triggerLightCleanup();
  }

  /**
   * Handle tab becoming visible
   */
  private handleTabVisible() {
    // When tab becomes visible, check memory pressure
    this.checkMemoryPressure();
  }

  /**
   * Trigger light memory cleanup
   */
  private triggerLightCleanup() {
    // Force garbage collection if available
    if ((window as any).gc) {
      (window as any).gc();
    }

    // Run registered cleanup callbacks
    this.cleanupCallbacks.forEach(callback => {
      try {
        callback();
      } catch (error) {
        console.warn('Cleanup callback failed:', error);
      }
    });
  }

  /**
   * Trigger aggressive memory cleanup
   */
  private triggerAggressiveCleanup() {
    console.log('MemoryManager: Triggering aggressive cleanup');
    
    // Clear all object URLs
    this.clearAllObjectURLs();
    
    // Force garbage collection multiple times
    if ((window as any).gc) {
      (window as any).gc();
      setTimeout(() => (window as any).gc(), 100);
      setTimeout(() => (window as any).gc(), 500);
    }

    // Run cleanup callbacks
    this.triggerLightCleanup();
  }

  /**
   * Clear all object URLs from the page
   */
  private clearAllObjectURLs() {
    // Find all images with blob URLs and clear them
    const images = document.querySelectorAll('img');
    images.forEach(img => {
      if (img.src.startsWith('blob:')) {
        URL.revokeObjectURL(img.src);
        // Don't clear the src immediately to avoid broken images
      }
    });
  }

  /**
   * Register a cleanup callback
   */
  registerCleanupCallback(callback: () => void) {
    this.cleanupCallbacks.push(callback);
  }

  /**
   * Unregister a cleanup callback
   */
  unregisterCleanupCallback(callback: () => void) {
    const index = this.cleanupCallbacks.indexOf(callback);
    if (index > -1) {
      this.cleanupCallbacks.splice(index, 1);
    }
  }

  /**
   * Get current memory pressure level
   */
  getMemoryPressureLevel(): 'low' | 'medium' | 'high' {
    return this.memoryPressureLevel;
  }

  /**
   * Check if we should use aggressive memory management
   */
  shouldUseAggressiveCleanup(): boolean {
    return this.memoryPressureLevel === 'high';
  }

  /**
   * Check if we should use light memory management
   */
  shouldUseLightCleanup(): boolean {
    return this.memoryPressureLevel === 'medium' || this.memoryPressureLevel === 'high';
  }

  /**
   * Get recommended batch size for processing
   */
  getRecommendedBatchSize(): number {
    switch (this.memoryPressureLevel) {
      case 'high':
        return 1;
      case 'medium':
        return 2;
      case 'low':
      default:
        return 3;
    }
  }

  /**
   * Get recommended delay between operations
   */
  getRecommendedDelay(): number {
    switch (this.memoryPressureLevel) {
      case 'high':
        return 200;
      case 'medium':
        return 100;
      case 'low':
      default:
        return 50;
    }
  }

  /**
   * Check if we should resize images for preview
   */
  shouldResizeForPreview(fileSize: number): boolean {
    const isMobile = window.innerWidth <= 768;
    
    if (this.memoryPressureLevel === 'high') {
      return fileSize > 2 * 1024 * 1024; // 2MB threshold for high pressure
    } else if (this.memoryPressureLevel === 'medium') {
      return fileSize > 5 * 1024 * 1024; // 5MB threshold for medium pressure
    } else {
      return isMobile && fileSize > 10 * 1024 * 1024; // 10MB threshold for low pressure
    }
  }

  /**
   * Get recommended image quality for resizing
   */
  getRecommendedResizeQuality(): number {
    switch (this.memoryPressureLevel) {
      case 'high':
        return 0.7; // Lower quality for high pressure
      case 'medium':
        return 0.8; // Medium quality
      case 'low':
      default:
        return 0.9; // High quality
    }
  }

  /**
   * Force memory cleanup now
   */
  forceCleanup() {
    this.triggerAggressiveCleanup();
  }

  /**
   * Get memory usage information
   */
  getMemoryInfo() {
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      return {
        used: memory.usedJSHeapSize,
        total: memory.jsHeapSizeLimit,
        usedRatio: memory.usedJSHeapSize / memory.jsHeapSizeLimit,
        pressureLevel: this.memoryPressureLevel,
        tabCount: this.estimateTabCount()
      };
    }
    return {
      used: 0,
      total: 0,
      usedRatio: 0,
      pressureLevel: this.memoryPressureLevel,
      tabCount: this.estimateTabCount()
    };
  }
}

// Export singleton instance
export const memoryManager = MemoryManager.getInstance();
