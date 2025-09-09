import { Metadata } from 'next';
import Link from 'next/link';
import { BlogHeader } from '../../../components/BlogHeader';
import '../blog.css';

export const metadata: Metadata = {
  title: 'Next-Generation Image Formats: The Future of Digital Images - SnapConvert',
  description: 'Explore emerging image formats like AVIF, HEIF, and WebP 2.0 that are revolutionizing digital image compression and quality.',
  keywords: ['AVIF', 'HEIF', 'WebP 2.0', 'future formats', 'next generation', 'image compression', 'emerging technology'],
};

export default function NextGenFormatsGuide() {
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
            <span>Next-Gen Formats</span>
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
            <span className="text-4xl mr-3">🚀</span>
            <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">
              Next-Generation Image Formats: The Future of Digital Images
            </h1>
          </div>
          <p className="text-xl text-slate-600 dark:text-slate-400 mb-6">
            Explore emerging image formats like AVIF, HEIF, and WebP 2.0 that are revolutionizing digital image compression and quality.
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm font-medium">
              Future Tech
            </span>
            <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 rounded-full text-sm font-medium">
              Innovation
            </span>
            <span className="px-3 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full text-sm font-medium">
              Compression
            </span>
          </div>
        </header>

        {/* Article Content */}
        <article className="prose prose-lg max-w-none dark:prose-invert">
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">The Evolution of Image Formats</h2>
            
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 p-6 rounded-lg mb-8">
              <p className="text-slate-700 dark:text-slate-300 mb-4">
                The digital image landscape is rapidly evolving. New formats are emerging that offer unprecedented compression efficiency, 
                superior quality, and advanced features that were unimaginable just a few years ago.
              </p>
              <p className="text-slate-600 dark:text-slate-400">
                These next-generation formats are not just incremental improvements—they represent fundamental shifts in how we think about 
                digital image storage, transmission, and display.
              </p>
            </div>

            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">AVIF: The New Standard</h2>
            
            <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg mb-6">
              <h3 className="text-xl font-semibold text-green-900 dark:text-green-100 mb-4">AV1 Image File Format</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-green-800 dark:text-green-200 mb-2">Advantages:</h4>
                  <ul className="space-y-1 text-green-700 dark:text-green-300">
                    <li>• 50% smaller than JPEG</li>
                    <li>• 30% smaller than WebP</li>
                    <li>• 10-bit and 12-bit color support</li>
                    <li>• HDR and wide color gamut</li>
                    <li>• Lossless and lossy modes</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-green-800 dark:text-green-200 mb-2">Use Cases:</h4>
                  <ul className="space-y-1 text-green-700 dark:text-green-300">
                    <li>• High-quality web images</li>
                    <li>• Mobile photography</li>
                    <li>• Streaming content</li>
                    <li>• Professional photography</li>
                    <li>• E-commerce product images</li>
                  </ul>
                </div>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">HEIF: Apple's Innovation</h2>
            
            <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg mb-6">
              <h3 className="text-xl font-semibold text-blue-900 dark:text-blue-100 mb-4">High Efficiency Image Format</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">Features:</h4>
                  <ul className="space-y-1 text-blue-700 dark:text-blue-300">
                    <li>• 50% smaller than JPEG</li>
                    <li>• 16-bit color depth</li>
                    <li>• Live Photos support</li>
                    <li>• Burst mode sequences</li>
                    <li>• Advanced metadata</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">Adoption:</h4>
                  <ul className="space-y-1 text-blue-700 dark:text-blue-300">
                    <li>• iPhone default format</li>
                    <li>• macOS and iOS native</li>
                    <li>• Windows 10+ support</li>
                    <li>• Android compatibility</li>
                    <li>• Web browser support growing</li>
                  </ul>
                </div>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">WebP 2.0: The Next Evolution</h2>
            
            <div className="bg-purple-50 dark:bg-purple-900/20 p-6 rounded-lg mb-6">
              <h3 className="text-xl font-semibold text-purple-900 dark:text-purple-100 mb-4">Enhanced WebP</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-purple-800 dark:text-purple-200 mb-2">Improvements:</h4>
                  <ul className="space-y-1 text-purple-700 dark:text-purple-300">
                    <li>• Better compression algorithms</li>
                    <li>• Enhanced lossless mode</li>
                    <li>• Improved animation support</li>
                    <li>• Better HDR handling</li>
                    <li>• Advanced metadata support</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-purple-800 dark:text-purple-200 mb-2">Performance:</h4>
                  <ul className="space-y-1 text-purple-700 dark:text-purple-300">
                    <li>• 20% better compression</li>
                    <li>• Faster encoding/decoding</li>
                    <li>• Lower memory usage</li>
                    <li>• Better mobile performance</li>
                    <li>• Improved browser support</li>
                  </ul>
                </div>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Emerging Technologies</h2>
            
            <div className="space-y-6">
              <div className="border-l-4 border-orange-500 pl-6">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">JPEG XL</h3>
                <p className="text-slate-600 dark:text-slate-400 mb-2">
                  The next-generation JPEG format offering 20% better compression than JPEG with full backward compatibility.
                </p>
                <ul className="text-sm text-slate-500 dark:text-slate-500">
                  <li>• Progressive loading</li>
                  <li>• Lossless recompression</li>
                  <li>• HDR support</li>
                  <li>• Advanced metadata</li>
                </ul>
              </div>
              
              <div className="border-l-4 border-red-500 pl-6">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">BPG (Better Portable Graphics)</h3>
                <p className="text-slate-600 dark:text-slate-400 mb-2">
                  Based on the HEVC video codec, offering superior compression for still images.
                </p>
                <ul className="text-sm text-slate-500 dark:text-slate-500">
                  <li>• 50% smaller than JPEG</li>
                  <li>• 8-bit and 10-bit support</li>
                  <li>• Lossless mode</li>
                  <li>• Animation support</li>
                </ul>
              </div>
              
              <div className="border-l-4 border-green-500 pl-6">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">FLIF (Free Lossless Image Format)</h3>
                <p className="text-slate-600 dark:text-slate-400 mb-2">
                  Revolutionary lossless format that's often smaller than lossy JPEG files.
                </p>
                <ul className="text-sm text-slate-500 dark:text-slate-500">
                  <li>• Progressive decoding</li>
                  <li>• Universal format</li>
                  <li>• Superior compression</li>
                  <li>• Future-proof design</li>
                </ul>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Browser Support Timeline</h2>
            
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-slate-300 dark:border-slate-600">
                <thead>
                  <tr className="bg-slate-100 dark:bg-slate-700">
                    <th className="border border-slate-300 dark:border-slate-600 p-3 text-left">Format</th>
                    <th className="border border-slate-300 dark:border-slate-600 p-3 text-left">Chrome</th>
                    <th className="border border-slate-300 dark:border-slate-600 p-3 text-left">Firefox</th>
                    <th className="border border-slate-300 dark:border-slate-600 p-3 text-left">Safari</th>
                    <th className="border border-slate-300 dark:border-slate-600 p-3 text-left">Edge</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-slate-300 dark:border-slate-600 p-3 font-medium">WebP</td>
                    <td className="border border-slate-300 dark:border-slate-600 p-3">✅ Full</td>
                    <td className="border border-slate-300 dark:border-slate-600 p-3">✅ Full</td>
                    <td className="border border-slate-300 dark:border-slate-600 p-3">✅ Full</td>
                    <td className="border border-slate-300 dark:border-slate-600 p-3">✅ Full</td>
                  </tr>
                  <tr className="bg-slate-50 dark:bg-slate-800">
                    <td className="border border-slate-300 dark:border-slate-600 p-3 font-medium">AVIF</td>
                    <td className="border border-slate-300 dark:border-slate-600 p-3">✅ Full</td>
                    <td className="border border-slate-300 dark:border-slate-600 p-3">✅ Full</td>
                    <td className="border border-slate-300 dark:border-slate-600 p-3">✅ Full</td>
                    <td className="border border-slate-300 dark:border-slate-600 p-3">✅ Full</td>
                  </tr>
                  <tr>
                    <td className="border border-slate-300 dark:border-slate-600 p-3 font-medium">HEIF</td>
                    <td className="border border-slate-300 dark:border-slate-600 p-3">⚠️ Limited</td>
                    <td className="border border-slate-300 dark:border-slate-600 p-3">❌ No</td>
                    <td className="border border-slate-300 dark:border-slate-600 p-3">✅ Full</td>
                    <td className="border border-slate-300 dark:border-slate-600 p-3">✅ Full</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Future Predictions</h2>
            
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-indigo-900 dark:text-indigo-100 mb-4">What to Expect in 2024-2025</h3>
              <ul className="space-y-2 text-indigo-800 dark:text-indigo-200">
                <li>• <strong>Universal AVIF adoption:</strong> 90%+ browser support</li>
                <li>• <strong>HEIF web integration:</strong> Native browser support</li>
                <li>• <strong>AI-powered compression:</strong> Machine learning optimization</li>
                <li>• <strong>Real-time format conversion:</strong> Dynamic format selection</li>
                <li>• <strong>Enhanced metadata:</strong> Rich image information</li>
                <li>• <strong>3D image formats:</strong> Volumetric image support</li>
              </ul>
            </div>
          </div>
        </article>

        {/* Call to Action */}
        <div className="text-center bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl p-8">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
            Experience Next-Generation Image Formats
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mb-6">
            Convert your images to AVIF, HEIF, and other cutting-edge formats with SnapConvert's advanced conversion engine.
          </p>
          <Link href="/" className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 dark:bg-purple-600 dark:hover:bg-purple-700 transition-colors shadow-lg">
            Try Next-Gen Formats
          </Link>
        </div>
        </div>
      </div>
    </div>
  );
}

