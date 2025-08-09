# Use Node.js 18 LTS
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY client/package*.json ./client/

# Install dependencies
RUN npm install
RUN cd client && npm install

# Copy source code
COPY . .

# Build React app
RUN npm run build

# Create storage directory
RUN mkdir -p storage

# Expose port
EXPOSE 5555

# Start the application
CMD ["npm", "start"]