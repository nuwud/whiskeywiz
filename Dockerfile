# Use official Node.js LTS image
FROM node:20.18.1

# Set working directory
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    git \
    && rm -rf /var/lib/apt/lists/*

# Install Firebase Tools globally
RUN npm install -g firebase-tools

# Copy package files
COPY package*.json ./
COPY nx.json ./
COPY project.json ./
COPY tsconfig*.json ./

# Install global dependencies
RUN npm install -g @nrwl/cli
RUN npm install -g nx

# Install project dependencies
RUN npm install

# Copy project files
COPY . .

# Install additional dependencies
RUN npm install chart.js @types/chart.js
RUN npm install sass

# Expose port
EXPOSE 4200

# Start the application
CMD ["npx", "nx", "serve", "whiskey-wiz", "--host", "0.0.0.0"]