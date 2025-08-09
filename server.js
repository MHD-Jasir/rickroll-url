const express = require('express');
const cors = require('cors');
const path = require('path');
const { LocalStorage } = require('node-localstorage');
const { nanoid } = require('nanoid');

const app = express();
const PORT = process.env.PORT || 5555;

// Initialize local storage
const localStorage = new LocalStorage('./storage');

// Middleware
app.use(cors());
app.use(express.json());
app.use('/static', express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'client/build')));

// Initialize storage if empty
if (!localStorage.getItem('fliplinks')) {
    localStorage.setItem('fliplinks', JSON.stringify({}));
}
if (!localStorage.getItem('flipstats')) {
    localStorage.setItem('flipstats', JSON.stringify({
        totalClicks: 0,
        rickrolls: 0,
        successes: 0
    }));
}

// API Routes

// Create a new FlipLink
app.post('/api/create', (req, res) => {
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
        const links = JSON.parse(localStorage.getItem('fliplinks') || '{}');
        
        const linkData = {
            targetUrl: url,
            createdAt: new Date().toISOString(),
            clicks: 0,
            rickrolls: 0,
            successes: 0
        };
        
        links[shortCode] = linkData;
        localStorage.setItem('fliplinks', JSON.stringify(links));
        
        console.log('💾 Saved link:', shortCode, '→', url);
        console.log('📦 All links:', Object.keys(links));
        
        const flipUrl = `${req.protocol}://${req.get('host')}/flip/${shortCode}`;
        
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
});

// Get stats
app.get('/api/stats', (req, res) => {
    try {
        const stats = JSON.parse(localStorage.getItem('flipstats') || '{"totalClicks": 0, "rickrolls": 0, "successes": 0}');
        
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
});

// Handle FlipLink redirects
app.get('/flip/:shortCode', (req, res) => {
    try {
        const { shortCode } = req.params;
        console.log(`🎲 FlipLink clicked: ${shortCode}`);
        
        const links = JSON.parse(localStorage.getItem('fliplinks') || '{}');
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
        let stats = JSON.parse(localStorage.getItem('flipstats') || '{"totalClicks": 0, "rickrolls": 0, "successes": 0}');
        stats.totalClicks = (stats.totalClicks || 0) + 1;
        
        // Update link stats
        linkData.clicks = (linkData.clicks || 0) + 1;
        
        if (isRickroll) {
            console.log('🎵 RICKROLL TIME!');
            stats.rickrolls = (stats.rickrolls || 0) + 1;
            linkData.rickrolls = (linkData.rickrolls || 0) + 1;
            
            // Save updated stats
            localStorage.setItem('flipstats', JSON.stringify(stats));
            links[shortCode] = linkData;
            localStorage.setItem('fliplinks', JSON.stringify(links));
            
            console.log('📊 Updated stats:', stats);
            
            // Redirect to Rick Roll page
            res.redirect('/rickroll');
        } else {
            console.log('✅ Lucky escape! Redirecting to actual URL');
            stats.successes = (stats.successes || 0) + 1;
            linkData.successes = (linkData.successes || 0) + 1;
            
            // Save updated stats
            localStorage.setItem('flipstats', JSON.stringify(stats));
            links[shortCode] = linkData;
            localStorage.setItem('fliplinks', JSON.stringify(links));
            
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
                        
                        // Create lucky stars
                        for (let i = 0; i < 15; i++) {
                            setTimeout(() => {
                                const star = document.createElement('div');
                                star.textContent = '⭐';
                                star.style.position = 'fixed';
                                star.style.left = Math.random() * 100 + 'vw';
                                star.style.top = '100vh';
                                star.style.fontSize = '2rem';
                                star.style.zIndex = '1000';
                                star.style.pointerEvents = 'none';
                                star.style.animation = 'float 4s linear forwards';
                                document.body.appendChild(star);
                                
                                setTimeout(() => {
                                    if (document.body.contains(star)) {
                                        document.body.removeChild(star);
                                    }
                                }, 4000);
                            }, i * 100);
                        }
                        
                        // Add CSS for floating animation
                        const style = document.createElement('style');
                        style.textContent = \`
                            @keyframes float {
                                to {
                                    transform: translateY(-100vh) rotate(360deg);
                                    opacity: 0;
                                }
                            }
                        \`;
                        document.head.appendChild(style);
                    </script>
                </body>
                </html>
            `);
        }
        
    } catch (error) {
        console.error('❌ Error in redirect:', error);
        res.status(500).send('Internal server error');
    }
});

