// Simple in-memory storage for Vercel (you'd want to use a database in production)
let stats = { totalClicks: 0, rickrolls: 0, successes: 0 };

export default function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Ensure all stats have default values
    const safeStats = {
      totalClicks: stats.totalClicks || 0,
      rickrolls: stats.rickrolls || 0,
      successes: stats.successes || 0
    };
    
    console.log('📊 Stats requested:', safeStats);
    res.json(safeStats);
  } catch (error) {
    console.error('❌ Error getting stats:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}