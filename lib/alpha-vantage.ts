import axios from 'axios';
import { StockData, ChartDataPoint } from '../types';

const API_KEY = process.env.NEXT_PUBLIC_ALPHA_VANTAGE_API_KEY || 'demo';
const BASE_URL = 'https://www.alphavantage.co/query';
const USE_YAHOO = process.env.NEXT_PUBLIC_USE_YAHOO_FINANCE === 'true';

export const POPULAR_STOCKS = ['AAPL', 'GOOGL', 'MSFT', 'AMZN', 'TSLA', 'META', 'NVDA', 'NFLX'];

// Type definitions for API responses
interface AlphaVantageGlobalQuote {
  '01. symbol': string;
  '02. open': string;
  '03. high': string;
  '04. low': string;
  '05. price': string;
  '06. volume': string;
  '07. latest trading day': string;
  '08. previous close': string;
  '09. change': string;
  '10. change percent': string;
}

interface AlphaVantageQuoteResponse {
  'Global Quote': AlphaVantageGlobalQuote;
  'Note'?: string;
  'Information'?: string;
}

interface YahooFinanceResponse {
  chart: {
    result: Array<{
      meta: {
        symbol: string;
        regularMarketPrice: number;
        previousClose: number;
        regularMarketVolume: number;
        marketCap?: number;
      };
      timestamp: number[];
      indicators: {
        quote: Array<{
          close: number[];
          open: number[];
          volume: number[];
        }>;
      };
    }>;
  };
}

// Enhanced mock data generator (completely free)
const generateRealisticMockData = (symbol: string): StockData => {
  const baseData: Record<string, { price: number; volume: number; marketCap: number }> = {
    'AAPL': { price: 175, volume: 50000000, marketCap: 2800000000000 },
    'GOOGL': { price: 140, volume: 25000000, marketCap: 1750000000000 },
    'MSFT': { price: 380, volume: 35000000, marketCap: 2850000000000 },
    'AMZN': { price: 145, volume: 40000000, marketCap: 1500000000000 },
    'TSLA': { price: 248, volume: 70000000, marketCap: 790000000000 },
    'META': { price: 350, volume: 30000000, marketCap: 890000000000 },
    'NVDA': { price: 480, volume: 45000000, marketCap: 1200000000000 },
    'NFLX': { price: 420, volume: 15000000, marketCap: 180000000000 },
  };

  const base = baseData[symbol] || baseData['AAPL'];
  
  // Add realistic daily variation
  const variation = (Math.random() - 0.5) * 0.05; // ±5% variation
  const price = base.price * (1 + variation);
  const change = base.price * variation;
  const changePercent = variation * 100;

  return {
    symbol,
    price: Math.round(price * 100) / 100,
    change: Math.round(change * 100) / 100,
    changePercent: Math.round(changePercent * 100) / 100,
    volume: base.volume + Math.floor((Math.random() - 0.5) * base.volume * 0.3),
    marketCap: base.marketCap,
    lastUpdated: new Date().toISOString(), // Use ISO string for consistency
  };
};

// Yahoo Finance with timeout and retry logic
async function fetchYahooFinanceData(symbol: string): Promise<StockData> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 3000); // 3 second timeout
  
  try {
    console.log(`🆓 Yahoo Finance: Fetching ${symbol} (3s timeout)`);
    
    const response = await axios.get<YahooFinanceResponse>(
      `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}`, 
      {
        timeout: 3000,
        signal: controller.signal,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      }
    );

    clearTimeout(timeoutId);

    const result = response.data?.chart?.result?.[0];
    if (!result) {
      throw new Error('Invalid Yahoo Finance response structure');
    }
    
    const meta = result.meta;
    const currentPrice = meta.regularMarketPrice || meta.previousClose || 0;
    const previousClose = meta.previousClose || currentPrice;
    const change = currentPrice - previousClose;
    const changePercent = previousClose > 0 ? (change / previousClose) * 100 : 0;

    console.log(`✅ Yahoo Finance: ${symbol} = $${currentPrice}`);
    
    return {
      symbol: meta.symbol || symbol,
      price: Number(currentPrice.toFixed(2)),
      change: Number(change.toFixed(2)),
      changePercent: Number(changePercent.toFixed(2)),
      volume: meta.regularMarketVolume || 0,
      marketCap: meta.marketCap || undefined,
      lastUpdated: new Date().toISOString(), // Use ISO string for consistency
    };
  } catch (error) {
    clearTimeout(timeoutId);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.warn(`❌ Yahoo Finance failed for ${symbol}:`, errorMessage);
    throw error;
  }
}

