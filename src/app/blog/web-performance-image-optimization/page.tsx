import { Metadata } from 'next';
import Link from 'next/link';
import { BlogHeader } from '../../../components/BlogHeader';
import '../blog.css';

export const metadata: Metadata = {
  title: 'Web Performance: Image Optimization for Faster Loading - SnapConvert',
  description: 'Technical guide to improving Core Web Vitals and page speed through strategic image format selection and optimization.',
  keywords: ['web performance', 'Core Web Vitals', 'page speed', 'SEO', 'image optimization', 'loading speed'],
};

export default function WebPerformanceGuide() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <BlogHeader />
      <div className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumbs */}
        <nav className="mb-8 text-sm text-slate-600 dark:text-slate-400">
          <Link href="/blog" className="hover:underline">Guides</Link>
          <span className="mx-2">/</span>
          <span>Web Performance Guide</span>
        </nav>

        {/* Article Header */}
        <header className="mb-10 text-center">
          <div className="flex items-center justify-center mb-4">
            <span className="text-4xl mr-3">⚡</span>
            <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">
              Web Performance: Image Optimization for Faster Loading
            </h1>
          </div>
          <p className="text-xl text-slate-600 dark:text-slate-400 mb-6">
            Technical guide to improving Core Web Vitals and page speed through strategic image format selection and optimization.
          </p>
          <div className="flex justify-center items-center space-x-4 text-sm text-slate-500 dark:text-slate-400">
            <span>2024-01-08</span>
            <span>•</span>
            <span>8 min read</span>
          </div>
          <div className="flex flex-wrap justify-center gap-2 mt-4">
            {['Web Performance', 'Core Web Vitals', 'Page Speed', 'SEO'].map((tag) => (
              <span key={tag} className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs font-medium px-2.5 py-0.5 rounded-full">
                {tag}
              </span>
            ))}
          </div>
        </header>

        {/* Article Content */}
        <div className="prose prose-lg prose-slate dark:prose-invert max-w-none">
          <div className="article-content text-slate-700 dark:text-slate-300 leading-relaxed">
            <pre className="whitespace-pre-wrap font-sans">{`# Web Performance: Image Optimization for Faster Loading

## Introduction
Images account for 60-80% of a typical web page's total size, making them the primary factor affecting page load speed and Core Web Vitals. Optimizing images can dramatically improve user experience, SEO rankings, and conversion rates.

## Core Web Vitals and Images

### Largest Contentful Paint (LCP)
LCP measures loading performance and is heavily influenced by images:

**Target**: Under 2.5 seconds
**Impact**: Images are often the LCP element
**Optimization**: Use next-gen formats, optimize file sizes, implement lazy loading

### First Input Delay (FID)
FID measures interactivity and can be affected by image processing:

**Target**: Under 100 milliseconds
**Impact**: Heavy image processing can block the main thread
**Optimization**: Use Web Workers, optimize image processing, defer non-critical images

### Cumulative Layout Shift (CLS)
CLS measures visual stability and is affected by image loading:

**Target**: Under 0.1
**Impact**: Images without dimensions cause layout shifts
**Optimization**: Always specify image dimensions, use aspect-ratio CSS

## Image Format Selection for Performance

### Modern Formats (Recommended)

**WebP:**
- **Compression**: 25-35% smaller than JPEG
- **Browser Support**: 95%+ (all modern browsers)
- **Use Cases**: Photos, graphics, general web images
- **Fallback**: JPEG for older browsers

**AVIF:**
- **Compression**: 50% smaller than JPEG
- **Browser Support**: 85%+ (Chrome, Firefox, Safari 16+)
- **Use Cases**: High-quality photos, hero images
- **Fallback**: WebP, then JPEG

**JPEG XL:**
- **Compression**: 20% smaller than JPEG
- **Browser Support**: Limited (Firefox, Chrome experimental)
- **Use Cases**: Future-proofing, high-quality images
- **Fallback**: AVIF, WebP, JPEG

### Traditional Formats

**JPEG:**
- **Compression**: Good for photos
- **Browser Support**: Universal
- **Use Cases**: Photos, complex images
- **Optimization**: Progressive JPEG, quality 80-85%

**PNG:**
- **Compression**: Lossless, larger files
- **Browser Support**: Universal
- **Use Cases**: Graphics, logos, images with transparency
- **Optimization**: PNG-8 for simple graphics, PNG-24 for complex

**GIF:**
- **Compression**: Poor compression
- **Browser Support**: Universal
- **Use Cases**: Simple animations, very small graphics
- **Optimization**: Use WebP or MP4 for animations

## Optimization Strategies

### 1. Format Selection Strategy
Use the picture element for progressive enhancement:

\`\`\`html
<picture>
  <source srcset="image.avif" type="image/avif">
  <source srcset="image.webp" type="image/webp">
  <img src="image.jpg" alt="Description" width="800" height="600">
</picture>
\`\`\`

### 2. Responsive Images
Serve different sizes for different devices:

\`\`\`html
<img
  srcset="
    image-320w.webp 320w,
    image-640w.webp 640w,
    image-1280w.webp 1280w
  "
  sizes="(max-width: 320px) 280px, (max-width: 640px) 600px, 1200px"
  src="image-640w.webp"
  alt="Description"
  width="640"
  height="480"
>
\`\`\`

### 3. Lazy Loading
Defer loading of images below the fold:

\`\`\`html
<img
  src="image.webp"
  alt="Description"
  loading="lazy"
  width="800"
  height="600"
>
\`\`\`

### 4. Critical Image Optimization
Prioritize above-the-fold images:

- **Preload critical images**: Use <link rel="preload">
- **Inline small images**: Use data URIs for icons
- **Optimize hero images**: Use highest quality for LCP elements
- **Compress aggressively**: Use 70-80% quality for non-critical images

## Quality vs Performance Balance

### Quality Settings by Use Case

**Hero Images (LCP):**
- **Format**: AVIF or WebP
- **Quality**: 85-90%
- **Size**: Optimized for viewport
- **Loading**: Eager, preloaded

**Content Images:**
- **Format**: WebP with JPEG fallback
- **Quality**: 80-85%
- **Size**: Responsive sizes
- **Loading**: Lazy loaded

**Thumbnails:**
- **Format**: WebP or JPEG
- **Quality**: 70-75%
- **Size**: Small, fixed dimensions
- **Loading**: Lazy loaded

**Icons and Graphics:**
- **Format**: SVG or PNG-8
- **Quality**: Lossless
- **Size**: Minimal dimensions
- **Loading**: Inline or preloaded

## Technical Implementation

### 1. Image Processing Pipeline
- **Source**: High-quality originals
- **Processing**: Automated optimization
- **Output**: Multiple formats and sizes
- **Delivery**: CDN with proper headers

### 2. Compression Techniques
- **Lossy compression**: JPEG, WebP, AVIF
- **Lossless compression**: PNG, WebP lossless
- **Progressive loading**: JPEG progressive, WebP
- **Metadata stripping**: Remove EXIF data

### 3. Delivery Optimization
- **CDN**: Global content delivery
- **HTTP/2**: Multiplexing for multiple images
- **Compression**: Gzip/Brotli for text-based formats
- **Caching**: Long-term caching for static images

## Performance Monitoring

### Key Metrics to Track
- **LCP**: Largest Contentful Paint
- **FID**: First Input Delay
- **CLS**: Cumulative Layout Shift
- **Image load time**: Individual image performance
- **Total page size**: Overall image impact

### Tools for Monitoring
- **Google PageSpeed Insights**: Core Web Vitals
- **WebPageTest**: Detailed performance analysis
- **Chrome DevTools**: Real-time performance monitoring
- **Lighthouse**: Comprehensive performance audit

## Best Practices

### 1. Image Dimensions
- **Always specify dimensions**: Prevent layout shifts
- **Use aspect-ratio CSS**: Modern approach to responsive images
- **Optimize for viewport**: Don't serve larger images than needed
- **Consider device pixel ratio**: High-DPI displays need higher resolution

### 2. Loading Strategy
- **Critical images first**: Above-the-fold content
- **Lazy load below fold**: Defer non-critical images
- **Preload important images**: Use resource hints
- **Use placeholder images**: Improve perceived performance

### 3. Format Selection
- **Test different formats**: Compare file sizes and quality
- **Use modern formats**: WebP, AVIF for better compression
- **Provide fallbacks**: Ensure compatibility
- **Consider browser support**: Balance performance vs compatibility

### 4. File Size Management
- **Set size limits**: Maximum file sizes for different use cases
- **Compress aggressively**: Use lower quality for non-critical images
- **Strip metadata**: Remove unnecessary EXIF data
- **Use appropriate dimensions**: Don't serve oversized images

## SnapConvert Recommendations

### For Web Developers:
1. **Use "Web Optimized" preset** for general web images
2. **Create custom presets** for specific use cases
3. **Batch process** entire image libraries
4. **Test different formats** to find optimal settings

### For Content Creators:
1. **Optimize before uploading** to CMS
2. **Use consistent quality settings** across your site
3. **Consider responsive images** for different devices
4. **Monitor performance** regularly

### For E-commerce:
1. **Optimize product images** for fast loading
2. **Use high quality** for zoom functionality
3. **Implement lazy loading** for product galleries
4. **Test on mobile devices** for real-world performance

## Conclusion
Image optimization is crucial for web performance and user experience. By understanding Core Web Vitals, choosing the right formats, and implementing proper optimization strategies, you can significantly improve your website's performance.

Remember: the best optimization strategy combines technical excellence with user experience considerations. Use tools like SnapConvert to streamline the optimization process while maintaining the quality your users expect.`}</pre>
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-12 p-8 bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 text-center">
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
            Optimize Your Web Images
          </h3>
          <p className="text-lg text-slate-600 dark:text-slate-400 mb-8">
            Use SnapConvert's web optimization presets to improve your Core Web Vitals and page loading speed.
          </p>
          <Link href="/" className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 dark:bg-purple-600 dark:hover:bg-purple-700 transition-colors shadow-lg">
            Start Optimizing Now
          </Link>
        </div>
        </div>
      </div>
    </div>
  );
}
