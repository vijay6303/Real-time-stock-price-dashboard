import { ChartDataPoint, TimeSeriesData } from '../types';

export function formatCurrency(value: number): string {
  // Handle null, undefined, NaN, and Infinity values
  if (typeof value !== 'number' || !isFinite(value)) {
    return '$0.00';
  }
  
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatPercentage(value: number): string {
  // Handle null, undefined, NaN, and Infinity values
  if (typeof value !== 'number' || !isFinite(value)) {
    return '+0.00%';
  }
  
  const sign = value >= 0 ? '+' : '';
  return `${sign}${value.toFixed(2)}%`;
}

export function formatVolume(value: number): string {
  // Handle null, undefined, NaN, and Infinity values
  if (typeof value !== 'number' || !isFinite(value) || value <= 0) {
    return '0';
  }
  
  if (value >= 1_000_000_000) {
    return `${(value / 1_000_000_000).toFixed(2)}B`;
  }
  if (value >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(2)}M`;
  }
  if (value >= 1_000) {
    return `${(value / 1_000).toFixed(2)}K`;
  }
  return value.toString();
}

export function formatTime(date: Date): string {
  if (!date || !(date instanceof Date) || isNaN(date.getTime())) {
    return new Date().toLocaleTimeString('en-US', {
      hour12: true,
      hour: 'numeric',
      minute: '2-digit',
      second: '2-digit'
    });
  }
  
  return date.toLocaleTimeString('en-US', {
    hour12: true,
    hour: 'numeric',
    minute: '2-digit',
    second: '2-digit'
  });
}

// Safe time formatter that prevents hydration mismatches
export function formatTimeForDisplay(timestamp?: string | Date): string {
  // For SSR safety, return a placeholder during server render
  if (typeof window === 'undefined') {
    return '--:--:-- --';
  }
  
  try {
    const date = timestamp ? new Date(timestamp) : new Date();
    return date.toLocaleTimeString('en-US', {
      hour12: true,
      hour: 'numeric',
      minute: '2-digit',
      second: '2-digit'
    });
  } catch (error) {
    return '--:--:-- --';
  }
}

export function formatDate(date: string | Date): string {
  let dateObj: Date;
  
  if (typeof date === 'string') {
    dateObj = new Date(date);
  } else if (date instanceof Date) {
    dateObj = date;
  } else {
    dateObj = new Date();
  }
  
  // Check if date is valid
  if (isNaN(dateObj.getTime())) {
    dateObj = new Date();
  }
  
  return dateObj.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric' 
  });
}

export function transformTimeSeriesData(data: TimeSeriesData | ChartDataPoint[]): ChartDataPoint[] {
  // If it's already ChartDataPoint array, return it
  if (Array.isArray(data)) {
    return data.length > 0 ? data : [];
  }
  
  if (!data || typeof data !== 'object') {
    return [];
  }
  
  try {
    return Object.entries(data)
      .map(([date, values]) => {
        // Safely parse values with fallbacks
        const price = parseFloat(values?.['4. close'] || '0') || 0;
        const volume = parseInt(values?.['5. volume'] || '0') || 0;
        
        return {
          date: formatDate(date),
          price,
          volume,
        };
      })
      .filter(item => item.price > 0) // Filter out invalid entries
      .reverse()
      .slice(-30); // Last 30 days
  } catch (error) {
    console.error('Error transforming time series data:', error);
    return [];
  }
}

export function calculateChange(current: number, previous: number): { change: number; changePercent: number } {
  // Handle invalid inputs
  if (typeof current !== 'number' || typeof previous !== 'number' || 
      !isFinite(current) || !isFinite(previous) || previous === 0) {
    return { change: 0, changePercent: 0 };
  }
  
  const change = current - previous;
  const changePercent = (change / previous) * 100;
  
  return {
    change: Math.round(change * 100) / 100,
    changePercent: Math.round(changePercent * 100) / 100,
  };
}

export function cn(...classes: (string | undefined | null | boolean)[]): string {
  return classes.filter(Boolean).join(' ');
}