// Rick Roll page with local video
app.get('/rickroll', (req, res) => {
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
                video {
                    width: 100%;
                    height: auto;
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
                    <video id="rickVideo" autoplay muted controls loop playsinline style="display: block;">
                        <source src="/static/rick.mp4" type="video/mp4">
                    </video>
                    
                    <!-- Fallback YouTube embed (hidden by default) -->
                    <iframe 
                        id="youtubeBackup"
                        width="100%" 
                        height="450" 
                        src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&mute=0&controls=1&start=0&end=10&loop=1&playlist=dQw4w9WgXcQ" 
                        frameborder="0" 
                        allow="autoplay; encrypted-media" 
                        allowfullscreen
                        style="display: none;">
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
                const video = document.getElementById('rickVideo');
                
                const youtubeBackup = document.getElementById('youtubeBackup');
                
                // Check if video loads successfully
                video.addEventListener('loadeddata', () => {
                    console.log('Local video loaded successfully');
                    // Try to play with sound after a brief delay
                    setTimeout(() => {
                        video.muted = false;
                        video.play().then(() => {
                            console.log('Video playing with sound!');
                        }).catch(e => {
                            console.log('Autoplay with sound prevented, trying muted:', e);
                            video.muted = true;
                            video.play().catch(e2 => console.log('Muted autoplay also failed:', e2));
                        });
                    }, 500);
                });
                
                // If video fails to load, show YouTube backup
                video.addEventListener('error', () => {
                    console.log('Local video failed to load, showing YouTube backup');
                    video.style.display = 'none';
                    youtubeBackup.style.display = 'block';
                });
                
                // Try to unmute on any user interaction
                const enableSound = () => {
                    if (video.style.display !== 'none') {
                        video.muted = false;
                        video.play();
                    }
                    document.removeEventListener('click', enableSound);
                    document.removeEventListener('keydown', enableSound);
                    document.removeEventListener('touchstart', enableSound);
                };
                
                document.addEventListener('click', enableSound);
                document.addEventListener('keydown', enableSound);
                document.addEventListener('touchstart', enableSound);
                
                // Initial play attempt
                video.play().catch(e => {
                    console.log('Initial autoplay failed:', e);
                    // If local video fails completely, try YouTube backup
                    setTimeout(() => {
                        if (video.paused && video.readyState === 0) {
                            console.log('Switching to YouTube backup');
                            video.style.display = 'none';
                            youtubeBackup.style.display = 'block';
                        }
                    }, 2000);
                });
                
                const countdown = setInterval(() => {
                    timeLeft--;
                    countdownEl.textContent = timeLeft;
                    
                    if (timeLeft <= 0) {
                        clearInterval(countdown);
                        countdownEl.textContent = 'Rickrolled!';
                        video.pause();
                        // Auto redirect to home after countdown
                        setTimeout(() => {
                            window.location.href = '/';
                        }, 2000);
                    }
                }, 1000);
                
                // Stop video after 10 seconds
                setTimeout(() => {
                    video.pause();
                }, 10000);
                
                // Get victim count from server
                fetch('/api/stats')
                    .then(response => response.json())
                    .then(data => {
                        document.getElementById('victim-count').textContent = data.rickrolls || 1;
                    })
                    .catch(() => {
                        document.getElementById('victim-count').textContent = '???';
                    });
                    
                // Add some fun effects
                document.addEventListener('DOMContentLoaded', function() {
                    // Create dancing emojis
                    const emojis = ['🎵', '🎶', '💃', '🕺', '🎤', '🎸'];
                    for (let i = 0; i < 20; i++) {
                        setTimeout(() => {
                            const emoji = document.createElement('div');
                            emoji.textContent = emojis[Math.floor(Math.random() * emojis.length)];
                            emoji.style.position = 'fixed';
                            emoji.style.left = Math.random() * 100 + 'vw';
                            emoji.style.top = '100vh';
                            emoji.style.fontSize = '2rem';
                            emoji.style.zIndex = '1000';
                            emoji.style.pointerEvents = 'none';
                            emoji.style.animation = 'float 3s linear forwards';
                            document.body.appendChild(emoji);
                            
                            setTimeout(() => {
                                if (document.body.contains(emoji)) {
                                    document.body.removeChild(emoji);
                                }
                            }, 3000);
                        }, i * 200);
                    }
                });
                
                // Add CSS for floating animation
                const style = document.createElement('style');
                style.textContent = \`
                    @keyframes float {
                        to {
                            transform: translateY(-100vh) rotate(360deg);
                            opacity: 0;
                        }
                    }
                \`;
                document.head.appendChild(style);
            </script>
        </body>
        </html>
    `);
});

