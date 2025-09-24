import { Metadata } from 'next';
import Link from 'next/link';
import { BlogHeader } from '../../../components/BlogHeader';
import { InContentAd } from '../../../components/AdSense';
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
        {/* Navigation */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          {/* Breadcrumbs */}
          <nav className="text-sm text-slate-600 dark:text-slate-400">
            <Link href="/blog" className="hover:underline">Guides</Link>
            <span className="mx-2">/</span>
            <span>Web Performance Guide</span>
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
            <span className="text-4xl mr-3">⚡</span>
            <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">
              Web Performance: Image Optimization for Faster Loading
            </h1>
          </div>
          <p className="text-xl text-slate-600 dark:text-slate-400 mb-6">
            Technical guide to improving Core Web Vitals and page speed through strategic image format selection and optimization.
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm font-medium">
              Web Performance
            </span>
            <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 rounded-full text-sm font-medium">
              Core Web Vitals
            </span>
            <span className="px-3 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full text-sm font-medium">
              SEO
            </span>
          </div>
        </header>

        {/* Article Content */}
        <article className="prose prose-lg max-w-none dark:prose-invert">
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Introduction</h2>
            <p className="text-slate-700 dark:text-slate-300 mb-6">
              Images account for 60-80% of a typical web page's total size, making them the primary factor affecting page load speed and Core Web Vitals. 
              Optimizing images can dramatically improve user experience, SEO rankings, and conversion rates.
            </p>

            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Core Web Vitals and Images</h2>
            
            <div className="space-y-6">
              <div className="bg-red-50 dark:bg-red-900/20 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-red-900 dark:text-red-100 mb-4">🚨 Largest Contentful Paint (LCP)</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-red-800 dark:text-red-200 mb-2">Target & Impact:</h4>
                    <ul className="text-sm text-red-700 dark:text-red-300 space-y-1">
                      <li>• <strong>Target:</strong> Under 2.5 seconds</li>
                      <li>• <strong>Impact:</strong> Images are often the LCP element</li>
                      <li>• <strong>Critical:</strong> Above-the-fold images</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-red-800 dark:text-red-200 mb-2">Optimization:</h4>
                    <ul className="text-sm text-red-700 dark:text-red-300 space-y-1">
                      <li>• Use next-gen formats (AVIF, WebP)</li>
                      <li>• Optimize file sizes aggressively</li>
                      <li>• Implement lazy loading</li>
                      <li>• Preload critical images</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-orange-50 dark:bg-orange-900/20 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-orange-900 dark:text-orange-100 mb-4">⚡ First Input Delay (FID)</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-orange-800 dark:text-orange-200 mb-2">Target & Impact:</h4>
                    <ul className="text-sm text-orange-700 dark:text-orange-300 space-y-1">
                      <li>• <strong>Target:</strong> Under 100 milliseconds</li>
                      <li>• <strong>Impact:</strong> Heavy image processing blocks main thread</li>
                      <li>• <strong>Critical:</strong> User interaction responsiveness</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-orange-800 dark:text-orange-200 mb-2">Optimization:</h4>
                    <ul className="text-sm text-orange-700 dark:text-orange-300 space-y-1">
                      <li>• Use Web Workers for processing</li>
                      <li>• Optimize image processing</li>
                      <li>• Defer non-critical images</li>
                      <li>• Use efficient formats</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 dark:bg-yellow-900/20 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-yellow-900 dark:text-yellow-100 mb-4">📐 Cumulative Layout Shift (CLS)</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2">Target & Impact:</h4>
                    <ul className="text-sm text-yellow-700 dark:text-yellow-300 space-y-1">
                      <li>• <strong>Target:</strong> Under 0.1</li>
                      <li>• <strong>Impact:</strong> Images without dimensions cause shifts</li>
                      <li>• <strong>Critical:</strong> Visual stability</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2">Optimization:</h4>
                    <ul className="text-sm text-yellow-700 dark:text-yellow-300 space-y-1">
                      <li>• Always specify image dimensions</li>
                      <li>• Use aspect-ratio CSS</li>
                      <li>• Reserve space for images</li>
                      <li>• Use placeholder images</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Image Format Selection for Performance</h2>
            
            <div className="space-y-6">
              <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-green-900 dark:text-green-100 mb-4">🚀 Modern Formats (Recommended)</h3>
                <div className="grid md:grid-cols-3 gap-6">
                  <div>
                    <h4 className="font-semibold text-green-800 dark:text-green-200 mb-2">WebP</h4>
                    <ul className="text-sm text-green-700 dark:text-green-300 space-y-1">
                      <li>• 25-35% smaller than JPEG</li>
                      <li>• 95%+ browser support</li>
                      <li>• Best for: Photos, graphics</li>
                      <li>• Fallback: JPEG</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-green-800 dark:text-green-200 mb-2">AVIF</h4>
                    <ul className="text-sm text-green-700 dark:text-green-300 space-y-1">
                      <li>• 50% smaller than JPEG</li>
                      <li>• 85%+ browser support</li>
                      <li>• Best for: High-quality photos</li>
                      <li>• Fallback: WebP, JPEG</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-green-800 dark:text-green-200 mb-2">JPEG XL</h4>
                    <ul className="text-sm text-green-700 dark:text-green-300 space-y-1">
                      <li>• 20% smaller than JPEG</li>
                      <li>• Limited browser support</li>
                      <li>• Best for: Future-proofing</li>
                      <li>• Fallback: AVIF, WebP, JPEG</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-4">📷 Traditional Formats</h3>
                <div className="grid md:grid-cols-3 gap-6">
                  <div>
                    <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">JPEG</h4>
                    <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                      <li>• Good compression for photos</li>
                      <li>• Universal browser support</li>
                      <li>• Best for: Photos, complex images</li>
                      <li>• Optimization: Progressive, 80-85% quality</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">PNG</h4>
                    <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                      <li>• Lossless compression</li>
                      <li>• Universal browser support</li>
                      <li>• Best for: Graphics, transparency</li>
                      <li>• Optimization: PNG-8 for simple graphics</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">GIF</h4>
                    <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                      <li>• Poor compression</li>
                      <li>• Universal browser support</li>
                      <li>• Best for: Simple animations</li>
                      <li>• Alternative: Use WebP or MP4</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Optimization Strategies</h2>
            
            <div className="space-y-6">
              <div className="border-l-4 border-purple-500 pl-6">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">1. Format Selection Strategy</h3>
                <p className="text-slate-600 dark:text-slate-400 mb-4">Use the picture element for progressive enhancement:</p>
                <div className="bg-slate-100 dark:bg-slate-700 p-4 rounded-lg">
                  <code className="text-sm text-slate-800 dark:text-slate-200">
                    &lt;picture&gt;<br/>
                    &nbsp;&nbsp;&lt;source srcset="image.avif" type="image/avif"&gt;<br/>
                    &nbsp;&nbsp;&lt;source srcset="image.webp" type="image/webp"&gt;<br/>
                    &nbsp;&nbsp;&lt;img src="image.jpg" alt="Description" width="800" height="600"&gt;<br/>
                    &lt;/picture&gt;
                  </code>
                </div>
              </div>
              
              <div className="border-l-4 border-green-500 pl-6">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">2. Responsive Images</h3>
                <p className="text-slate-600 dark:text-slate-400 mb-4">Serve different sizes for different devices:</p>
                <div className="bg-slate-100 dark:bg-slate-700 p-4 rounded-lg">
                  <code className="text-sm text-slate-800 dark:text-slate-200">
                    &lt;img<br/>
                    &nbsp;&nbsp;srcset="image-320w.webp 320w, image-640w.webp 640w, image-1280w.webp 1280w"<br/>
                    &nbsp;&nbsp;sizes="(max-width: 320px) 280px, (max-width: 640px) 600px, 1200px"<br/>
                    &nbsp;&nbsp;src="image-640w.webp"<br/>
                    &nbsp;&nbsp;alt="Description"<br/>
                    &nbsp;&nbsp;width="640"<br/>
                    &nbsp;&nbsp;height="480"<br/>
                    &gt;
                  </code>
                </div>
              </div>
              
              <div className="border-l-4 border-blue-500 pl-6">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">3. Lazy Loading</h3>
                <p className="text-slate-600 dark:text-slate-400 mb-4">Defer loading of images below the fold:</p>
                <div className="bg-slate-100 dark:bg-slate-700 p-4 rounded-lg">
                  <code className="text-sm text-slate-800 dark:text-slate-200">
                    &lt;img<br/>
                    &nbsp;&nbsp;src="image.webp"<br/>
                    &nbsp;&nbsp;alt="Description"<br/>
                    &nbsp;&nbsp;loading="lazy"<br/>
                    &nbsp;&nbsp;width="800"<br/>
                    &nbsp;&nbsp;height="600"<br/>
                    &gt;
                  </code>
                </div>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Quality vs Performance Balance</h2>
            
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-slate-300 dark:border-slate-600">
                <thead>
                  <tr className="bg-slate-100 dark:bg-slate-700">
                    <th className="border border-slate-300 dark:border-slate-600 p-3 text-left">Use Case</th>
                    <th className="border border-slate-300 dark:border-slate-600 p-3 text-left">Format</th>
                    <th className="border border-slate-300 dark:border-slate-600 p-3 text-left">Quality</th>
                    <th className="border border-slate-300 dark:border-slate-600 p-3 text-left">Loading</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-slate-300 dark:border-slate-600 p-3 font-medium">Hero Images (LCP)</td>
                    <td className="border border-slate-300 dark:border-slate-600 p-3">AVIF or WebP</td>
                    <td className="border border-slate-300 dark:border-slate-600 p-3">85-90%</td>
                    <td className="border border-slate-300 dark:border-slate-600 p-3">Eager, preloaded</td>
                  </tr>
                  <tr className="bg-slate-50 dark:bg-slate-800">
                    <td className="border border-slate-300 dark:border-slate-600 p-3 font-medium">Content Images</td>
                    <td className="border border-slate-300 dark:border-slate-600 p-3">WebP with JPEG fallback</td>
                    <td className="border border-slate-300 dark:border-slate-600 p-3">80-85%</td>
                    <td className="border border-slate-300 dark:border-slate-600 p-3">Lazy loaded</td>
                  </tr>
                  <tr>
                    <td className="border border-slate-300 dark:border-slate-600 p-3 font-medium">Thumbnails</td>
                    <td className="border border-slate-300 dark:border-slate-600 p-3">WebP or JPEG</td>
                    <td className="border border-slate-300 dark:border-slate-600 p-3">70-75%</td>
                    <td className="border border-slate-300 dark:border-slate-600 p-3">Lazy loaded</td>
                  </tr>
                  <tr className="bg-slate-50 dark:bg-slate-800">
                    <td className="border border-slate-300 dark:border-slate-600 p-3 font-medium">Icons and Graphics</td>
                    <td className="border border-slate-300 dark:border-slate-600 p-3">SVG or PNG-8</td>
                    <td className="border border-slate-300 dark:border-slate-600 p-3">Lossless</td>
                    <td className="border border-slate-300 dark:border-slate-600 p-3">Inline or preloaded</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Performance Monitoring</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-indigo-50 dark:bg-indigo-900/20 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-indigo-900 dark:text-indigo-100 mb-4">Key Metrics to Track</h3>
                <ul className="space-y-2 text-indigo-800 dark:text-indigo-200">
                  <li>• <strong>LCP:</strong> Largest Contentful Paint</li>
                  <li>• <strong>FID:</strong> First Input Delay</li>
                  <li>• <strong>CLS:</strong> Cumulative Layout Shift</li>
                  <li>• <strong>Image load time:</strong> Individual image performance</li>
                  <li>• <strong>Total page size:</strong> Overall image impact</li>
                </ul>
              </div>
              
              <div className="bg-purple-50 dark:bg-purple-900/20 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-purple-900 dark:text-purple-100 mb-4">Tools for Monitoring</h3>
                <ul className="space-y-2 text-purple-800 dark:text-purple-200">
                  <li>• <strong>Google PageSpeed Insights:</strong> Core Web Vitals</li>
                  <li>• <strong>WebPageTest:</strong> Detailed performance analysis</li>
                  <li>• <strong>Chrome DevTools:</strong> Real-time performance monitoring</li>
                  <li>• <strong>Lighthouse:</strong> Comprehensive performance audit</li>
                </ul>
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 p-6 rounded-lg mt-8">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">SnapConvert Recommendations</h3>
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <h4 className="font-semibold text-slate-800 dark:text-slate-200 mb-2">For Web Developers:</h4>
                  <ul className="text-sm text-slate-700 dark:text-slate-300">
                    <li>• Use "Web Optimized" preset</li>
                    <li>• Create custom presets</li>
                    <li>• Batch process image libraries</li>
                    <li>• Test different formats</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-slate-800 dark:text-slate-200 mb-2">For Content Creators:</h4>
                  <ul className="text-sm text-slate-700 dark:text-slate-300">
                    <li>• Optimize before uploading</li>
                    <li>• Use consistent quality settings</li>
                    <li>• Consider responsive images</li>
                    <li>• Monitor performance regularly</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-slate-800 dark:text-slate-200 mb-2">For E-commerce:</h4>
                  <ul className="text-sm text-slate-700 dark:text-slate-300">
                    <li>• Optimize product images</li>
                    <li>• Use high quality for zoom</li>
                    <li>• Implement lazy loading</li>
                    <li>• Test on mobile devices</li>
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
            Optimize Your Web Images
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mb-6">
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
