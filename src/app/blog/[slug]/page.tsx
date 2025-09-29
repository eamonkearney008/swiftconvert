import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { BlogHeader } from '../../../components/BlogHeader';
import '../blog.css';

// Article data - in a real app, this would come from a CMS or database
const articles: Record<string, any> = {
  'heic-vs-jpg-which-is-best': {
    title: 'HEIC vs JPG: Which is Best for Your Images?',
    excerpt: 'Compare HEIC and JPG formats to understand their strengths, weaknesses, and when to use each for optimal image quality and file size.',
    date: '2024-01-15',
    readTime: '5 min read',
    category: 'Format Comparison',
    tags: ['HEIC', 'JPG', 'Apple', 'Compression'],
    content: `# HEIC vs JPG: Which is Best for Your Images?

When it comes to choosing the right image format, the decision between HEIC and JPG can significantly impact your image quality, file size, and compatibility.

## What is HEIC?

HEIC (High Efficiency Image Container) is Apple's modern image format introduced with iOS 11. It offers superior compression compared to traditional formats.

### HEIC Advantages:
- 50% smaller file sizes compared to JPG at the same quality
- Better compression algorithms using advanced techniques
- Support for transparency and multiple images in one file
- 16-bit color depth vs JPG's 8-bit
- Lossless compression option available

### HEIC Disadvantages:
- Limited browser support - mainly Safari and some mobile browsers
- Not universally compatible with older devices and software
- Apple ecosystem focus - less support on Android/Windows

## What is JPG?

JPG (Joint Photographic Experts Group) is the most widely used image format on the web and in digital photography.

### JPG Advantages:
- Universal compatibility across all platforms and devices
- Wide browser support - works everywhere
- Small file sizes with good compression
- Industry standard for photography and web images
- Hardware acceleration support on most devices

### JPG Disadvantages:
- Lossy compression - quality degrades with each save
- No transparency support - requires PNG for transparent images
- 8-bit color limitation - fewer colors than modern formats
- Compression artifacts at high compression ratios

## When to Use HEIC

Choose HEIC when:
- Apple ecosystem: You're primarily using Apple devices
- Storage optimization: You need maximum space savings
- High-quality requirements: You want the best possible image quality
- Modern workflows: Your target audience uses recent devices

## When to Use JPG

Choose JPG when:
- Universal compatibility: You need broad device support
- Web publishing: You're creating content for the web
- Legacy systems: You're working with older software
- Social media: You're sharing on platforms that don't support HEIC

## Conclusion

The choice between HEIC and JPG depends on your specific needs. HEIC is superior for quality and file size but has limited compatibility. JPG is universal but offers less efficient compression.

For most users, a hybrid approach works best: use HEIC for storage and Apple device sharing, then convert to JPG for broader compatibility when needed.`
  },
  'reduce-image-file-size-without-losing-quality': {
    title: 'How to Reduce Image File Size Without Losing Quality',
    excerpt: 'Master the art of image optimization with proven techniques to compress images while maintaining visual quality for web and print.',
    date: '2024-01-10',
    readTime: '7 min read',
    category: 'Optimization',
    tags: ['Compression', 'Quality', 'WebP', 'AVIF', 'PNG'],
    content: `# How to Reduce Image File Size Without Losing Quality

Image optimization is crucial for web performance, storage efficiency, and user experience. This comprehensive guide will teach you how to significantly reduce file sizes while maintaining visual quality.

## Understanding Image Compression

Image compression works by removing redundant or less important data from your images. There are two main types:

### Lossless Compression
- Preserves all image data - no quality loss
- Smaller file size reduction - typically 10-30%
- Best for: Graphics, logos, images with text
- Formats: PNG, GIF, WebP (lossless mode)

### Lossy Compression
- Removes some image data - slight quality loss
- Larger file size reduction - typically 50-90%
- Best for: Photographs, complex images
- Formats: JPG, WebP, AVIF

## Choose the Right Format

### For Photographs:
1. WebP - 25-35% smaller than JPG with better quality
2. AVIF - 50% smaller than JPG with superior quality
3. JPG - Universal compatibility, good compression

### For Graphics with Transparency:
1. PNG - Lossless, supports transparency
2. WebP - Better compression than PNG
3. SVG - Vector format for simple graphics

## Optimization Techniques

### 1. Resize Images Appropriately
- Web images: Resize to display dimensions
- Mobile: Use smaller dimensions for mobile devices
- Retina displays: Use 2x dimensions for high-DPI screens

### 2. Choose Optimal Quality Settings
- JPG: 80-85% quality for web, 90-95% for print
- WebP: 80-90% quality for web
- PNG: Use 8-bit color when possible

### 3. Remove Metadata
- EXIF data: Remove camera settings and location data
- Color profiles: Remove unnecessary color profiles
- Thumbnails: Remove embedded thumbnails

## Best Practices

1. Choose the right format for your content type
2. Resize images to appropriate dimensions
3. Use optimal quality settings for your use case
4. Remove unnecessary metadata to reduce file size
5. Test on target devices to ensure quality
6. Use modern formats like WebP and AVIF when possible
7. Implement responsive images for different screen sizes
8. Monitor performance and adjust as needed

## Conclusion

Image optimization is a balance between file size and visual quality. By understanding compression techniques, choosing appropriate formats, and using the right tools, you can achieve significant file size reductions while maintaining excellent visual quality.`
  },
  'avif-vs-webp-future-of-web': {
    title: 'AVIF vs WebP: The Future of Web Images',
    excerpt: 'Explore the next-generation image formats that are revolutionizing web performance and discover which format will dominate the future.',
    date: '2024-01-05',
    readTime: '6 min read',
    category: 'Future Tech',
    tags: ['AVIF', 'WebP', 'Performance', 'Browser Support'],
    content: `# AVIF vs WebP: The Future of Web Images

The web is evolving rapidly, and so are image formats. AVIF and WebP represent the next generation of image compression, offering unprecedented file size reductions and quality improvements.

## What is WebP?

WebP is Google's modern image format introduced in 2010. It's designed to provide superior compression compared to traditional formats while maintaining compatibility with web standards.

### WebP Advantages:
- 25-35% smaller than JPG at equivalent quality
- Lossless and lossy compression options
- Transparency support like PNG
- Animation support like GIF
- Wide browser support (95%+ of users)

### WebP Limitations:
- Still larger than AVIF for most use cases
- Limited color depth compared to AVIF
- Older compression algorithms than AVIF

## What is AVIF?

AVIF (AV1 Image File Format) is based on the AV1 video codec and represents the cutting edge of image compression technology. It was introduced in 2019 and offers the most advanced compression available.

### AVIF Advantages:
- 50% smaller than JPG at equivalent quality
- Superior compression to WebP
- 10-bit color depth support
- HDR support for high dynamic range images
- Future-proof technology based on open standards

### AVIF Limitations:
- Limited browser support (growing but not universal)
- Slower encoding compared to WebP
- Newer format with less tool support

## Compression Comparison

### File Size Reduction:
- JPG baseline: 100% file size
- WebP: 65-75% of JPG size
- AVIF: 50-60% of JPG size

### Quality at Same File Size:
- AVIF: Best quality and detail preservation
- WebP: Good quality, better than JPG
- JPG: Baseline quality

## Browser Support Analysis

### WebP Support (2024):
- Chrome: Full support since 2010
- Firefox: Full support since 2019
- Safari: Full support since 2020
- Edge: Full support since 2018
- Mobile browsers: 95%+ support

### AVIF Support (2024):
- Chrome: Full support since 2020
- Firefox: Full support since 2021
- Safari: Full support since 2022
- Edge: Full support since 2020
- Mobile browsers: 80%+ support

## Implementation Strategies

### Progressive Enhancement Approach:
Use the picture element to provide fallbacks for different image formats. This ensures the best format is served to each browser while maintaining compatibility.

## Future Outlook

### Short Term (2024-2025):
- AVIF adoption: Growing to 90%+ browser support
- Tool ecosystem: More conversion tools and libraries
- Performance gains: Widespread 40-50% size reductions

### Medium Term (2025-2027):
- AVIF dominance: Primary format for new projects
- WebP transition: Legacy support for older systems
- Hardware acceleration: Faster encoding and decoding

## Best Practices

1. Start with WebP: Immediate benefits with 25-35% size reduction
2. Add AVIF Support: Progressive enhancement without breaking functionality
3. Maintain Fallbacks: Always provide universal compatibility
4. Monitor and Optimize: Track performance and user experience

## Conclusion

The future of web images is clearly moving toward more efficient formats. While WebP offers immediate benefits with widespread support, AVIF represents the next generation with superior compression and quality.

The key to success is implementing a progressive enhancement strategy that provides the best possible experience for each user's browser while maintaining universal compatibility.`
  }
};

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = articles[slug];
  
  if (!article) {
    return {
      title: 'Article Not Found - SnapConvert',
    };
  }

  return {
    title: `${article.title} - SnapConvert`,
    description: article.excerpt,
    keywords: article.tags,
    authors: [{ name: "SnapConvert Team" }],
    creator: "SnapConvert",
    publisher: "SnapConvert",
    metadataBase: new URL('https://snapcovert.com'),
    alternates: {
      canonical: `/blog/${slug}`,
    },
    openGraph: {
      title: article.title,
      description: article.excerpt,
      url: `https://snapcovert.com/blog/${slug}`,
      siteName: 'SnapConvert',
      type: 'article',
      publishedTime: article.date,
      tags: article.tags,
      images: [
        {
          url: '/icon.svg',
          width: 512,
          height: 512,
          alt: article.title,
        },
      ],
      locale: 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: article.excerpt,
      images: ['/icon.svg'],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}

export default async function ArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const article = articles[slug];

  if (!article) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
      <BlogHeader />
      <div className="container mx-auto px-4 py-12">
        {/* Back to Blog */}
        <div className="mb-8">
          <Link
            href="/blog"
            className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
          >
            <svg className="mr-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Guides
          </Link>
        </div>

        {/* Article Header */}
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <span className="inline-block px-3 py-1 text-sm font-semibold bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full">
              {article.category}
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6">
            {article.title}
          </h1>

          <p className="text-xl text-slate-600 dark:text-slate-400 mb-8">
            {article.excerpt}
          </p>

          {/* Article Meta */}
          <div className="flex flex-wrap items-center gap-6 text-sm text-slate-500 dark:text-slate-500 mb-8 pb-8 border-b border-slate-200 dark:border-slate-700">
            <div className="flex items-center">
              <svg className="mr-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {new Date(article.date).toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </div>
            <div className="flex items-center">
              <svg className="mr-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {article.readTime}
            </div>
            <div className="flex flex-wrap gap-2">
              {article.tags.map((tag: string) => (
                <span
                  key={tag}
                  className="px-2 py-1 text-xs bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 rounded"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Article Content */}
          <div className="prose prose-lg prose-slate dark:prose-invert max-w-none">
            <div className="article-content text-slate-700 dark:text-slate-300 leading-relaxed">
              <pre className="whitespace-pre-wrap font-sans">{article.content}</pre>
            </div>
          </div>

          {/* Call to Action */}
          <div className="mt-12 p-8 bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
              Ready to Optimize Your Images?
            </h3>
            <p className="text-slate-600 dark:text-slate-400 mb-6">
              Put these techniques into practice with SnapConvert's powerful image conversion tools.
            </p>
            <Link
              href="/"
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Start Converting Images
              <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export async function generateStaticParams() {
  return [
    { slug: 'heic-vs-jpg-which-is-best' },
    { slug: 'reduce-image-file-size-without-losing-quality' },
    { slug: 'avif-vs-webp-future-of-web' },
  ];
}