# 🎲 FlipLink - The 50/50 Surprise URL Shortener

**Will you get your link... or get Rickrolled?** 🎵

FlipLink is the world's most chaotic URL shortener. Every click has a 50% chance of taking you to your intended destination, and a 50% chance of treating you to Rick Astley's greatest hit!

## 🎯 Features

- **50/50 Chaos**: Every click is a gamble
- **No External Dependencies**: Rick Roll video hosted locally (no YouTube ads!)
- **Real-time Stats**: Track total clicks, successful redirects, and Rickrolls
- **Beautiful UI**: Clean, responsive design with TailwindCSS
- **Node.js Powered**: Simple server architecture

## 🚀 Deployment

Deploy to any Node.js platform like Railway, Heroku, or DigitalOcean!

## 🛠️ Tech Stack

- **Frontend**: React, Framer Motion, Axios
- **Backend**: Node.js, Express
- **Database**: Local Storage (node-localstorage)
- **Styling**: Custom CSS with funky animations
- **URL Generation**: nanoid

## 📦 Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### 1. Clone and Install
```bash
git clone https://github.com/yourusername/fliplink.git
cd fliplink
npm install
cd client && npm install
```

### 2. Development
```bash
# Start both server and client in development mode
npm run dev

# Or start them separately:
# Terminal 1: Start the server
npm run server

# Terminal 2: Start the React client
npm run client
```

### 3. Production Build
```bash
# Build the React app
npm run build

# Start production server
npm start
```

### 4. Access the App
- **Development**: http://localhost:3000 (React dev server)
- **Production**: http://localhost:5555 (Express server)

## 🎮 How It Works

1. **User enters a URL** → Saved to local storage with a random 6-character code
2. **Someone clicks the FlipLink** → Express server generates random number (1 or 2)
3. **If 1**: Redirect to the real URL ✅
4. **If 2**: Redirect to rickroll page 🎵
5. **Stats updated** in real-time for both outcomes

## 📊 Project Structure

```
fliplink/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── App.js        # Main React app
│   │   └── App.css       # Funky styles
│   └── package.json
├── server.js              # Express backend
├── storage/               # Local storage data
├── package.json           # Main package.json
└── README.md
```

## 🎯 Why This Could Win "Useless Projects 2.0"

- ✅ **Completely Useless**: Adds chaos where none was needed
- ✅ **Hilarious**: People's reactions are priceless
- ✅ **Well-Built**: Professional code for a silly idea
- ✅ **Meme-Worthy**: Rick Rolling never gets old
- ✅ **Interactive**: Fun to demo and share

## 🎬 Demo Video Script

1. **Intro** (15s): "Meet FlipLink - the URL shortener that keeps you guessing!"
2. **Demo** (60s): 
   - Create a FlipLink
   - Click it multiple times showing both outcomes
   - Show the stats updating
3. **Reactions** (30s): Film friends/family getting Rickrolled
4. **Outro** (15s): "FlipLink - because life needs more surprises!"

## 🤝 Contributing

This is a fun project for Tinkerhub's Useless Projects 2.0! Feel free to:
- Add more chaos (maybe 33/33/33 with a third surprise?)
- Improve the UI
- Add sound effects
- Create themed variations

## 📄 License

MIT License - Feel free to fork and create your own chaotic URL shortener!

## 🙏 Acknowledgments

- Rick Astley for the eternal meme
- Tinkerhub for celebrating useless projects
- Everyone who gets Rickrolled and laughs about it

---

**Made with ❤️ and a healthy dose of chaos**

*Remember: With great power comes great responsibility. Use FlipLink wisely (or don't)!* 😈