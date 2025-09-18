import React, { useEffect, useState } from 'react';
import { GetServerSideProps } from 'next';
import Link from 'next/link';
import Layout from '../../components/Layout';
import StockChart from '../../components/StockChart';
import Loader from '../../components/Loader';
import { useStockData } from '../../hooks/useStockData';
import { fetchStockQuote, fetchTimeSeriesDaily } from '../../lib/alpha-vantage';
import { transformTimeSeriesData, formatCurrency, formatPercentage, formatVolume, formatTimeForDisplay } from '../../lib/utils';
import { StockData, ChartDataPoint } from '../../types';

interface StockDetailProps {
  symbol: string;
  initialData: StockData;
  chartData: ChartDataPoint[];
}

// This page uses Server-Side Rendering
export default function StockDetail({ symbol, initialData, chartData }: StockDetailProps) {
  const { data, loading, error } = useStockData(symbol, true);
  const [mounted, setMounted] = useState(false);
  
  // Data is passed from server via props
  const stockData = data || initialData; // initialData comes from SSR
  const isPositive = (stockData?.change || 0) >= 0;

  // Ensure component is mounted before showing time to prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Ensure all values have defaults to prevent hydration mismatches
  const safeStockData = {
    symbol: stockData?.symbol || symbol || '',
    price: stockData?.price || 0,
    change: stockData?.change || 0,
    changePercent: stockData?.changePercent || 0,
    volume: stockData?.volume || 0,
    marketCap: stockData?.marketCap || 0,
    lastUpdated: stockData?.lastUpdated || new Date().toISOString(),
  };

  const safeChartData = chartData?.length > 0 ? chartData : [{
    date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    price: safeStockData.price,
    volume: safeStockData.volume,
  }];

  if (loading && !stockData) {
    return (
      <Layout>
        <Loader size="lg" text="Loading stock details..." />
      </Layout>
    );
  }

  if (error && !stockData) {
    return (
      <Layout>
        <div className="text-center py-12">
          <div className="text-red-600 text-lg font-medium">{error}</div>
          <Link 
            href="/" 
            className="mt-4 inline-block bg-primary-600 text-white px-6 py-2 rounded-md hover:bg-primary-700 transition-colors"
          >
            Back to Dashboard
          </Link>
        </div>
      </Layout>
    );
  }

  // Calculate market cap with safe fallback
  const marketCap = safeStockData.marketCap || (safeStockData.price * safeStockData.volume * 0.001) || 0;

  return (
    <Layout title={`${symbol} - Real-Time Stock Dashboard`}>
      <div className="space-y-8">
        {/* Header Section */}
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            {/* Left Side - Stock Info */}
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <h1 className="text-4xl font-bold text-gray-900">
                  Symbol: {safeStockData.symbol}
                </h1>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  isPositive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {formatPercentage(safeStockData.changePercent)}
                </span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Current Price */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="text-sm font-medium text-gray-500">Current Price</div>
                  <div className="text-3xl font-bold text-gray-900">
                    {formatCurrency(safeStockData.price)}
                  </div>
                  <div className={`text-sm font-medium mt-1 ${
                    isPositive ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {isPositive ? '+' : ''}{formatCurrency(safeStockData.change)}
                  </div>
                </div>

                {/* Market Cap */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="text-sm font-medium text-gray-500">Market Cap</div>
                  <div className="text-2xl font-bold text-gray-900">
                    ${formatVolume(marketCap)}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    {formatVolume(safeStockData.volume)} volume
                  </div>
                </div>

                {/* Last Updated */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="text-sm font-medium text-gray-500">Last Updated</div>
                  <div className="text-lg font-bold text-gray-900">
                    {mounted ? formatTimeForDisplay(safeStockData.lastUpdated) : '--:--:-- --'}
                  </div>
                  <div className="text-sm text-green-600 mt-1">
                    ✅ Live Data
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Actions */}
            <div className="mt-6 lg:mt-0 lg:ml-8">
              <div className="flex flex-col space-y-3">
                <Link 
                  href="/" 
                  className="bg-primary-600 text-white px-6 py-3 rounded-md hover:bg-primary-700 transition-colors text-center font-medium"
                >
                  ← Back to Dashboard
                </Link>
                <button 
                  onClick={() => window.location.reload()}
                  className="bg-gray-200 text-gray-700 px-6 py-3 rounded-md hover:bg-gray-300 transition-colors text-center font-medium"
                >
                  🔄 Refresh Data
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Chart Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              📈 Historical Stock Price
            </h2>
            <div className="text-sm text-gray-500">
              30 Day Price Movement
            </div>
          </div>
          <StockChart data={safeChartData} symbol={safeStockData.symbol} />
        </div>

        {/* Additional Stock Information */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Stock Metrics */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Stock Metrics</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-600">Symbol</span>
                <span className="font-medium">{safeStockData.symbol}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-600">Current Price</span>
                <span className="font-medium">{formatCurrency(safeStockData.price)}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-600">Daily Change</span>
                <span className={`font-medium ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                  {formatCurrency(safeStockData.change)} ({formatPercentage(safeStockData.changePercent)})
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-600">Volume</span>
                <span className="font-medium">{formatVolume(safeStockData.volume)}</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-gray-600">Market Cap</span>
                <span className="font-medium">${formatVolume(marketCap)}</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-gray-600">Last Updated</span>
                <span className="font-medium">
                  {mounted ? formatTimeForDisplay(safeStockData.lastUpdated) : '--:--:-- --'}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <Link 
                href="/"
                className="w-full bg-primary-600 text-white px-4 py-3 rounded-md hover:bg-primary-700 transition-colors text-center block font-medium"
              >
                📊 View All Stocks
              </Link>
              <button 
                onClick={() => window.location.reload()}
                className="w-full bg-green-600 text-white px-4 py-3 rounded-md hover:bg-green-700 transition-colors text-center font-medium"
              >
                🔄 Refresh Live Data
              </button>
              <button 
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({
                      title: `${safeStockData.symbol} Stock Info`,
                      text: `Check out ${safeStockData.symbol} trading at ${formatCurrency(safeStockData.price)}`,
                      url: window.location.href,
                    });
                  } else {
                    navigator.clipboard.writeText(window.location.href);
                    alert('Link copied to clipboard!');
                  }
                }}
                className="w-full bg-blue-600 text-white px-4 py-3 rounded-md hover:bg-blue-700 transition-colors text-center font-medium"
              >
                📤 Share Stock
              </button>
              <Link 
                href="/about"
                className="w-full bg-gray-600 text-white px-4 py-3 rounded-md hover:bg-gray-700 transition-colors text-center block font-medium"
              >
                ℹ️ About Dashboard
              </Link>
            </div>
          </div>
        </div>

        {/* Live Update Indicator */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-green-800">
                Live Updates Enabled
              </p>
              <p className="text-sm text-green-600">
                This page automatically refreshes every 60 seconds to show the latest stock data.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

// SSR implementation using getServerSideProps
export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const symbol = params?.symbol as string;

  if (!symbol) {
    return { notFound: true };
  }

  try {
    // Data fetching happens on the server for each request
    const [stockData, timeSeriesData] = await Promise.all([
      fetchStockQuote(symbol.toUpperCase()),
      fetchTimeSeriesDaily(symbol.toUpperCase()),
    ]);

    const chartData = transformTimeSeriesData(timeSeriesData);

    // Server pre-renders the page with this data
    return {
      props: {
        symbol: symbol.toUpperCase(),
        initialData: stockData,
        chartData,
      },
    };
  } catch (error) {
    // Fallback data on server error
    return {
      props: {
        symbol: symbol.toUpperCase(),
        initialData: {
          symbol: symbol.toUpperCase(),
          price: 0,
          change: 0,
          changePercent: 0,
          volume: 0,
          marketCap: 0,
          lastUpdated: new Date().toISOString(),
        },
        chartData: [{
          date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          price: 0,
          volume: 0,
        }],
      },
    };
  }
};
          