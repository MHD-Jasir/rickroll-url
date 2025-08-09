export default function handler(req, res) {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
        <title>Surprise!</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <style>
            .rickroll-bg {
                background: linear-gradient(45deg, #ff1744, #e91e63, #9c27b0, #673ab7);
                background-size: 400% 400%;
                animation: rickrollGradient 3s ease infinite;
            }
            @keyframes rickrollGradient {
                0% { background-position: 0% 50%; }
                50% { background-position: 100% 50%; }
                100% { background-position: 0% 50%; }
            }
            .dance {
                animation: dance 1s ease-in-out infinite alternate;
            }
            @keyframes dance {
                0% { transform: rotate(-5deg) scale(1); }
                100% { transform: rotate(5deg) scale(1.1); }
            }
            .video-container {
                position: relative;
                max-width: 800px;
                margin: 0 auto;
                border-radius: 20px;
                overflow: hidden;
                box-shadow: 0 20px 40px rgba(0,0,0,0.3);
            }
            .countdown {
                position: absolute;
                top: 20px;
                right: 20px;
                background: rgba(0,0,0,0.7);
                color: white;
                padding: 10px 20px;
                border-radius: 10px;
                font-weight: bold;
                font-size: 18px;
            }
        </style>
    </head>
    <body class="rickroll-bg min-h-screen flex items-center justify-center p-4">
        <div class="text-center text-white max-w-4xl mx-auto">
            <div class="dance text-6xl mb-6">🎵</div>
            <h1 class="text-4xl md:text-6xl font-bold mb-6">YOU'VE BEEN RICKROLLED!</h1>
            
            <div class="video-container mb-8">
                <div class="countdown" id="countdown">10</div>
                <!-- YouTube Rick Roll embed -->
                <iframe 
                    width="100%" 
                    height="450" 
                    src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&mute=0&controls=1&start=0&end=10&loop=1&playlist=dQw4w9WgXcQ" 
                    frameborder="0" 
                    allow="autoplay; encrypted-media" 
                    allowfullscreen>
                </iframe>
            </div>
            
            <div class="text-xl md:text-2xl font-bold space-y-2 mb-8">
                <p>🎶 Never gonna give you up 🎶</p>
                <p>🎶 Never gonna let you down 🎶</p>
                <p>🎶 Never gonna run around and desert you 🎶</p>
            </div>
            
            <div class="space-y-4">
                <a href="/" class="inline-block bg-white text-purple-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-100 transition-all transform hover:scale-105">
                    🏠 Go Back Home
                </a>
                <br>
                <a href="/" class="inline-block bg-purple-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-purple-700 transition-all transform hover:scale-105">
                    🎲 Create Another FlipLink
                </a>
            </div>
            
            <div class="mt-8 text-sm opacity-75">
                <p>Thanks for being a good sport! 😄</p>
                <p>You're victim #<span id="victim-count">???</span></p>
            </div>
        </div>

        <script>
            // 10 second countdown
            let timeLeft = 10;
            const countdownEl = document.getElementById('countdown');
            
            const countdown = setInterval(() => {
                timeLeft--;
                countdownEl.textContent = timeLeft;
                
                if (timeLeft <= 0) {
                    clearInterval(countdown);
                    countdownEl.textContent = 'Rickrolled!';
                    setTimeout(() => {
                        window.location.href = '/';
                    }, 2000);
                }
            }, 1000);
            
            // Get victim count from server
            fetch('/api/stats')
                .then(response => response.json())
                .then(data => {
                    document.getElementById('victim-count').textContent = data.rickrolls || 1;
                })
                .catch(() => {
                    document.getElementById('victim-count').textContent = '???';
                });
        </script>
    </body>
    </html>
  `);
}