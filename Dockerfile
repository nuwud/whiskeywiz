# Use official Node.js LTS image
FROM node:20.18.1

# Set working directory
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    git \
    && rm -rf /var/lib/apt/lists/*

# Copy project configuration files
COPY package*.json ./
COPY nx.json ./
COPY tsconfig*.json ./
COPY angular.json ./

# Install global dependencies
RUN npm install -g @angular/cli @nrwl/nx

# Install project dependencies
RUN npm ci

# Copy entire project
COPY . .

# Expose port for Angular development server
EXPOSE 4200

# Default command to serve the application
CMD ["npx", "nx", "serve", "whiskey-wiz"]