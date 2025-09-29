import { Metadata } from 'next';
import Link from 'next/link';
import { BlogHeader } from '../../../components/BlogHeader';
import { InContentAd } from '../../../components/AdSense';
import '../blog.css';

export const metadata: Metadata = {
  title: 'Optimizing Images for Social Media: Instagram, Facebook, Twitter - SnapConvert',
  description: 'Complete guide to image dimensions, formats, and quality settings for optimal social media performance across all platforms.',
  keywords: ['social media', 'Instagram', 'Facebook', 'Twitter', 'image optimization', 'dimensions', 'formats'],
  authors: [{ name: 'SnapConvert Team' }],
  creator: 'SnapConvert',
  publisher: 'SnapConvert',
  metadataBase: new URL('https://snapcovert.com'),
  alternates: {
    canonical: '/blog/social-media-image-optimization',
  },
  openGraph: {
    title: 'Optimizing Images for Social Media: Instagram, Facebook, Twitter',
    description: 'Complete guide to image dimensions, formats, and quality settings for optimal social media performance across all platforms.',
    url: 'https://snapcovert.com/blog/social-media-image-optimization',
    siteName: 'SnapConvert',
    type: 'article',
    publishedTime: '2024-01-18',
    tags: ['Instagram', 'Facebook', 'Twitter', 'Social Media', 'Dimensions'],
    images: [
      {
        url: '/icon.svg',
        width: 512,
        height: 512,
        alt: 'Social Media Optimization Guide',
      },
    ],
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Optimizing Images for Social Media: Instagram, Facebook, Twitter',
    description: 'Complete guide to image dimensions, formats, and quality settings for optimal social media performance across all platforms.',
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

export default function SocialMediaOptimizationGuide() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <BlogHeader />
      <div className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navigation */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          {/* Breadcrumbs */}
          <nav className="text-sm text-slate-600 dark:text-slate-400">
            <Link href="/blog" className="hover:underline">Guides</Link>
            <span className="mx-2">/</span>
            <span>Social Media Optimization</span>
          </nav>
          
          {/* Back to Convert Button */}
          <Link
            href="/"
            className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl text-sm"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            Convert Images
          </Link>
        </div>

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
          <div className="flex flex-wrap justify-center gap-2">
            <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm font-medium">
              Social Media
            </span>
            <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 rounded-full text-sm font-medium">
              Optimization
            </span>
            <span className="px-3 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full text-sm font-medium">
              Performance
            </span>
          </div>
        </header>

        {/* Article Content */}
        <article className="prose prose-lg max-w-none dark:prose-invert">
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Introduction</h2>
            <p className="text-slate-700 dark:text-slate-300 mb-6">
              Social media platforms have specific requirements for images that can significantly impact your content's performance. 
              Understanding these requirements and optimizing your images accordingly can improve engagement, loading speed, and overall user experience.
            </p>

            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Platform-Specific Requirements</h2>
            
            <div className="space-y-8">
              <div className="bg-pink-50 dark:bg-pink-900/20 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-pink-900 dark:text-pink-100 mb-4">📸 Instagram</h3>
                <p className="text-pink-800 dark:text-pink-200 mb-4">Instagram is highly visual and has strict image requirements:</p>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-pink-800 dark:text-pink-200 mb-2">Feed Posts:</h4>
                    <ul className="text-sm text-pink-700 dark:text-pink-300 space-y-1">
                      <li>• <strong>Square (1:1):</strong> 1080x1080px (recommended)</li>
                      <li>• <strong>Portrait (4:5):</strong> 1080x1350px</li>
                      <li>• <strong>Landscape (1.91:1):</strong> 1080x566px</li>
                      <li>• <strong>Format:</strong> JPEG or PNG</li>
                      <li>• <strong>File size:</strong> Under 30MB</li>
                      <li>• <strong>Quality:</strong> 85-90% for best results</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-pink-800 dark:text-pink-200 mb-2">Stories & Reels:</h4>
                    <ul className="text-sm text-pink-700 dark:text-pink-300 space-y-1">
                      <li>• <strong>Stories:</strong> 1080x1920px (9:16 ratio)</li>
                      <li>• <strong>Reels:</strong> 1080x1920px (9:16 ratio)</li>
                      <li>• <strong>Duration:</strong> 15-90 seconds</li>
                      <li>• <strong>Format:</strong> MP4 (video) or JPEG</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-blue-900 dark:text-blue-100 mb-4">📘 Facebook</h3>
                <p className="text-blue-800 dark:text-blue-200 mb-4">Facebook supports various image formats and sizes:</p>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">Profile & Cover:</h4>
                    <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                      <li>• <strong>Profile Picture:</strong> 170x170px (displayed)</li>
                      <li>• <strong>Cover Photo:</strong> 1200x630px</li>
                      <li>• <strong>File size:</strong> Under 5MB</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">Posts & Events:</h4>
                    <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                      <li>• <strong>Post Images:</strong> 1200x630px (1.91:1 ratio)</li>
                      <li>• <strong>Event Images:</strong> 1920x1080px (16:9 ratio)</li>
                      <li>• <strong>File size:</strong> Under 8MB</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-sky-50 dark:bg-sky-900/20 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-sky-900 dark:text-sky-100 mb-4">🐦 Twitter/X</h3>
                <p className="text-sky-800 dark:text-sky-200 mb-4">Twitter has evolved its image requirements:</p>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-sky-800 dark:text-sky-200 mb-2">Tweet Images:</h4>
                    <ul className="text-sm text-sky-700 dark:text-sky-300 space-y-1">
                      <li>• <strong>Single image:</strong> 1200x675px (16:9 ratio)</li>
                      <li>• <strong>Multiple images:</strong> 1200x675px each</li>
                      <li>• <strong>Format:</strong> JPEG, PNG, or WebP</li>
                      <li>• <strong>File size:</strong> Under 5MB per image</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-sky-800 dark:text-sky-200 mb-2">Profile & Header:</h4>
                    <ul className="text-sm text-sky-700 dark:text-sky-300 space-y-1">
                      <li>• <strong>Profile Picture:</strong> 400x400px</li>
                      <li>• <strong>Header Image:</strong> 1500x500px (3:1 ratio)</li>
                      <li>• <strong>File size:</strong> Under 5MB</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-indigo-50 dark:bg-indigo-900/20 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-indigo-900 dark:text-indigo-100 mb-4">💼 LinkedIn</h3>
                <p className="text-indigo-800 dark:text-indigo-200 mb-4">LinkedIn focuses on professional content:</p>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-indigo-800 dark:text-indigo-200 mb-2">Post Images:</h4>
                    <ul className="text-sm text-indigo-700 dark:text-indigo-300 space-y-1">
                      <li>• <strong>Recommended:</strong> 1200x627px (1.91:1 ratio)</li>
                      <li>• <strong>Minimum:</strong> 552x276px</li>
                      <li>• <strong>Format:</strong> JPEG or PNG</li>
                      <li>• <strong>File size:</strong> Under 5MB</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-indigo-800 dark:text-indigo-200 mb-2">Company Assets:</h4>
                    <ul className="text-sm text-indigo-700 dark:text-indigo-300 space-y-1">
                      <li>• <strong>Company Logo:</strong> 300x300px</li>
                      <li>• <strong>Cover Image:</strong> 1192x220px</li>
                      <li>• <strong>Format:</strong> PNG (with transparency)</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Optimization Strategies</h2>
            
            <div className="space-y-6">
              <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-green-900 dark:text-green-100 mb-4">1. Format Selection</h3>
                <ul className="space-y-2 text-green-800 dark:text-green-200">
                  <li>• <strong>JPEG:</strong> Best for photos, smaller file sizes</li>
                  <li>• <strong>PNG:</strong> Best for graphics, logos, images with text</li>
                  <li>• <strong>WebP:</strong> Modern format, excellent compression (supported by most platforms)</li>
                </ul>
              </div>

              <div className="bg-orange-50 dark:bg-orange-900/20 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-orange-900 dark:text-orange-100 mb-4">2. Quality Settings</h3>
                <ul className="space-y-2 text-orange-800 dark:text-orange-200">
                  <li>• <strong>High quality (90-95%):</strong> Professional content, product photos</li>
                  <li>• <strong>Medium quality (80-85%):</strong> General social media posts</li>
                  <li>• <strong>Lower quality (70-75%):</strong> Quick sharing, mobile uploads</li>
                </ul>
              </div>

              <div className="bg-purple-50 dark:bg-purple-900/20 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-purple-900 dark:text-purple-100 mb-4">3. File Size Optimization</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold text-purple-800 dark:text-purple-200 mb-2">Platform Limits:</h4>
                    <ul className="text-sm text-purple-700 dark:text-purple-300">
                      <li>• Instagram: Under 30MB (aim for under 5MB)</li>
                      <li>• Facebook: Under 8MB (aim for under 1MB)</li>
                      <li>• Twitter: Under 5MB (aim for under 2MB)</li>
                      <li>• LinkedIn: Under 5MB (aim for under 1MB)</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-purple-800 dark:text-purple-200 mb-2">Best Practices:</h4>
                    <ul className="text-sm text-purple-700 dark:text-purple-300">
                      <li>• Use progressive JPEG for better loading</li>
                      <li>• Strip EXIF data to reduce file size</li>
                      <li>• Optimize for mobile viewing</li>
                      <li>• Test different quality settings</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Best Practices</h2>
            
            <div className="space-y-6">
              <div className="border-l-4 border-blue-500 pl-6">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">Aspect Ratios</h3>
                <ul className="space-y-1 text-slate-600 dark:text-slate-400">
                  <li>• <strong>Square (1:1):</strong> Instagram feed, Facebook posts</li>
                  <li>• <strong>Landscape (16:9):</strong> Twitter, LinkedIn, Facebook cover</li>
                  <li>• <strong>Portrait (4:5):</strong> Instagram feed, Pinterest</li>
                  <li>• <strong>Stories (9:16):</strong> Instagram Stories, Facebook Stories</li>
                </ul>
              </div>
              
              <div className="border-l-4 border-green-500 pl-6">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">Visual Design</h3>
                <ul className="space-y-1 text-slate-600 dark:text-slate-400">
                  <li>• <strong>High contrast:</strong> Better visibility on mobile devices</li>
                  <li>• <strong>Vibrant colors:</strong> More engaging on social feeds</li>
                  <li>• <strong>Consistent branding:</strong> Maintain brand colors across platforms</li>
                  <li>• <strong>Readable fonts:</strong> Use bold, sans-serif fonts for text overlays</li>
                </ul>
              </div>
              
              <div className="border-l-4 border-purple-500 pl-6">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">Mobile Optimization</h3>
                <ul className="space-y-1 text-slate-600 dark:text-slate-400">
                  <li>• <strong>Mobile-first:</strong> Most users view on mobile devices</li>
                  <li>• <strong>Thumb-friendly:</strong> Ensure images are clear at small sizes</li>
                  <li>• <strong>Fast loading:</strong> Optimize for slower mobile connections</li>
                  <li>• <strong>Safe areas:</strong> Keep text away from edges (platforms may crop)</li>
                </ul>
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 p-6 rounded-lg mt-8">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">SnapConvert Recommendations</h3>
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <h4 className="font-semibold text-slate-800 dark:text-slate-200 mb-2">For Social Media Managers:</h4>
                  <ul className="text-sm text-slate-700 dark:text-slate-300">
                    <li>• Create presets for each platform</li>
                    <li>• Batch process content calendars</li>
                    <li>• Use "Web Optimized" preset</li>
                    <li>• Maintain consistent quality</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-slate-800 dark:text-slate-200 mb-2">For Content Creators:</h4>
                  <ul className="text-sm text-slate-700 dark:text-slate-300">
                    <li>• Optimize for mobile viewing</li>
                    <li>• Use high contrast for visibility</li>
                    <li>• Keep file sizes small</li>
                    <li>• Test different formats</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-slate-800 dark:text-slate-200 mb-2">For Businesses:</h4>
                  <ul className="text-sm text-slate-700 dark:text-slate-300">
                    <li>• Maintain brand consistency</li>
                    <li>• Use professional quality images</li>
                    <li>• Optimize for each platform</li>
                    <li>• Monitor performance</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </article>

        {/* AdSense Ad */}
        <div className="flex justify-center my-8">
          <InContentAd />
        </div>

        {/* Call to Action */}
        <div className="text-center bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl p-8">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
            Optimize Your Social Media Images
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mb-6">
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
