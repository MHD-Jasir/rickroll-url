# Use Node.js 18 LTS
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy root package.json and install server dependencies
COPY package*.json ./
RUN npm install --only=production

# Copy client package.json and install client dependencies
COPY client/package*.json ./client/
WORKDIR /app/client
RUN npm install

# Go back to app root
WORKDIR /app

# Copy all source code
COPY . .

# Build React app
RUN npm run build

# Create storage directory for persistent data
RUN mkdir -p storage

# Remove client node_modules to reduce image size (already built)
RUN rm -rf client/node_modules

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs
RUN adduser -S fliplink -u 1001

# Change ownership of app directory
RUN chown -R fliplink:nodejs /app
USER fliplink

# Expose port
EXPOSE 5555

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:5555/api/stats', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })"

# Start the application
CMD ["npm", "start"]