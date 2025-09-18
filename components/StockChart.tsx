import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { ChartDataPoint } from '../types';
import { formatCurrency } from '../lib/utils';

interface StockChartProps {
  data: ChartDataPoint[];
  symbol: string;
}

export default function StockChart({ data, symbol }: StockChartProps) {
  // Debug logging
  console.log(`📊 Chart rendering for ${symbol} with ${data?.length || 0} data points:`, data);
  
  // Ensure we have safe data to prevent hydration errors
  const safeData = data && data.length > 0 ? data : [];
  
  // If no data, generate sample data for demonstration
  if (safeData.length === 0) {
    console.log(`⚠️ No chart data for ${symbol}, generating sample data`);
    const sampleData: ChartDataPoint[] = [];
    let basePrice = 150; // Default price
    
    for (let i = 29; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      
      const variation = (Math.random() - 0.5) * 0.05; // ±5% variation
      basePrice = Math.max(basePrice * (1 + variation), 1);
      
      sampleData.push({
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        price: Math.round(basePrice * 100) / 100,
        volume: Math.floor(Math.random() * 50000000) + 10000000,
      });
    }
    
    // Use sample data for rendering
    const chartData = sampleData;
    const hasValidPrices = true;
    const prices = chartData.map(d => d.price);
    const isPositiveTrend = chartData.length > 1 && 
      chartData[chartData.length - 1].price > chartData[0].price;
    
    // Calculate stats
    const highest = Math.max(...prices);
    const lowest = Math.min(...prices);
    const average = prices.reduce((sum, p) => sum + p, 0) / prices.length;
    const periodChange = ((chartData[chartData.length - 1].price - chartData[0].price) / chartData[0].price) * 100;
    const trendColor = isPositiveTrend ? '#10b981' : '#ef4444';
    
    return (
      <div className="space-y-6">
        {/* Enhanced Chart Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">
              {symbol || 'Stock'} Price Chart
            </h3>
            <p className="text-sm text-gray-500">
              30-day historical price movement • Sample data
            </p>
          </div>
          <div className="mt-3 sm:mt-0 flex flex-col sm:flex-row gap-3">
            <div className={`px-4 py-2 rounded-full text-sm font-semibold ${
              isPositiveTrend 
                ? 'bg-green-100 text-green-800 border border-green-200' 
                : 'bg-red-100 text-red-800 border border-red-200'
            }`}>
              {isPositiveTrend ? '📈 +' : '📉 '}{Math.abs(periodChange).toFixed(2)}%
            </div>
            <div className="px-4 py-2 rounded-full text-sm font-medium bg-gray-100 text-gray-700 border border-gray-200">
              30D Period
            </div>
          </div>
        </div>

        {/* Enhanced Chart Container */}
        <div className="relative">
          <div className="h-[500px] w-full bg-gradient-to-b from-gray-50 to-white rounded-xl border border-gray-200 shadow-sm p-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart 
                data={chartData} 
                margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
              >
                <defs>
                  <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={trendColor} stopOpacity={0.4} />
                    <stop offset="25%" stopColor={trendColor} stopOpacity={0.3} />
                    <stop offset="50%" stopColor={trendColor} stopOpacity={0.2} />
                    <stop offset="75%" stopColor={trendColor} stopOpacity={0.1} />
                    <stop offset="100%" stopColor={trendColor} stopOpacity={0.05} />
                  </linearGradient>
                  
                  <filter id="dropshadow">
                    <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.1"/>
                  </filter>
                </defs>

                <CartesianGrid 
                  strokeDasharray="2 4" 
                  stroke="#e5e7eb" 
                  strokeOpacity={0.6}
                  horizontal={true}
                  vertical={false}
                />

                <XAxis 
                  dataKey="date" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ 
                    fontSize: 12, 
                    fill: '#6b7280',
                    fontWeight: 500
                  }}
                  dy={10}
                />

                <YAxis 
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(value: number) => `$${value.toFixed(0)}`}
                  tick={{ 
                    fontSize: 12, 
                    fill: '#6b7280',
                    fontWeight: 500
                  }}
                  dx={-10}
                  domain={['dataMin - 5', 'dataMax + 5']}
                />

                <Tooltip 
                  formatter={(value: number) => [formatCurrency(value), 'Price']}
                  labelFormatter={(date) => `Date: ${date}`}
                  labelStyle={{ 
                    color: '#374151', 
                    fontWeight: '600',
                    fontSize: '14px'
                  }}
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    border: `2px solid ${trendColor}`,
                    borderRadius: '12px',
                    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15)',
                    backdropFilter: 'blur(10px)',
                    fontSize: '13px',
                    fontWeight: '500'
                  }}
                  cursor={{
                    stroke: trendColor,
                    strokeWidth: 2,
                    strokeDasharray: '5 5'
                  }}
                />

                <Area
                  type="monotone"
                  dataKey="price"
                  stroke={trendColor}
                  strokeWidth={3}
                  fill="url(#colorPrice)"
                  filter="url(#dropshadow)"
                  dot={false}
                  activeDot={{ 
                    r: 6, 
                    fill: trendColor,
                    stroke: '#ffffff',
                    strokeWidth: 3,
                    filter: "url(#dropshadow)"
                  }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Price overlay badge */}
          <div className="absolute top-6 left-6 bg-white/90 backdrop-blur-sm rounded-lg px-4 py-2 shadow-lg border border-gray-200">
            <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">Current</div>
            <div className="text-xl font-bold text-gray-900">
              {formatCurrency(chartData[chartData.length - 1]?.price || 0)}
            </div>
          </div>
        </div>

        {/* Enhanced Chart Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
            <div className="text-xs font-semibold text-blue-600 uppercase tracking-wide mb-1">Highest</div>
            <div className="text-lg font-bold text-blue-900">{formatCurrency(highest)}</div>
            <div className="text-xs text-blue-600 mt-1">30-day peak</div>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 border border-purple-200">
            <div className="text-xs font-semibold text-purple-600 uppercase tracking-wide mb-1">Lowest</div>
            <div className="text-lg font-bold text-purple-900">{formatCurrency(lowest)}</div>
            <div className="text-xs text-purple-600 mt-1">30-day low</div>
          </div>

          <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl p-4 border border-amber-200">
            <div className="text-xs font-semibold text-amber-600 uppercase tracking-wide mb-1">Average</div>
            <div className="text-lg font-bold text-amber-900">{formatCurrency(average)}</div>
            <div className="text-xs text-amber-600 mt-1">Mean price</div>
          </div>

          <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl p-4 border border-emerald-200">
            <div className="text-xs font-semibold text-emerald-600 uppercase tracking-wide mb-1">Data Points</div>
            <div className="text-lg font-bold text-emerald-900">{chartData.length}</div>
            <div className="text-xs text-emerald-600 mt-1">{chartData.length === 1 ? 'day' : 'days'} of data</div>
          </div>
        </div>

        {/* Chart Controls */}
        <div className="flex flex-wrap items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
          <div className="flex items-center space-x-4">
            <div className="text-sm font-medium text-gray-700">Time Range:</div>
            <div className="flex space-x-2">
              {['1D', '5D', '1M', '3M', '1Y'].map((period) => (
                <button
                  key={period}
                  className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                    period === '1M' 
                      ? 'bg-primary-600 text-white' 
                      : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                  }`}
                >
                  {period}
                </button>
              ))}
            </div>
          </div>
          
          <div className="flex items-center space-x-2 text-xs text-gray-500">
            <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
            <span>Sample data • 30 days generated</span>
          </div>
        </div>
      </div>
    );
  }

  // Calculate price trend safely
  const isPositiveTrend = safeData.length > 1 && 
    (safeData[safeData.length - 1]?.price || 0) > (safeData[0]?.price || 0);

  // Calculate stats safely
  const prices = safeData.map(d => d?.price || 0).filter(p => p > 0);
  const hasValidPrices = prices.length > 0;
  
  const highest = hasValidPrices ? Math.max(...prices) : 0;
  const lowest = hasValidPrices ? Math.min(...prices) : 0;
  const average = hasValidPrices ? prices.reduce((sum, p) => sum + p, 0) / prices.length : 0;

  // Calculate percentage change for the period
  const periodChange = hasValidPrices && safeData.length > 1 ? 
    ((safeData[safeData.length - 1].price - safeData[0].price) / safeData[0].price) * 100 : 0;

  // Enhanced color scheme based on trend
  const trendColor = isPositiveTrend ? '#10b981' : '#ef4444';
  const lightTrendColor = isPositiveTrend ? '#d1fae5' : '#fee2e2';

  return (
    <div className="space-y-6">
      {/* Enhanced Chart Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">
            {symbol || 'Stock'} Price Chart
          </h3>
          <p className="text-sm text-gray-500">
            30-day historical price movement • Real-time data
          </p>
        </div>
        <div className="mt-3 sm:mt-0 flex flex-col sm:flex-row gap-3">
          <div className={`px-4 py-2 rounded-full text-sm font-semibold ${
            isPositiveTrend 
              ? 'bg-green-100 text-green-800 border border-green-200' 
              : 'bg-red-100 text-red-800 border border-red-200'
          }`}>
            {isPositiveTrend ? '📈 +' : '📉 '}{Math.abs(periodChange).toFixed(2)}%
          </div>
          <div className="px-4 py-2 rounded-full text-sm font-medium bg-gray-100 text-gray-700 border border-gray-200">
            30D Period
          </div>
        </div>
      </div>

      {/* Enhanced Chart Container */}
      <div className="relative">
        <div className="h-[500px] w-full bg-gradient-to-b from-gray-50 to-white rounded-xl border border-gray-200 shadow-sm p-4">
          {hasValidPrices ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart 
                data={safeData} 
                margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
              >
                <defs>
                  {/* Enhanced gradient definitions */}
                  <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={trendColor} stopOpacity={0.4} />
                    <stop offset="25%" stopColor={trendColor} stopOpacity={0.3} />
                    <stop offset="50%" stopColor={trendColor} stopOpacity={0.2} />
                    <stop offset="75%" stopColor={trendColor} stopOpacity={0.1} />
                    <stop offset="100%" stopColor={trendColor} stopOpacity={0.05} />
                  </linearGradient>
                  
                  {/* Shadow gradient for depth */}
                  <filter id="dropshadow">
                    <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.1"/>
                  </filter>
                </defs>

                {/* Enhanced grid */}
                <CartesianGrid 
                  strokeDasharray="2 4" 
                  stroke="#e5e7eb" 
                  strokeOpacity={0.6}
                  horizontal={true}
                  vertical={false}
                />

                {/* Enhanced X-Axis */}
                <XAxis 
                  dataKey="date" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ 
                    fontSize: 12, 
                    fill: '#6b7280',
                    fontWeight: 500
                  }}
                  dy={10}
                />

                {/* Enhanced Y-Axis */}
                <YAxis 
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(value: number) => `$${value.toFixed(0)}`}
                  tick={{ 
                    fontSize: 12, 
                    fill: '#6b7280',
                    fontWeight: 500
                  }}
                  dx={-10}
                  domain={['dataMin - 5', 'dataMax + 5']}
                />

                {/* Enhanced Tooltip */}
                <Tooltip 
                  formatter={(value: number) => [
                    formatCurrency(value), 
                    'Price'
                  ]}
                  labelFormatter={(date) => `Date: ${date}`}
                  labelStyle={{ 
                    color: '#374151', 
                    fontWeight: '600',
                    fontSize: '14px'
                  }}
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    border: `2px solid ${trendColor}`,
                    borderRadius: '12px',
                    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15)',
                    backdropFilter: 'blur(10px)',
                    fontSize: '13px',
                    fontWeight: '500'
                  }}
                  cursor={{
                    stroke: trendColor,
                    strokeWidth: 2,
                    strokeDasharray: '5 5'
                  }}
                />

                {/* Enhanced Area */}
                <Area
                  type="monotone"
                  dataKey="price"
                  stroke={trendColor}
                  strokeWidth={3}
                  fill="url(#colorPrice)"
                  filter="url(#dropshadow)"
                  dot={false}
                  activeDot={{ 
                    r: 6, 
                    fill: trendColor,
                    stroke: '#ffffff',
                    strokeWidth: 3,
                    filter: "url(#dropshadow)"
                  }}
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center text-gray-500">
                <div className="text-6xl mb-4">📊</div>
                <div className="text-xl font-semibold text-gray-700 mb-2">No Chart Data Available</div>
                <div className="text-sm text-gray-500">Chart will appear when stock data is loaded</div>
              </div>
            </div>
          )}
        </div>

        {/* Price overlay badge */}
        {hasValidPrices && (
          <div className="absolute top-6 left-6 bg-white/90 backdrop-blur-sm rounded-lg px-4 py-2 shadow-lg border border-gray-200">
            <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">Current</div>
            <div className="text-xl font-bold text-gray-900">
              {formatCurrency(safeData[safeData.length - 1]?.price || 0)}
            </div>
          </div>
        )}
      </div>

      {/* Enhanced Chart Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
          <div className="text-xs font-semibold text-blue-600 uppercase tracking-wide mb-1">Highest</div>
          <div className="text-lg font-bold text-blue-900">{formatCurrency(highest)}</div>
          <div className="text-xs text-blue-600 mt-1">30-day peak</div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 border border-purple-200">
          <div className="text-xs font-semibold text-purple-600 uppercase tracking-wide mb-1">Lowest</div>
          <div className="text-lg font-bold text-purple-900">{formatCurrency(lowest)}</div>
          <div className="text-xs text-purple-600 mt-1">30-day low</div>
        </div>

        <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl p-4 border border-amber-200">
          <div className="text-xs font-semibold text-amber-600 uppercase tracking-wide mb-1">Average</div>
          <div className="text-lg font-bold text-amber-900">{formatCurrency(average)}</div>
          <div className="text-xs text-amber-600 mt-1">Mean price</div>
        </div>

        <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl p-4 border border-emerald-200">
          <div className="text-xs font-semibold text-emerald-600 uppercase tracking-wide mb-1">Data Points</div>
          <div className="text-lg font-bold text-emerald-900">{safeData.length}</div>
          <div className="text-xs text-emerald-600 mt-1">{safeData.length === 1 ? 'day' : 'days'} of data</div>
        </div>
      </div>

      {/* Chart Controls */}
      <div className="flex flex-wrap items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
        <div className="flex items-center space-x-4">
          <div className="text-sm font-medium text-gray-700">Time Range:</div>
          <div className="flex space-x-2">
            {['1D', '5D', '1M', '3M', '1Y'].map((period) => (
              <button
                key={period}
                className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                  period === '1M' 
                    ? 'bg-primary-600 text-white' 
                    : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                }`}
              >
                {period}
              </button>
            ))}
          </div>
        </div>
        
        <div className="flex items-center space-x-2 text-xs text-gray-500">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span>Live data • Updates every 60s</span>
        </div>
      </div>
    </div>
  );
}
