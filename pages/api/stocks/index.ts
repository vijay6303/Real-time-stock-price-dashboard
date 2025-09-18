import { NextApiRequest, NextApiResponse } from 'next';
import { fetchMultipleStocks } from '../../../lib/alpha-vantage';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { symbols } = req.query;
    let stockSymbols: string[] = [];

    if (typeof symbols === 'string') {
      stockSymbols = symbols.split(',').map(s => s.trim().toUpperCase());
    } else if (Array.isArray(symbols)) {
      stockSymbols = symbols.map(s => String(s).trim().toUpperCase());
    } else {
      // Default symbols if none provided
      stockSymbols = ['AAPL', 'GOOGL', 'MSFT', 'AMZN', 'TSLA', 'META'];
    }

    console.log(`API: Fetching stocks for symbols: ${stockSymbols.join(', ')}`);

    const stocks = await fetchMultipleStocks(stockSymbols);

    res.status(200).json({
      success: true,
      data: stocks,
      count: stocks.length,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('API Error fetching stocks:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch stock data',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}

