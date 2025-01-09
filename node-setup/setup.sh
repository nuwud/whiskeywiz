#!/bin/bash

# Ensure we're in the right directory
cd /c/users/nuwud/whiskeywiz

# Update global packages
npm uninstall -g @angular/cli @nrwl/cli nx firebase-tools

# Install latest global packages
npm install -g @angular/cli@latest @nrwl/cli nx firebase-tools

# Clean install project dependencies
npm ci

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
