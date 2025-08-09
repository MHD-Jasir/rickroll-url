#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🎲 FlipLink Deployment Helper\n');

// Check if we're in the right directory
if (!fs.existsSync('package.json')) {
    console.error('❌ Error: package.json not found. Run this from the project root.');
    process.exit(1);
}

// Check if client directory exists
if (!fs.existsSync('client')) {
    console.error('❌ Error: client directory not found.');
    process.exit(1);
}

try {
    console.log('📦 Installing dependencies...');
    execSync('npm install', { stdio: 'inherit' });
    
    console.log('\n🔧 Installing client dependencies...');
    execSync('cd client && npm install', { stdio: 'inherit', shell: true });
    
    console.log('\n🏗️  Building React app...');
    execSync('cd client && npm run build', { stdio: 'inherit', shell: true });
    
    console.log('\n✅ Build complete!');
    console.log('\n🚀 Ready for deployment!');
    console.log('\nNext steps:');
    console.log('1. Push to GitHub: git add . && git commit -m "Ready for deployment" && git push');
    console.log('2. Deploy to Render, Vercel, Railway, or any Node.js platform');
    console.log('3. Use build command: npm run postinstall');
    console.log('4. Use start command: npm start');
    
    console.log('\n🎯 Or test locally:');
    console.log('   npm start');
    console.log('   Then visit http://localhost:5555');
    
} catch (error) {
    console.error('\n❌ Build failed:', error.message);
    process.exit(1);
}