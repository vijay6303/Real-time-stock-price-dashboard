import { NextApiRequest, NextApiResponse } from 'next';
import { POPULAR_STOCKS } from '../../lib/alpha-vantage';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  res.status(200).json({
    symbols: POPULAR_STOCKS,
    total: POPULAR_STOCKS.length,
  });
}
