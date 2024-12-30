# deploy.ps1

# Enable strict mode
Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

# Configure Node.js settings
$env:NODE_OPTIONS = "--max-old-space-size=4096"

# Logging functions
function Write-Log($message) {
    Write-Host "[$(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')] $message" -ForegroundColor Green
}

function Write-Error($message) {
    Write-Host "[ERROR] $message" -ForegroundColor Red
    exit 1
}

# Main deployment steps
try {
    Write-Log "Starting WhiskeyWiz deployment..."

    # Check prerequisites
    Write-Log "Checking prerequisites..."
    if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
        Write-Error "Node.js is required but not installed"
    }

    # Clean environment
    Write-Log "Cleaning environment..."
    npm cache clean --force
    if (Test-Path "dist") { Remove-Item -Recurse -Force "dist" }
    if (Test-Path "node_modules") { Remove-Item -Recurse -Force "node_modules" }

    # Install dependencies
    Write-Log "Installing dependencies..."
    npm ci --no-audit

    # Build application
    Write-Log "Building web components..."
    npm run build:elements

    Write-Log "Building production application..."
    nx build whiskey-wiz --configuration=production

    # Deploy to Firebase
    Write-Log "Deploying to Firebase..."
    firebase deploy --non-interactive

    Write-Log "Deployment completed successfully! 🎉"
    Write-Log "Please verify:"
    Write-Host "1. Visit https://whiskeywiz2.web.app"
    Write-Host "2. Test Shopify integration"
    Write-Host "3. Verify game functionality"

} catch {
    Write-Error "Deployment failed: $_"
}
