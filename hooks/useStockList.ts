import { useState, useEffect, useCallback, useRef } from 'react';
import { StockData } from '../types';

async function fetchStocks(symbols: string[]): Promise<StockData[]> {
  try {
    const symbolsQuery = symbols.join(',');
    const response = await fetch(`/api/stocks?symbols=${symbolsQuery}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    
    if (!result.success) {
      throw new Error(result.error || 'Failed to fetch stocks');
    }

    return result.data;
  } catch (error) {
    console.error('Error fetching stocks:', error);
    throw error;
  }
}

export function useStockList(symbols: string[]) {
  const [stocks, setStocks] = useState<StockData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const mountedRef = useRef(true);
  const lastSymbolsRef = useRef<string>('');

  const loadStocks = useCallback(async () => {
    // Prevent unnecessary calls
    const currentSymbolsKey = symbols.sort().join(',');
    if (currentSymbolsKey === lastSymbolsRef.current && stocks.length > 0) {
      return;
    }

    if (!symbols.length) {
      setStocks([]);
      setLoading(false);
      setError(null);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      lastSymbolsRef.current = currentSymbolsKey;

      console.log(`🔄 Loading stocks: ${symbols.join(', ')}`);

      const stocksData = await fetchStocks(symbols);
      
      if (mountedRef.current) {
        setStocks(stocksData);
        console.log(`✅ Loaded ${stocksData.length} stocks successfully`);
      }
    } catch (err) {
      if (mountedRef.current) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to load stocks';
        setError(errorMessage);
        console.error('❌ Stock loading failed:', errorMessage);
        
        // Provide fallback mock data
        const mockStocks: StockData[] = symbols.map(symbol => ({
          symbol,
          price: Math.random() * 200 + 100,
          change: (Math.random() - 0.5) * 10,
          changePercent: (Math.random() - 0.5) * 5,
          volume: Math.floor(Math.random() * 100000000),
          lastUpdated: new Date().toLocaleTimeString(),
        }));
        setStocks(mockStocks);
      }
    } finally {
      if (mountedRef.current) {
        setLoading(false);
      }
    }
  }, [symbols.join(',')]); // Stable dependency

  useEffect(() => {
    mountedRef.current = true;
    loadStocks();
    
    return () => {
      mountedRef.current = false;
    };
  }, [loadStocks]);

  // Auto-refresh every 60 seconds
  useEffect(() => {
    if (symbols.length === 0) return;
    
    const interval = setInterval(() => {
      if (mountedRef.current && !loading) {
        console.log('📊 Auto-refreshing stocks...');
        loadStocks();
      }
    }, 60000); // 60 seconds

    return () => clearInterval(interval);
  }, [loadStocks, loading]);

  const refetch = useCallback(() => {
    lastSymbolsRef.current = ''; // Force refetch
    loadStocks();
  }, [loadStocks]);

  return {
    stocks,
    loading,
    error,
    refetch,
  };
}
