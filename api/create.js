const { nanoid } = require('nanoid');

// Simple in-memory storage for Vercel (you'd want to use a database in production)
let links = {};
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

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { url } = req.body;
    console.log('🔗 Creating FlipLink for URL:', url);
    
    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }
    
    // Validate URL
    try {
      new URL(url);
    } catch (e) {
      return res.status(400).json({ error: 'Invalid URL format' });
    }
    
    const shortCode = nanoid(6);
    
    const linkData = {
      targetUrl: url,
      createdAt: new Date().toISOString(),
      clicks: 0,
      rickrolls: 0,
      successes: 0
    };
    
    links[shortCode] = linkData;
    
    console.log('💾 Saved link:', shortCode, '→', url);
    
    const flipUrl = `${req.headers['x-forwarded-proto'] || 'https'}://${req.headers.host}/flip/${shortCode}`;
    
    res.json({
      success: true,
      shortCode,
      flipUrl,
      targetUrl: url
    });
    
  } catch (error) {
    console.error('❌ Error creating FlipLink:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}