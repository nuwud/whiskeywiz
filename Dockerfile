# Use official Node.js LTS image with Alpine for smaller size
FROM node:20.18.1-alpine

# Set working directory
WORKDIR /app

# Install system dependencies
RUN apk add --no-cache git

# Install global dependencies in a single layer
RUN npm install -g @nrwl/cli nx firebase-tools

# Copy package files first for better caching
COPY package*.json ./
COPY nx.json project.json ./
COPY tsconfig*.json ./

# Install all dependencies in a single layer
RUN npm ci && \
    npm install chart.js @types/chart.js sass && \
    npm cache clean --force

# Copy the rest of the application
COPY . .

# Expose port
EXPOSE 4200

# Start the application
CMD ["npx", "nx", "serve", "whiskey-wiz", "--host", "0.0.0.0"]