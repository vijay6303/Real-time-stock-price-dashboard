import React from 'react';
import Link from 'next/link';
import Layout from '../components/Layout';

export default function About() {
  return (
    <Layout title="About - Real-Time Stock Dashboard">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            About Stock Dashboard
          </h1>
          <p className="text-xl text-gray-600">
            Your real-time stock tracking companion
          </p>
        </div>

        {/* Features */}
        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <span className="text-2xl">📊</span>
                <div>
                  <h3 className="font-medium text-gray-900">Real-time Data</h3>
                  <p className="text-gray-600">Live stock prices using free APIs with fallback data</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <span className="text-2xl">📈</span>
                <div>
                  <h3 className="font-medium text-gray-900">Interactive Charts</h3>
                  <p className="text-gray-600">30-day historical price movements visualization</p>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <span className="text-2xl">⚡</span>
                <div>
                  <h3 className="font-medium text-gray-900">Fast Performance</h3>
                  <p className="text-gray-600">Built with Next.js and optimized for speed</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <span className="text-2xl">💻</span>
                <div>
                  <h3 className="font-medium text-gray-900">Desktop Optimized</h3>
                  <p className="text-gray-600">Best experience on desktop and tablet devices</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Current Limitations */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <h2 className="text-xl font-bold text-yellow-800 mb-4">Current Limitations</h2>
          <div className="space-y-3 text-yellow-700">
            <div className="flex items-start space-x-2">
              <span className="text-yellow-600">⚠️</span>
              <p><strong>Mobile Experience:</strong> Not fully optimized for mobile devices yet</p>
            </div>
            <div className="flex items-start space-x-2">
              <span className="text-yellow-600">⚠️</span>
              <p><strong>API Limitations:</strong> Using free APIs with rate limits and potential delays</p>
            </div>
            <div className="flex items-start space-x-2">
              <span className="text-yellow-600">⚠️</span>
              <p><strong>Data Accuracy:</strong> Demo/fallback data may not reflect real market prices</p>
            </div>
          </div>
        </div>

        {/* Technology Stack */}
        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Technology Stack</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl mb-2">⚛️</div>
              <div className="font-medium">Next.js</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl mb-2">🎨</div>
              <div className="font-medium">Tailwind CSS</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl mb-2">📊</div>
              <div className="font-medium">Recharts</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl mb-2">🔷</div>
              <div className="font-medium">TypeScript</div>
            </div>
          </div>
        </div>

        {/* Future Improvements */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h2 className="text-xl font-bold text-blue-800 mb-4">Planned Improvements</h2>
          <div className="space-y-3 text-blue-700">
            <div className="flex items-start space-x-2">
              <span className="text-blue-600">🔮</span>
              <p><strong>Mobile Responsive Design:</strong> Complete mobile optimization coming soon</p>
            </div>
            <div className="flex items-start space-x-2">
              <span className="text-blue-600">🔮</span>
              <p><strong>Premium API Integration:</strong> More accurate real-time data</p>
            </div>
            <div className="flex items-start space-x-2">
              <span className="text-blue-600">🔮</span>
              <p><strong>Enhanced Charts:</strong> More chart types and technical indicators</p>
            </div>
            <div className="flex items-start space-x-2">
              <span className="text-blue-600">🔮</span>
              <p><strong>User Watchlists:</strong> Save and track favorite stocks</p>
            </div>
          </div>
        </div>

        {/* Back to Dashboard */}
        <div className="text-center">
          <Link 
            href="/"
            className="inline-block bg-primary-600 text-white px-8 py-3 rounded-md hover:bg-primary-700 transition-colors font-medium"
          >
            ← Back to Dashboard
          </Link>
        </div>
      </div>
    </Layout>
  );
}
