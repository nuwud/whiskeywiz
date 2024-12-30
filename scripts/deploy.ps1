# WhiskeyWiz Deployment Script

$ErrorActionPreference = "Stop"

function Write-Status($message) {
    Write-Host "[$(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')] $message" -ForegroundColor Green
}

function Write-ErrorMessage($message) {
    Write-Host "[ERROR] $message" -ForegroundColor Red
    exit 1
}

try {
    Write-Status "Starting WhiskeyWiz deployment..."

    # Check Node.js
    Write-Status "Checking Node.js..."
    if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
        Write-ErrorMessage "Node.js is required but not installed"
    }

    # Clean up
    Write-Status "Cleaning environment..."
    if (Test-Path "dist") { 
        Remove-Item -Recurse -Force "dist" 
    }
    if (Test-Path "node_modules") { 
        Remove-Item -Recurse -Force "node_modules" 
    }
    npm cache clean --force

    # Install dependencies
    Write-Status "Installing dependencies..."
    npm ci --no-audit

    # Build
    Write-Status "Building web components..."
    npm run build:elements

    Write-Status "Building production application..."
    nx build whiskey-wiz --configuration=production

    # Deploy
    Write-Status "Deploying to Firebase..."
    firebase deploy --non-interactive

    Write-Status "Deployment completed successfully!"
    Write-Host "Please verify:"
    Write-Host "1. Visit https://whiskeywiz2.web.app"
    Write-Host "2. Test Shopify integration"
    Write-Host "3. Verify game functionality"

} catch {
    Write-ErrorMessage "Deployment failed: $($_.Exception.Message)"
}
