import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { StockData } from '../types';
import { formatCurrency, formatPercentage, formatVolume, formatTimeForDisplay } from '../lib/utils';

interface StockCardProps {
  stock: StockData;
}

export default function StockCard({ stock }: StockCardProps) {
  const [mounted, setMounted] = useState(false);
  const isPositive = stock.change >= 0;
  const hasError = (stock as any).error;
  
  // Ensure component is mounted before showing time to prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);
  
  return (
    <Link href={`/stock/${stock.symbol}`}>
      <div className={`bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer border ${
        hasError ? 'border-red-200 bg-red-50' : 'border-gray-200'
      }`}>
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-lg font-bold text-gray-900">{stock.symbol}</h3>
            <p className="text-sm text-gray-500">Stock Symbol</p>
          </div>
          {hasError ? (
            <div className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
              API Error
            </div>
          ) : (
            <div className={`px-2 py-1 rounded-full text-xs font-medium ${
              isPositive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              {formatPercentage(stock.changePercent)}
            </div>
          )}
        </div>

        {/* Error Message */}
        {hasError && (
          <div className="mb-4 p-3 bg-red-100 border border-red-200 rounded-lg">
            <p className="text-sm text-red-700 font-medium">⚠️ Data Unavailable</p>
            <p className="text-xs text-red-600 mt-1">
              Real-time API failed. This is why data differs from Google Finance.
            </p>
          </div>
        )}

        {/* Price */}
        <div className="mb-4">
          <div className="text-2xl font-bold text-gray-900">
            {hasError ? 'N/A' : formatCurrency(stock.price)}
          </div>
          <div className={`text-sm font-medium ${
            hasError ? 'text-gray-500' : isPositive ? 'text-green-600' : 'text-red-600'
          }`}>
            {hasError ? 'No data' : `${isPositive ? '+' : ''}${formatCurrency(stock.change)}`}
          </div>
        </div>

        {/* Stats */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Volume</span>
            <span className="font-medium text-gray-900">
              {hasError ? 'N/A' : formatVolume(stock.volume)}
            </span>
          </div>
          {stock.marketCap && !hasError && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Market Cap</span>
              <span className="font-medium text-gray-900">${formatVolume(stock.marketCap)}</span>
            </div>
          )}
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Last Updated</span>
            <span className="font-medium text-gray-900">
              {mounted ? formatTimeForDisplay(stock.lastUpdated) : '--:--:-- --'}
            </span>
          </div>
        </div>

        {/* View Details Button */}
        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className={`text-sm font-medium hover:text-primary-700 ${
            hasError ? 'text-red-600' : 'text-primary-600'
          }`}>
            {hasError ? 'View Details (Limited Data) →' : 'View Details →'}
          </div>
        </div>
      </div>
    </Link>
  );
}
