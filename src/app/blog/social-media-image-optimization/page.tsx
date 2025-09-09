import { Metadata } from 'next';
import Link from 'next/link';
import { BlogHeader } from '../../../components/BlogHeader';
import '../blog.css';

export const metadata: Metadata = {
  title: 'Optimizing Images for Social Media: Instagram, Facebook, Twitter - SnapConvert',
  description: 'Complete guide to image dimensions, formats, and quality settings for optimal social media performance across all platforms.',
  keywords: ['social media', 'Instagram', 'Facebook', 'Twitter', 'image optimization', 'dimensions', 'formats'],
};

export default function SocialMediaOptimizationGuide() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <BlogHeader />
      <div className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumbs */}
        <nav className="mb-8 text-sm text-slate-600 dark:text-slate-400">
          <Link href="/blog" className="hover:underline">Guides</Link>
          <span className="mx-2">/</span>
          <span>Social Media Optimization</span>
        </nav>

        {/* Article Header */}
        <header className="mb-10 text-center">
          <div className="flex items-center justify-center mb-4">
            <span className="text-4xl mr-3">📸</span>
            <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">
              Optimizing Images for Social Media
            </h1>
          </div>
          <p className="text-xl text-slate-600 dark:text-slate-400 mb-6">
            Complete guide to image dimensions, formats, and quality settings for optimal social media performance across all platforms.
          </p>
          <div className="flex justify-center items-center space-x-4 text-sm text-slate-500 dark:text-slate-400">
            <span>2024-01-18</span>
            <span>•</span>
            <span>6 min read</span>
          </div>
          <div className="flex flex-wrap justify-center gap-2 mt-4">
            {['Instagram', 'Facebook', 'Twitter', 'Social Media', 'Dimensions'].map((tag) => (
              <span key={tag} className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs font-medium px-2.5 py-0.5 rounded-full">
                {tag}
              </span>
            ))}
          </div>
        </header>

        {/* Article Content */}
        <div className="prose prose-lg prose-slate dark:prose-invert max-w-none">
          <div className="article-content text-slate-700 dark:text-slate-300 leading-relaxed">
            <pre className="whitespace-pre-wrap font-sans">{`# Optimizing Images for Social Media: Instagram, Facebook, Twitter

## Introduction
Social media platforms have specific requirements for images that can significantly impact your content's performance. Understanding these requirements and optimizing your images accordingly can improve engagement, loading speed, and overall user experience.

## Platform-Specific Requirements

### Instagram
Instagram is highly visual and has strict image requirements:

**Feed Posts:**
- **Square (1:1)**: 1080x1080px (recommended)
- **Portrait (4:5)**: 1080x1350px
- **Landscape (1.91:1)**: 1080x566px
- **Format**: JPEG or PNG
- **File size**: Under 30MB
- **Quality**: 85-90% for best results

**Stories:**
- **Dimensions**: 1080x1920px (9:16 ratio)
- **Format**: JPEG or PNG
- **File size**: Under 30MB

**Reels:**
- **Dimensions**: 1080x1920px (9:16 ratio)
- **Format**: MP4 (video) or JPEG (cover image)
- **Duration**: 15-90 seconds

### Facebook
Facebook supports various image formats and sizes:

**Profile Picture:**
- **Dimensions**: 170x170px (displayed), 320x320px (recommended)
- **Format**: JPEG or PNG
- **File size**: Under 5MB

**Cover Photo:**
- **Dimensions**: 1200x630px
- **Format**: JPEG or PNG
- **File size**: Under 100KB for best loading

**Post Images:**
- **Recommended**: 1200x630px (1.91:1 ratio)
- **Minimum**: 600x315px
- **Format**: JPEG or PNG
- **File size**: Under 8MB

**Event Images:**
- **Dimensions**: 1920x1080px (16:9 ratio)
- **Format**: JPEG or PNG
- **File size**: Under 8MB

### Twitter/X
Twitter has evolved its image requirements:

**Tweet Images:**
- **Single image**: 1200x675px (16:9 ratio)
- **Multiple images**: 1200x675px each
- **Format**: JPEG, PNG, or WebP
- **File size**: Under 5MB per image

**Profile Picture:**
- **Dimensions**: 400x400px
- **Format**: JPEG or PNG
- **File size**: Under 2MB

**Header Image:**
- **Dimensions**: 1500x500px (3:1 ratio)
- **Format**: JPEG or PNG
- **File size**: Under 5MB

### LinkedIn
LinkedIn focuses on professional content:

**Post Images:**
- **Recommended**: 1200x627px (1.91:1 ratio)
- **Minimum**: 552x276px
- **Format**: JPEG or PNG
- **File size**: Under 5MB

**Company Logo:**
- **Dimensions**: 300x300px
- **Format**: PNG (with transparency)
- **File size**: Under 2MB

**Cover Image:**
- **Dimensions**: 1192x220px
- **Format**: JPEG or PNG
- **File size**: Under 8MB

## Optimization Strategies

### 1. Format Selection
- **JPEG**: Best for photos, smaller file sizes
- **PNG**: Best for graphics, logos, images with text
- **WebP**: Modern format, excellent compression (supported by most platforms)

### 2. Quality Settings
- **High quality (90-95%)**: Professional content, product photos
- **Medium quality (80-85%)**: General social media posts
- **Lower quality (70-75%)**: Quick sharing, mobile uploads

### 3. File Size Optimization
- **Instagram**: Under 30MB (but aim for under 5MB)
- **Facebook**: Under 8MB (but aim for under 1MB)
- **Twitter**: Under 5MB (but aim for under 2MB)
- **LinkedIn**: Under 5MB (but aim for under 1MB)

## Best Practices

### 1. Aspect Ratios
- **Square (1:1)**: Instagram feed, Facebook posts
- **Landscape (16:9)**: Twitter, LinkedIn, Facebook cover
- **Portrait (4:5)**: Instagram feed, Pinterest
- **Stories (9:16)**: Instagram Stories, Facebook Stories

### 2. Color and Contrast
- **High contrast**: Better visibility on mobile devices
- **Vibrant colors**: More engaging on social feeds
- **Consistent branding**: Maintain brand colors across platforms

### 3. Text Overlays
- **Readable fonts**: Use bold, sans-serif fonts
- **High contrast**: White text on dark backgrounds
- **Safe areas**: Keep text away from edges (platforms may crop)

### 4. Mobile Optimization
- **Mobile-first**: Most users view on mobile devices
- **Thumb-friendly**: Ensure images are clear at small sizes
- **Fast loading**: Optimize for slower mobile connections

## Platform-Specific Tips

### Instagram
- **Use high-quality images**: Instagram favors high-quality content
- **Maintain consistency**: Use similar filters and styles
- **Consider the grid**: Plan how images look together
- **Use Stories dimensions**: 1080x1920px for full-screen impact

### Facebook
- **Optimize for news feed**: 1200x630px works best
- **Use engaging visuals**: Bright, colorful images perform better
- **Consider video thumbnails**: 1200x630px for video posts
- **Test different formats**: See what works for your audience

### Twitter
- **Use 16:9 ratio**: Best for timeline display
- **Keep it simple**: Complex images don't work well at small sizes
- **Use alt text**: Improve accessibility and SEO
- **Consider GIFs**: Animated content gets more engagement

### LinkedIn
- **Professional tone**: Use clean, professional images
- **High quality**: LinkedIn users expect professional content
- **Use infographics**: Educational content performs well
- **Optimize for desktop**: Many users view on desktop

## Technical Optimization

### 1. Compression
- **Lossy compression**: JPEG for photos
- **Lossless compression**: PNG for graphics
- **Progressive JPEG**: Better loading experience
- **WebP format**: Superior compression when supported

### 2. Metadata
- **Strip EXIF data**: Reduce file size and protect privacy
- **Add alt text**: Improve accessibility
- **Use descriptive filenames**: Better for SEO

### 3. Batch Processing
- **Consistent sizing**: Process multiple images at once
- **Quality presets**: Use consistent quality settings
- **Format conversion**: Convert to optimal formats
- **File size optimization**: Ensure all images meet size limits

## SnapConvert Recommendations

### For Social Media Managers:
1. **Create presets** for each platform
2. **Batch process** content calendars
3. **Use "Web Optimized" preset** for general social media
4. **Maintain consistent quality** across all platforms

### For Content Creators:
1. **Optimize for mobile** viewing
2. **Use high contrast** for better visibility
3. **Keep file sizes small** for faster loading
4. **Test different formats** to see what works

### For Businesses:
1. **Maintain brand consistency** across platforms
2. **Use professional quality** images
3. **Optimize for each platform** specifically
4. **Monitor performance** and adjust accordingly

## Conclusion
Optimizing images for social media requires understanding each platform's specific requirements and your audience's viewing habits. By following these guidelines and using tools like SnapConvert, you can ensure your images look great and load quickly across all social media platforms.

Remember: the best social media images are not just technically optimized—they're also visually engaging, on-brand, and designed with your audience in mind.`}</pre>
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-12 p-8 bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 text-center">
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
            Optimize Your Social Media Images
          </h3>
          <p className="text-lg text-slate-600 dark:text-slate-400 mb-8">
            Use SnapConvert's social media presets to quickly optimize your images for Instagram, Facebook, Twitter, and LinkedIn.
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
