// Analytics and performance monitoring utilities

export interface ConversionEvent {
  format: string;
  originalSize: number;
  convertedSize: number;
  compressionRatio: number;
  processingTime: number;
  method: 'local' | 'edge';
}

export interface UserInteraction {
  action: string;
  timestamp: number;
  metadata?: Record<string, any>;
}

class AnalyticsManager {
  private conversionEvents: ConversionEvent[] = [];
  private userInteractions: UserInteraction[] = [];

  // Track conversion events
  trackConversion(event: ConversionEvent) {
    this.conversionEvents.push({
      ...event,
      timestamp: Date.now(),
    });

    // Send to analytics (if available)
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'conversion', {
        event_category: 'Image Conversion',
        event_label: event.format,
        value: event.compressionRatio,
        custom_map: {
          original_size: event.originalSize,
          converted_size: event.convertedSize,
          processing_time: event.processingTime,
          method: event.method,
        },
      });
    }
  }

  // Track user interactions
  trackInteraction(action: string, metadata?: Record<string, any>) {
    const interaction: UserInteraction = {
      action,
      timestamp: Date.now(),
      metadata,
    };

    this.userInteractions.push(interaction);

    // Send to analytics (if available)
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'user_interaction', {
        event_category: 'User Action',
        event_label: action,
        custom_map: metadata,
      });
    }
  }

  // Get conversion statistics
  getConversionStats() {
    if (this.conversionEvents.length === 0) {
      return {
        totalConversions: 0,
        averageCompressionRatio: 0,
        totalSpaceSaved: 0,
        mostPopularFormat: null,
        averageProcessingTime: 0,
      };
    }

    const totalConversions = this.conversionEvents.length;
    const totalOriginalSize = this.conversionEvents.reduce((sum, event) => sum + event.originalSize, 0);
    const totalConvertedSize = this.conversionEvents.reduce((sum, event) => sum + event.convertedSize, 0);
    const averageCompressionRatio = totalOriginalSize > 0 
      ? ((totalOriginalSize - totalConvertedSize) / totalOriginalSize) * 100 
      : 0;
    
    const totalSpaceSaved = this.conversionEvents.reduce(
      (sum, event) => sum + (event.originalSize - event.convertedSize), 0
    );

    const formatCounts = this.conversionEvents.reduce((counts, event) => {
      counts[event.format] = (counts[event.format] || 0) + 1;
      return counts;
    }, {} as Record<string, number>);

    const mostPopularFormat = Object.entries(formatCounts).reduce(
      (max, [format, count]) => count > max.count ? { format, count } : max,
      { format: null, count: 0 }
    );

    const averageProcessingTime = 
      this.conversionEvents.reduce((sum, event) => sum + event.processingTime, 0) / totalConversions;

    return {
      totalConversions,
      averageCompressionRatio,
      totalSpaceSaved,
      mostPopularFormat: mostPopularFormat.format,
      averageProcessingTime,
    };
  }

  // Get user interaction insights
  getUserInsights() {
    const actionCounts = this.userInteractions.reduce((counts, interaction) => {
      counts[interaction.action] = (counts[interaction.action] || 0) + 1;
      return counts;
    }, {} as Record<string, number>);

    return {
      totalInteractions: this.userInteractions.length,
      actionCounts,
      mostCommonAction: Object.entries(actionCounts).reduce(
        (max, [action, count]) => count > max.count ? { action, count } : max,
        { action: null, count: 0 }
      ),
    };
  }

  // Clear old data (keep last 1000 events)
  cleanup() {
    if (this.conversionEvents.length > 1000) {
      this.conversionEvents = this.conversionEvents.slice(-1000);
    }
    if (this.userInteractions.length > 1000) {
      this.userInteractions = this.userInteractions.slice(-1000);
    }
  }
}

// Singleton instance
export const analyticsManager = new AnalyticsManager();

// Performance monitoring
export class PerformanceMonitor {
  private metrics: Record<string, number[]> = {};

  // Track a performance metric
  trackMetric(name: string, value: number) {
    if (!this.metrics[name]) {
      this.metrics[name] = [];
    }
    this.metrics[name].push(value);

    // Keep only last 100 measurements
    if (this.metrics[name].length > 100) {
      this.metrics[name] = this.metrics[name].slice(-100);
    }
  }

  // Get average for a metric
  getAverage(name: string): number {
    const values = this.metrics[name];
    if (!values || values.length === 0) return 0;
    return values.reduce((sum, value) => sum + value, 0) / values.length;
  }

  // Get all metrics
  getAllMetrics() {
    const result: Record<string, { average: number; count: number; latest: number }> = {};
    
    for (const [name, values] of Object.entries(this.metrics)) {
      result[name] = {
        average: this.getAverage(name),
        count: values.length,
        latest: values[values.length - 1] || 0,
      };
    }

    return result;
  }
}

export const performanceMonitor = new PerformanceMonitor();
