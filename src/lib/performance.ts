// Performance monitoring utilities

export interface PerformanceMetrics {
  navigationStart: number;
  domContentLoaded: number;
  loadComplete: number;
  firstPaint: number;
  firstContentfulPaint: number;
  largestContentfulPaint: number;
  cumulativeLayoutShift: number;
  firstInputDelay: number;
}

export class PerformanceMonitor {
  private metrics: Partial<PerformanceMetrics> = {};

  constructor() {
    if (typeof window !== 'undefined') {
      this.initializeMetrics();
    }
  }

  private initializeMetrics() {
    // Navigation timing
    if (performance.navigation) {
      this.metrics.navigationStart = performance.navigation.redirectCount;
    }

    // Core Web Vitals
    this.measureCoreWebVitals();

    // Custom metrics
    this.measureCustomMetrics();
  }

  private measureCoreWebVitals() {
    // Largest Contentful Paint (LCP)
    new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      const lastEntry = entries[entries.length - 1];
      this.metrics.largestContentfulPaint = lastEntry.startTime;
    }).observe({ type: 'largest-contentful-paint', buffered: true });

    // First Input Delay (FID)
    new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      entries.forEach((entry) => {
        this.metrics.firstInputDelay = entry.processingStart - entry.startTime;
      });
    }).observe({ type: 'first-input', buffered: true });

    // Cumulative Layout Shift (CLS)
    let clsValue = 0;
    new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      entries.forEach((entry) => {
        if (!entry.hadRecentInput) {
          clsValue += entry.value;
        }
      });
      this.metrics.cumulativeLayoutShift = clsValue;
    }).observe({ type: 'layout-shift', buffered: true });
  }

  private measureCustomMetrics() {
    // First Paint
    new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      entries.forEach((entry) => {
        if (entry.name === 'first-paint') {
          this.metrics.firstPaint = entry.startTime;
        }
        if (entry.name === 'first-contentful-paint') {
          this.metrics.firstContentfulPaint = entry.startTime;
        }
      });
    }).observe({ type: 'paint', buffered: true });

    // DOM Content Loaded
    document.addEventListener('DOMContentLoaded', () => {
      this.metrics.domContentLoaded = performance.now();
    });

    // Load Complete
    window.addEventListener('load', () => {
      this.metrics.loadComplete = performance.now();
    });
  }

  public getMetrics(): Partial<PerformanceMetrics> {
    return { ...this.metrics };
  }

  public logMetrics(): void {
    console.group('🚀 Performance Metrics');
    console.log('DOM Content Loaded:', `${this.metrics.domContentLoaded?.toFixed(2)}ms`);
    console.log('Load Complete:', `${this.metrics.loadComplete?.toFixed(2)}ms`);
    console.log('First Paint:', `${this.metrics.firstPaint?.toFixed(2)}ms`);
    console.log('First Contentful Paint:', `${this.metrics.firstContentfulPaint?.toFixed(2)}ms`);
    console.log('Largest Contentful Paint:', `${this.metrics.largestContentfulPaint?.toFixed(2)}ms`);
    console.log('First Input Delay:', `${this.metrics.firstInputDelay?.toFixed(2)}ms`);
    console.log('Cumulative Layout Shift:', this.metrics.cumulativeLayoutShift?.toFixed(4));
    console.groupEnd();
  }

  public async reportMetrics(endpoint: string): Promise<void> {
    try {
      await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url: window.location.href,
          metrics: this.metrics,
          timestamp: Date.now(),
        }),
      });
    } catch (error) {
      console.error('Failed to report metrics:', error);
    }
  }
}

// Image loading performance
export function measureImageLoadTime(src: string): Promise<number> {
  return new Promise((resolve) => {
    const start = performance.now();
    const img = new Image();
    
    img.onload = () => {
      const duration = performance.now() - start;
      resolve(duration);
    };
    
    img.onerror = () => {
      resolve(-1); // Error indicator
    };
    
    img.src = src;
  });
}

// Bundle size analyzer
export function analyzeBundleSize(): void {
  if (typeof window === 'undefined') return;

  const scripts = Array.from(document.scripts);
  let totalSize = 0;

  scripts.forEach(async (script) => {
    if (script.src) {
      try {
        const response = await fetch(script.src, { method: 'HEAD' });
        const size = parseInt(response.headers.get('content-length') || '0');
        totalSize += size;
        console.log(`Script: ${script.src.split('/').pop()} - ${(size / 1024).toFixed(2)} KB`);
      } catch (error) {
        console.warn('Could not measure script size:', script.src);
      }
    }
  });

  setTimeout(() => {
    console.log(`Total bundle size: ${(totalSize / 1024).toFixed(2)} KB`);
  }, 1000);
}

// Singleton instance
let performanceMonitor: PerformanceMonitor | null = null;

export function getPerformanceMonitor(): PerformanceMonitor {
  if (!performanceMonitor && typeof window !== 'undefined') {
    performanceMonitor = new PerformanceMonitor();
  }
  return performanceMonitor!;
}
