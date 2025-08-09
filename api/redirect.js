// Simple in-memory storage for Vercel (you'd want to use a database in production)
let links = {};
let stats = { totalClicks: 0, rickrolls: 0, successes: 0 };

export default function handler(req, res) {
  try {
    const { code: shortCode } = req.query;
    console.log(`🎲 FlipLink clicked: ${shortCode}`);
    
    const linkData = links[shortCode];
    
    if (!linkData) {
      console.log(`❌ Link not found: ${shortCode}`);
      return res.status(404).send(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>FlipLink - Not Found</title>
          <script src="https://cdn.tailwindcss.com"></script>
          <style>
            .chaos-bg {
              background: linear-gradient(45deg, #ff6b6b, #4ecdc4, #45b7d1, #96ceb4, #ffeaa7, #dda0dd);
              background-size: 400% 400%;
              animation: chaosGradient 3s ease infinite;
            }
            @keyframes chaosGradient {
              0% { background-position: 0% 50%; }
              50% { background-position: 100% 50%; }
              100% { background-position: 0% 50%; }
            }
          </style>
        </head>
        <body class="chaos-bg min-h-screen flex items-center justify-center">
          <div class="text-center text-white">
            <h1 class="text-6xl mb-4">🎲</h1>
            <h2 class="text-3xl font-bold mb-4">FlipLink Not Found</h2>
            <p class="text-xl mb-8">This FlipLink doesn't exist or has expired.</p>
            <p class="text-sm mb-4">Code: ${shortCode}</p>
            <a href="/" class="bg-white text-purple-600 px-6 py-3 rounded-lg font-bold hover:bg-gray-100 transition-colors">
              Create a New FlipLink
            </a>
          </div>
        </body>
        </html>
      `);
    }
    
    // THE MOMENT OF TRUTH! 50/50 chance
    const randomValue = Math.random();
    const isRickroll = randomValue < 0.5;
    
    console.log(`🎯 Random value: ${randomValue}, Is Rickroll: ${isRickroll}`);
    console.log(`📊 Target URL: ${linkData.targetUrl}`);
    
    // Update stats
    stats.totalClicks = (stats.totalClicks || 0) + 1;
    linkData.clicks = (linkData.clicks || 0) + 1;
    
    if (isRickroll) {
      console.log('🎵 RICKROLL TIME!');
      stats.rickrolls = (stats.rickrolls || 0) + 1;
      linkData.rickrolls = (linkData.rickrolls || 0) + 1;
      
      console.log('📊 Updated stats:', stats);
      
      // Redirect to Rick Roll page
      res.redirect(302, '/rickroll');
    } else {
      console.log('✅ Lucky escape! Redirecting to actual URL');
      stats.successes = (stats.successes || 0) + 1;
      linkData.successes = (linkData.successes || 0) + 1;
      
      console.log('📊 Updated stats:', stats);
      
      // Show lucky message then redirect
      res.send(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>You're Lucky!</title>
          <script src="https://cdn.tailwindcss.com"></script>
          <style>
            .lucky-bg {
              background: linear-gradient(45deg, #10b981, #059669, #047857, #065f46);
              background-size: 400% 400%;
              animation: luckyGradient 2s ease infinite;
            }
            @keyframes luckyGradient {
              0% { background-position: 0% 50%; }
              50% { background-position: 100% 50%; }
              100% { background-position: 0% 50%; }
            }
            .bounce {
              animation: bounce 1s ease-in-out infinite;
            }
            @keyframes bounce {
              0%, 100% { transform: translateY(0); }
              50% { transform: translateY(-20px); }
            }
          </style>
        </head>
        <body class="lucky-bg min-h-screen flex items-center justify-center">
          <div class="text-center text-white max-w-2xl mx-auto px-4">
            <div class="bounce text-8xl mb-8">🍀</div>
            <h1 class="text-4xl md:text-6xl font-bold mb-6">YOU'RE LUCKY!</h1>
            <p class="text-xl md:text-2xl mb-8">Not rickrolled - redirecting now...</p>
            <div class="text-lg mb-4">
              <p>Going to: <span class="font-mono bg-white/20 px-3 py-1 rounded">${linkData.targetUrl}</span></p>
            </div>
            <div class="text-sm opacity-75">
              <p>Redirecting in <span id="countdown">3</span> seconds...</p>
            </div>
          </div>
          
          <script>
            let timeLeft = 3;
            const countdownEl = document.getElementById('countdown');
            
            const countdown = setInterval(() => {
              timeLeft--;
              countdownEl.textContent = timeLeft;
              
              if (timeLeft <= 0) {
                clearInterval(countdown);
                window.location.href = '${linkData.targetUrl}';
              }
            }, 1000);
          </script>
        </body>
        </html>
      `);
    }
    
  } catch (error) {
    console.error('❌ Error in redirect:', error);
    res.status(500).send('Internal server error');
  }
}