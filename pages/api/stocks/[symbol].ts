import { NextApiRequest, NextApiResponse } from 'next';
import { fetchStockQuote } from '../../../lib/alpha-vantage';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { symbol } = req.query;
    
    if (!symbol || typeof symbol !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'Symbol parameter is required',
      });
    }

    const stockSymbol = symbol.toUpperCase();
    console.log(`API: Fetching single stock for symbol: ${stockSymbol}`);

    const stock = await fetchStockQuote(stockSymbol);

    res.status(200).json({
      success: true,
      data: stock,
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error(`API Error fetching stock ${req.query.symbol}:`, error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch stock data',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
