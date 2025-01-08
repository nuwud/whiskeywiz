#!/bin/bash

# WhiskeyWiz Deployment Script (Windows/MINGW64 Compatible)
# ------------------------------------------------------

# Exit on any error
set -e

# Color definitions that work in MINGW
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Logging function
log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1"
    exit 1
}

warn() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

# Check required tools - Windows compatible
check_prerequisites() {
    log "Checking prerequisites..."
    
    # Check Node.js
    if ! node --version > /dev/null 2>&1; then
        error "Node.js is required but not installed"
    fi
    
    # Check npm
    if ! npm --version > /dev/null 2>&1; then
        error "npm is required but not installed"
    fi
    
    # Check Firebase CLI (Windows path)
    if ! npx firebase --version > /dev/null 2>&1; then
        error "Firebase CLI is required. Please install with: npm install -g firebase-tools"
    fi
    
    # Check node version
    node_version=$(node --version | cut -d'v' -f2)
    if [[ "${node_version}" < "16.0.0" ]]; then
        error "Node.js version must be 16.0.0 or higher. Current version: ${node_version}"
    fi
    
    log "Prerequisites check passed ✓"
}

# Rest of the script content...