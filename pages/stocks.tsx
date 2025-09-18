import React, { useState } from 'react';
import Link from 'next/link';
import Layout from '../components/Layout';
import StockCard from '../components/StockCard';
import Loader from '../components/Loader';
import { useStockList } from '../hooks/useStockList';
import { POPULAR_STOCKS } from '../lib/alpha-vantage';

const ALL_STOCKS = [
  ...POPULAR_STOCKS,
  'BABA', 'V', 'JPM', 'JNJ', 'WMT', 'PG', 'UNH', 'HD', 'BAC', 'MA',
  'DIS', 'ADBE', 'CRM', 'KO', 'PEP', 'TMO', 'ABT', 'COST', 'AVGO'
];

// This page uses pure Client-Side Rendering
export default function StocksPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStocks, setSelectedStocks] = useState<string[]>(POPULAR_STOCKS.slice(0, 6));
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'symbol' | 'price' | 'change'>('symbol');

  // All data fetching happens on the client
  const { stocks, loading, error, refetch } = useStockList(selectedStocks);
  
  // Filter and sort stocks
  const filteredStocks = stocks.filter(stock =>
    stock.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedStocks = [...filteredStocks].sort((a, b) => {
    switch (sortBy) {
      case 'price':
        return b.price - a.price;
      case 'change':
        return b.changePercent - a.changePercent;
      default:
        return a.symbol.localeCompare(b.symbol);
    }
  });

  const handleStockToggle = (symbol: string) => {
    setSelectedStocks(prev => {
      const newSelection = prev.includes(symbol)
        ? prev.filter(s => s !== symbol)
        : [...prev, symbol];
      
      console.log(`Portfolio updated: ${newSelection.join(', ')}`);
      return newSelection;
    });
  };

  if (loading && stocks.length === 0) {
    return (
      <Layout>
        <div className="text-center py-12">
          <Loader size="lg" text="Loading stocks portfolio..." />
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Stocks Portfolio - Real-Time Stock Dashboard">
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            📈 Stocks Portfolio
          </h1>
          <p className="text-xl text-gray-600 mb-6">
            Manage and track your stock portfolio with advanced tools
          </p>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search Stocks
              </label>
              <input
                type="text"
                placeholder="Search by symbol..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            {/* Sort */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sort By
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="symbol">Symbol A-Z</option>
                <option value="price">Price (High to Low)</option>
                <option value="change">Change % (High to Low)</option>
              </select>
            </div>

            {/* View Mode */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                View Mode
              </label>
              <div className="flex rounded-md overflow-hidden border border-gray-300">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`px-4 py-2 text-sm font-medium ${
                    viewMode === 'grid'
                      ? 'bg-primary-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Grid
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`px-4 py-2 text-sm font-medium ${
                    viewMode === 'list'
                      ? 'bg-primary-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  List
                </button>
              </div>
            </div>

            {/* Actions */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Actions
              </label>
              <button
                onClick={refetch}
                disabled={loading}
                className="w-full bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 disabled:opacity-50 transition-colors font-medium"
              >
                {loading ? '⏳' : '🔄'} Refresh All
              </button>
            </div>
          </div>
        </div>

        {/* Stock Selection */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Add Stocks to Portfolio</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {ALL_STOCKS.map(symbol => (
              <label key={symbol} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedStocks.includes(symbol)}
                  onChange={() => handleStockToggle(symbol)}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="text-sm font-medium text-gray-700">{symbol}</span>
              </label>
            ))}
          </div>
          <div className="mt-4 text-sm text-gray-600">
            Selected: {selectedStocks.length} stocks
          </div>
        </div>

        {/* Portfolio Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="text-2xl font-bold text-gray-900">{stocks.length}</div>
            <div className="text-sm text-gray-500">Total Stocks</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="text-2xl font-bold text-green-600">
              {stocks.filter(s => s.change >= 0).length}
            </div>
            <div className="text-sm text-gray-500">Gainers</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="text-2xl font-bold text-red-600">
              {stocks.filter(s => s.change < 0).length}
            </div>
            <div className="text-sm text-gray-500">Losers</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="text-2xl font-bold text-blue-600">
              {stocks.length > 0 ? (
                stocks.reduce((sum, s) => sum + s.changePercent, 0) / stocks.length
              ).toFixed(2) : '0.00'}%
            </div>
            <div className="text-sm text-gray-500">Avg Change</div>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="text-red-800 font-medium">⚠️ {error}</div>
            <div className="text-red-600 text-sm mt-1">Showing demo data as fallback</div>
            <button
              onClick={refetch}
              className="mt-2 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Stocks Display */}
        {sortedStocks.length > 0 ? (
          <>
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {sortedStocks.map((stock) => (
                  <StockCard key={stock.symbol} stock={stock} />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">Portfolio List View</h3>
                </div>
                <div className="divide-y divide-gray-200">
                  {sortedStocks.map((stock) => (
                    <Link key={stock.symbol} href={`/stock/${stock.symbol}`}>
                      <div className="px-6 py-4 hover:bg-gray-50 cursor-pointer">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="text-lg font-bold text-gray-900">
                              {stock.symbol}
                            </div>
                            <div className="text-2xl font-bold text-gray-900">
                              ${stock.price.toFixed(2)}
                            </div>
                          </div>
                          <div className={`text-right ${
                            stock.change >= 0 ? 'text-green-600' : 'text-red-600'
                          }`}>
                            <div className="text-lg font-medium">
                              {stock.change >= 0 ? '+' : ''}${stock.change.toFixed(2)}
                            </div>
                            <div className="text-sm">
                              ({stock.change >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%)
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📊</div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">No stocks selected</h3>
            <p className="text-gray-600">Select some stocks above to build your portfolio</p>
          </div>
        )}

        {/* Back to Home */}
        <div className="text-center">
          <Link
            href="/"
            className="inline-block bg-primary-600 text-white px-6 py-3 rounded-md hover:bg-primary-700 transition-colors font-medium"
          >
            ← Back to Dashboard
          </Link>
        </div>
      </div>
    </Layout>
  );
}
