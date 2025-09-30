import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://snapcovert.com'
  
  // Static pages
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/tutorials`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/faq`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    },
  ]

  // Blog posts that exist as static pages
  const staticBlogPosts = [
    'advanced-image-optimization-techniques',
    'batch-processing-large-photo-libraries', 
    'mobile-photography-heic-conversion-guide',
    'next-generation-image-formats',
    'png-vs-tiff-professional-work',
    'social-media-image-optimization',
    'web-performance-image-optimization',
  ]

  // Blog posts that exist in dynamic routes
  const dynamicBlogPosts = [
    'heic-vs-jpg-which-is-best',
    'reduce-image-file-size-without-losing-quality',
    'avif-vs-webp-future-of-web',
  ]

  // Generate sitemap entries for static blog posts
  const blogPages = [
    ...staticBlogPosts.map((slug) => ({
      url: `${baseUrl}/blog/${slug}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
    ...dynamicBlogPosts.map((slug) => ({
      url: `${baseUrl}/blog/${slug}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
  ]

  return [...staticPages, ...blogPages]
}
