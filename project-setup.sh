#!/bin/bash

# Project Setup Script for WhiskeyWiz

# Ensure we're in the project directory
cd "$(dirname "$0")"

# Check Node.js version
echo "Current Node.js Version:"
node --version

# Check npm version
echo "Current npm Version:"
npm --version

# Clean npm cache
npm cache clean --force

# Remove old node_modules and package-lock.json
rm -rf node_modules
rm -f package-lock.json

# Uninstall global packages to prevent conflicts
npm uninstall -g @angular/cli @nrwl/cli nx firebase-tools

# Install global packages
npm install -g @angular/cli@latest @nrwl/cli nx firebase-tools

# Install project dependencies
npm install

# Verify installations
echo "Node.js Version:"
node --version

echo "npm Version:"
npm --version

echo "Angular CLI Version:"
ng version

echo "Nx Version:"
nx --version

echo "Firebase Tools Version:"
firebase --version

# Optional: Run project checks
nx affected:lint
nx affected:test

echo "Project setup complete!"