// Debug endpoint to check storage
app.get('/api/debug', (req, res) => {
    try {
        const links = JSON.parse(localStorage.getItem('fliplinks') || '{}');
        const stats = JSON.parse(localStorage.getItem('flipstats') || '{}');
        
        res.json({
            links: Object.keys(links).length > 0 ? links : 'No links found',
            stats: stats,
            storage_path: './storage',
            linkCount: Object.keys(links).length
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Test endpoint to create a test link
app.get('/api/test-create', (req, res) => {
    try {
        const testUrl = 'https://www.google.com';
        const shortCode = 'TEST123';
        const links = JSON.parse(localStorage.getItem('fliplinks') || '{}');
        
        links[shortCode] = {
            targetUrl: testUrl,
            createdAt: new Date().toISOString(),
            clicks: 0,
            rickrolls: 0,
            successes: 0
        };
        
        localStorage.setItem('fliplinks', JSON.stringify(links));
        
        const flipUrl = `${req.protocol}://${req.get('host')}/flip/${shortCode}`;
        
        res.json({
            message: 'Test link created',
            shortCode,
            flipUrl,
            targetUrl: testUrl,
            testLink: `<a href="${flipUrl}" target="_blank">Click to test: ${flipUrl}</a>`
        });
        
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Serve React app for all other routes (only if build exists)
app.get('*', (req, res) => {
    const buildPath = path.join(__dirname, 'client/build', 'index.html');
    if (require('fs').existsSync(buildPath)) {
        res.sendFile(buildPath);
    } else {
        // If no React build, serve a simple HTML page
        res.send(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>FlipLink - Server Running</title>
                <script src="https://cdn.tailwindcss.com"></script>
            </head>
            <body class="bg-gradient-to-br from-purple-600 to-blue-600 min-h-screen flex items-center justify-center">
                <div class="text-center text-white">
                    <h1 class="text-6xl mb-4">🎲</h1>
                    <h2 class="text-3xl font-bold mb-4">FlipLink Server is Running!</h2>
                    <p class="text-xl mb-8">Backend API is working on port ${PORT}</p>
                    <div class="space-y-4">
                        <p>Test the API:</p>
                        <a href="/api/stats" class="bg-white text-purple-600 px-6 py-3 rounded-lg font-bold hover:bg-gray-100 transition-colors inline-block">
                            📊 View Stats
                        </a>
                        <br>
                        <a href="/api/debug" class="bg-white text-purple-600 px-6 py-3 rounded-lg font-bold hover:bg-gray-100 transition-colors inline-block">
                            🔍 Debug Info
                        </a>
                    </div>
                    <p class="mt-8 text-sm opacity-75">Run 'npm run client' to start the React frontend</p>
                </div>
            </body>
            </html>
        `);
    }
});

app.listen(PORT, () => {
    console.log(`🎲 FlipLink server running on port ${PORT}`);
    console.log(`🎵 Ready to rickroll some people!`);
});