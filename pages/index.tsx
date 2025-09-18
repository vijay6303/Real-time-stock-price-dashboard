import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import StockCard from '../components/StockCard';
import Loader from '../components/Loader';
import { useStockList } from '../hooks/useStockList';
import { POPULAR_STOCKS } from '../lib/alpha-vantage';
import Link from 'next/link';

// This page uses Client-Side Rendering with static markup
export default function Home() {
  // Client-side data fetching with useStockList hook
  const { stocks, loading, error, refetch } = useStockList(POPULAR_STOCKS.slice(0, 6));
  const [mounted, setMounted] = useState(false);

  // Ensure component is mounted before showing dynamic content
  useEffect(() => {
    setMounted(true);
  }, []);

  if (loading) {
    return (
      <Layout>
        <div className="text-center py-12">
          <Loader size="lg" text="Loading stock data (max 5s)..." />
          <div className="mt-4 text-sm text-gray-500">
            If this takes too long, we'll show demo data
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="text-center py-12">
          <div className="text-orange-600 text-lg font-medium mb-4">
            ⚠️ API Issue Detected
          </div>
          <div className="text-gray-600 mb-4">
            {error}
          </div>
          <div className="text-sm text-gray-500 mb-6">
            Showing demo data instead. Try refreshing for live data.
          </div>
          <button 
            onClick={refetch}
            className="bg-primary-600 text-white px-6 py-2 rounded-md hover:bg-primary-700 transition-colors"
          >
            🔄 Try Live Data Again
          </button>
        </div>
      </Layout>
    );
  }

  const formatTimeForDisplay = () => {
    const now = new Date();
    return `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')} ${now.getHours() >= 12 ? 'PM' : 'AM'}`;
  };

  return (
    <Layout>
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            📊 Stock Dashboard
          </h1>
          <p className="text-xl text-gray-600 mb-6">
            Real-time stock market overview and insights
          </p>
          
          {/* Quick Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/stocks"
              className="bg-primary-600 text-white px-6 py-3 rounded-md hover:bg-primary-700 transition-colors font-medium"
            >
              📈 View Full Portfolio
            </Link>
            <button 
              onClick={refetch}
              className="bg-green-600 text-white px-6 py-3 rounded-md hover:bg-green-700 transition-colors font-medium"
            >
              🔄 Refresh Data
            </button>
          </div>
        </div>

        {/* Market Overview */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Market Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {stocks.filter(s => s.change >= 0).length}
              </div>
              <div className="text-sm text-gray-600">Gainers Today</div>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <div className="text-2xl font-bold text-red-600">
                {stocks.filter(s => s.change < 0).length}
              </div>
              <div className="text-sm text-gray-600">Losers Today</div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {stocks.length > 0 ? (
                  stocks.reduce((sum, s) => sum + s.changePercent, 0) / stocks.length
                ).toFixed(2) : '0.00'}%
              </div>
              <div className="text-sm text-gray-600">Average Change</div>
            </div>
          </div>
        </div>

        {/* Featured Stocks */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Featured Stocks</h2>
            <Link
              href="/stocks"
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              View All →
            </Link>
          </div>

          {loading ? (
            <div className="text-center py-8">
              <Loader size="lg" text="Loading market data..." />
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <div className="text-red-600 text-lg font-medium mb-4">{error}</div>
              <button 
                onClick={refetch}
                className="bg-primary-600 text-white px-6 py-2 rounded-md hover:bg-primary-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {stocks.map((stock) => (
                <StockCard key={stock.symbol} stock={stock} />
              ))}
            </div>
          )}
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">🎯 Quick Actions</h3>
            <div className="space-y-3">
              <Link
                href="/stocks"
                className="block w-full bg-primary-600 text-white px-4 py-3 rounded-md hover:bg-primary-700 transition-colors text-center font-medium"
              >
                📊 Manage Portfolio
              </Link>
              <Link
                href="/stock/AAPL"
                className="block w-full bg-blue-600 text-white px-4 py-3 rounded-md hover:bg-blue-700 transition-colors text-center font-medium"
              >
                🍎 View Apple Stock
              </Link>
              <Link
                href="/about"
                className="block w-full bg-gray-600 text-white px-4 py-3 rounded-md hover:bg-gray-700 transition-colors text-center font-medium"
              >
                ℹ️ About Dashboard
              </Link>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">📈 Market Status</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Market Status</span>
                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                  Live Data Active
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Last Update</span>
                <span className="font-medium">
                  {mounted ? formatTimeForDisplay() : '--:--:-- --'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Data Source</span>
                <span className="font-medium">Free APIs</span>
              </div>
            </div>
          </div>
        </div>

        {/* API Information */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-blue-800">
                Live Market Data Dashboard
              </p>
              <p className="text-sm text-blue-600">
                Real-time stock prices updated automatically. Visit the Stocks page for advanced portfolio management.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