// Alpha Vantage API with better error handling
async function fetchAlphaVantageData(symbol: string): Promise<StockData> {
  try {
    console.log(`📊 Alpha Vantage: Fetching ${symbol}`);
    
    const response = await axios.get<AlphaVantageQuoteResponse>(BASE_URL, {
      params: {
        function: 'GLOBAL_QUOTE',
        symbol: symbol,
        apikey: API_KEY,
      },
      timeout: 10000,
    });

    const data = response.data;
    
    // Check for API limit or error
    if (data['Note'] || data['Information']) {
      throw new Error('API limit reached or invalid response');
    }
    
    if (data['Global Quote'] && Object.keys(data['Global Quote']).length > 0) {
      const quote = data['Global Quote'];
      return {
        symbol: quote['01. symbol'],
        price: parseFloat(quote['05. price']),
        change: parseFloat(quote['09. change']),
        changePercent: parseFloat(quote['10. change percent'].replace('%', '')),
        volume: parseInt(quote['06. volume']),
        lastUpdated: new Date().toISOString(), // Use ISO string for consistency
      };
    }
    
    throw new Error('Invalid API response structure');
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.warn(`Alpha Vantage API failed for ${symbol}:`, errorMessage);
    throw error;
  }
}

// Simplified and faster stock quote fetch
export async function fetchStockQuote(symbol: string): Promise<StockData> {
  console.log(`📊 Quick fetch: ${symbol}`);
  
  try {
    // Try Yahoo Finance first (free and faster)
    if (USE_YAHOO) {
      return await fetchYahooFinanceData(symbol);
    }
    
    // Try Alpha Vantage as fallback
    return await fetchAlphaVantageData(symbol);
    
  } catch (error) {
    console.log(`⚡ Using mock data for ${symbol} (API failed)`);
    return generateRealisticMockData(symbol);
  }
}

// Fast batch fetching with concurrent requests
export async function fetchMultipleStocks(symbols: string[]): Promise<StockData[]> {
  console.log(`📊 Batch fetching ${symbols.length} stocks with 2s timeout per stock`);
  
  // Use Promise.allSettled to prevent one failure from blocking others
  const promises = symbols.map(async (symbol): Promise<StockData> => {
    try {
      // Add a per-stock timeout
      const timeoutPromise = new Promise<never>((_, reject) => 
        setTimeout(() => reject(new Error('Stock timeout')), 2000)
      );
      
      const stockPromise = fetchStockQuote(symbol);
      
      return await Promise.race([stockPromise, timeoutPromise]);
    } catch (error) {
      console.log(`⚡ Timeout/error for ${symbol}, using mock data`);
      return generateRealisticMockData(symbol);
    }
  });
  
  const results = await Promise.allSettled(promises);
  
  return results.map((result, index) => {
    if (result.status === 'fulfilled') {
      return result.value;
    } else {
      console.log(`📝 Using fallback mock data for ${symbols[index]}`);
      return generateRealisticMockData(symbols[index]);
    }
  });
}

export async function fetchTimeSeriesDaily(symbol: string): Promise<ChartDataPoint[]> {
  try {
    if (USE_YAHOO) {
      console.log(`📈 Fetching Yahoo Finance chart data for ${symbol}`);
      
      // Yahoo Finance historical data (FREE)
      const response = await axios.get<YahooFinanceResponse>(
        `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}`, 
        {
          params: {
            range: '1mo',
            interval: '1d',
          },
          timeout: 10000,
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
          }
        }
      );

      const result = response.data?.chart?.result?.[0];
      if (result && result.timestamp && result.indicators?.quote?.[0]) {
        const timestamps = result.timestamp;
        const quotes = result.indicators.quote[0];
        
        const chartData = timestamps.map((timestamp: number, index: number) => ({
          date: new Date(timestamp * 1000).toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric' 
          }),
          price: quotes.close[index] || quotes.open[index] || 0,
          volume: quotes.volume[index] || 0,
        })).filter(item => item.price > 0).slice(-30);
        
        console.log(`📊 Generated ${chartData.length} chart points for ${symbol}`);
        return chartData;
      }
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.warn(`Chart data API failed for ${symbol}:`, errorMessage);
  }

  // Generate realistic mock chart data with proper 30-day progression
  console.log(`📈 Generating comprehensive mock chart data for ${symbol}`);
  const data: ChartDataPoint[] = [];
  const baseStock = generateRealisticMockData(symbol);
  let currentPrice = baseStock.price;
  
  // Generate 30 days of realistic price data
  for (let i = 29; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    
    // Create realistic day-to-day price movements
    const dailyChange = (Math.random() - 0.5) * 0.03; // ±3% daily variation
    currentPrice = Math.max(currentPrice * (1 + dailyChange), 1); // Ensure price stays positive
    
    data.push({
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      price: Math.round(currentPrice * 100) / 100,
      volume: Math.floor(Math.random() * 50000000) + 10000000, // 10M to 60M volume
    });
  }
  
  console.log(`📊 Generated ${data.length} mock chart points for ${symbol}`);
  return data;
}

// Legacy function for compatibility (now deprecated)
export async function fetchStockData(symbol: string): Promise<StockData> {
  console.warn('fetchStockData is deprecated, use fetchStockQuote instead');
  return fetchStockQuote(symbol);
}
