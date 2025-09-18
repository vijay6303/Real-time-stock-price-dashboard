import { useState, useEffect, useCallback, useRef } from 'react';
import { StockData } from '../types';

async function fetchSingleStock(symbol: string): Promise<StockData> {
  try {
    const response = await fetch(`/api/stocks/${symbol}`, {
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
      throw new Error(result.error || 'Failed to fetch stock');
    }

    return result.data;
  } catch (error) {
    console.error(`Error fetching stock ${symbol}:`, error);
    throw error;
  }
}

interface UseStockDataReturn {
  data: StockData | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useStockData(symbol: string, autoRefresh = false): UseStockDataReturn {
  const [data, setData] = useState<StockData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const mountedRef = useRef(true);
  const lastSymbolRef = useRef<string>('');

  const loadStock = useCallback(async () => {
    if (!symbol || symbol === lastSymbolRef.current) {
      return;
    }

    try {
      setLoading(true);
      setError(null);
      lastSymbolRef.current = symbol;

      console.log(`📊 Loading stock: ${symbol}`);

      const stockData = await fetchSingleStock(symbol);
      
      if (mountedRef.current) {
        setData(stockData);
        console.log(`✅ Loaded ${symbol} successfully`);
      }
    } catch (err) {
      if (mountedRef.current) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to load stock';
        setError(errorMessage);
        console.error(`❌ Stock loading failed for ${symbol}:`, errorMessage);
        
        // Provide fallback mock data
        const mockStock: StockData = {
          symbol,
          price: Math.random() * 200 + 100,
          change: (Math.random() - 0.5) * 10,
          changePercent: (Math.random() - 0.5) * 5,
          volume: Math.floor(Math.random() * 100000000),
          lastUpdated: new Date().toLocaleTimeString(),
        };
        setData(mockStock);
      }
    } finally {
      if (mountedRef.current) {
        setLoading(false);
      }
    }
  }, [symbol]);

  useEffect(() => {
    mountedRef.current = true;
    
    if (symbol) {
      loadStock();
    }
    
    return () => {
      mountedRef.current = false;
    };
  }, [loadStock]);

  // Auto-refresh for individual stocks
  useEffect(() => {
    if (!autoRefresh || !symbol) return;
    
    const interval = setInterval(() => {
      if (mountedRef.current && !loading) {
        console.log(`📊 Auto-refreshing ${symbol}...`);
        lastSymbolRef.current = ''; // Force refetch
        loadStock();
      }
    }, 60000); // 60 seconds

    return () => clearInterval(interval);
  }, [autoRefresh, symbol, loadStock, loading]);

  const refetch = useCallback(() => {
    lastSymbolRef.current = ''; // Force refetch
    loadStock();
  }, [loadStock]);

  return {
    data,
    loading,
    error,
    refetch,
  };
}
