import { Metadata } from 'next';
import Link from 'next/link';
import { BlogHeader } from '../../../components/BlogHeader';
import '../blog.css';

export const metadata: Metadata = {
  title: 'PNG vs TIFF: Choosing the Right Format for Professional Work - SnapConvert',
  description: 'Professional photographer and designer guide to selecting between PNG and TIFF for print, digital, and archival purposes.',
  keywords: ['PNG', 'TIFF', 'professional', 'print', 'archival', 'design', 'photography'],
};

export default function PNGvsTIFFGuide() {
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
            <span>PNG vs TIFF Guide</span>
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
            <span className="text-4xl mr-3">🎨</span>
            <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">
              PNG vs TIFF: Choosing the Right Format for Professional Work
            </h1>
          </div>
          <p className="text-xl text-slate-600 dark:text-slate-400 mb-6">
            Professional photographer and designer guide to selecting between PNG and TIFF for print, digital, and archival purposes.
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm font-medium">
              Format Comparison
            </span>
            <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 rounded-full text-sm font-medium">
              Professional
            </span>
            <span className="px-3 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full text-sm font-medium">
              Print Quality
            </span>
          </div>
        </header>

        {/* Article Content */}
        <article className="prose prose-lg max-w-none dark:prose-invert">
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Understanding PNG and TIFF</h2>
            
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-blue-900 dark:text-blue-100 mb-4">PNG (Portable Network Graphics)</h3>
                <ul className="space-y-2 text-blue-800 dark:text-blue-200">
                  <li>• Lossless compression</li>
                  <li>• Supports transparency (alpha channel)</li>
                  <li>• 8-bit and 16-bit color depths</li>
                  <li>• Excellent for web graphics</li>
                  <li>• Smaller file sizes than TIFF</li>
                </ul>
              </div>
              
              <div className="bg-purple-50 dark:bg-purple-900/20 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-purple-900 dark:text-purple-100 mb-4">TIFF (Tagged Image File Format)</h3>
                <ul className="space-y-2 text-purple-800 dark:text-purple-200">
                  <li>• Lossless compression</li>
                  <li>• Supports layers and transparency</li>
                  <li>• Up to 32-bit color depth</li>
                  <li>• Industry standard for print</li>
                  <li>• Larger file sizes</li>
                </ul>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">When to Use PNG</h2>
            
            <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg mb-6">
              <h3 className="text-lg font-semibold text-green-900 dark:text-green-100 mb-4">✅ Best for PNG:</h3>
              <ul className="space-y-2 text-green-800 dark:text-green-200">
                <li>• <strong>Web graphics:</strong> Logos, icons, and UI elements</li>
                <li>• <strong>Transparency needs:</strong> Images requiring transparent backgrounds</li>
                <li>• <strong>Digital presentations:</strong> PowerPoint, Keynote slides</li>
                <li>• <strong>Social media:</strong> Profile pictures, banners</li>
                <li>• <strong>Screen displays:</strong> Digital signage, web content</li>
              </ul>
            </div>

            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">When to Use TIFF</h2>
            
            <div className="bg-orange-50 dark:bg-orange-900/20 p-6 rounded-lg mb-6">
              <h3 className="text-lg font-semibold text-orange-900 dark:text-orange-100 mb-4">✅ Best for TIFF:</h3>
              <ul className="space-y-2 text-orange-800 dark:text-orange-200">
                <li>• <strong>Print production:</strong> Magazines, brochures, posters</li>
                <li>• <strong>Professional photography:</strong> Client deliverables</li>
                <li>• <strong>Archival storage:</strong> Long-term preservation</li>
                <li>• <strong>High-end design:</strong> Packaging, branding materials</li>
                <li>• <strong>Color-critical work:</strong> CMYK printing workflows</li>
              </ul>
            </div>

            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Professional Workflow Recommendations</h2>
            
            <div className="space-y-6">
              <div className="border-l-4 border-blue-500 pl-6">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">Graphic Design</h3>
                <p className="text-slate-600 dark:text-slate-400">
                  Use PNG for web deliverables and TIFF for print materials. Maintain both versions in your asset library.
                </p>
              </div>
              
              <div className="border-l-4 border-purple-500 pl-6">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">Photography</h3>
                <p className="text-slate-600 dark:text-slate-400">
                  TIFF for client prints and archival storage, PNG for online portfolios and social media.
                </p>
              </div>
              
              <div className="border-l-4 border-green-500 pl-6">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">Web Development</h3>
                <p className="text-slate-600 dark:text-slate-400">
                  PNG for all web graphics requiring transparency or crisp edges. Avoid TIFF for web use.
                </p>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Quality and File Size Comparison</h2>
            
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-slate-300 dark:border-slate-600">
                <thead>
                  <tr className="bg-slate-100 dark:bg-slate-700">
                    <th className="border border-slate-300 dark:border-slate-600 p-3 text-left">Aspect</th>
                    <th className="border border-slate-300 dark:border-slate-600 p-3 text-left">PNG</th>
                    <th className="border border-slate-300 dark:border-slate-600 p-3 text-left">TIFF</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-slate-300 dark:border-slate-600 p-3 font-medium">File Size</td>
                    <td className="border border-slate-300 dark:border-slate-600 p-3">Smaller</td>
                    <td className="border border-slate-300 dark:border-slate-600 p-3">Larger</td>
                  </tr>
                  <tr className="bg-slate-50 dark:bg-slate-800">
                    <td className="border border-slate-300 dark:border-slate-600 p-3 font-medium">Color Depth</td>
                    <td className="border border-slate-300 dark:border-slate-600 p-3">8-bit, 16-bit</td>
                    <td className="border border-slate-300 dark:border-slate-600 p-3">Up to 32-bit</td>
                  </tr>
                  <tr>
                    <td className="border border-slate-300 dark:border-slate-600 p-3 font-medium">Transparency</td>
                    <td className="border border-slate-300 dark:border-slate-600 p-3">Excellent</td>
                    <td className="border border-slate-300 dark:border-slate-600 p-3">Good</td>
                  </tr>
                  <tr className="bg-slate-50 dark:bg-slate-800">
                    <td className="border border-slate-300 dark:border-slate-600 p-3 font-medium">Print Quality</td>
                    <td className="border border-slate-300 dark:border-slate-600 p-3">Good</td>
                    <td className="border border-slate-300 dark:border-slate-600 p-3">Excellent</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </article>

        {/* Call to Action */}
        <div className="text-center bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl p-8">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
            Ready to Convert Your Images?
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mb-6">
            Use SnapConvert's professional presets to optimize your PNG and TIFF images for any workflow.
          </p>
          <Link href="/" className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 dark:bg-purple-600 dark:hover:bg-purple-700 transition-colors shadow-lg">
            Start Converting Now
          </Link>
        </div>
        </div>
      </div>
    </div>
  );
}

