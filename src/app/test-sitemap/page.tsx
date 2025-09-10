import { NextResponse } from 'next/server';

export default function TestSitemap() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Sitemap Test</h1>
      <p className="mb-4">Testing sitemap accessibility...</p>
      <a 
        href="/sitemap.xml" 
        className="text-blue-600 hover:underline"
        target="_blank"
        rel="noopener noreferrer"
      >
        Click here to test sitemap.xml
      </a>
    </div>
  );
}
