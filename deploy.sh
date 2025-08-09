#!/bin/bash

echo "🎲 Deploying FlipLink..."

# Build functions
echo "📦 Building Firebase Functions..."
cd functions
npm run build
cd ..

# Deploy to Firebase
echo "🚀 Deploying to Firebase..."
firebase deploy

echo "✅ FlipLink deployed successfully!"
echo "🎵 Time to start Rickrolling people!"