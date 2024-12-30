# WhiskeyWiz Deployment Script

$ErrorActionPreference = "Stop"

# Write colored status messages
function Write-Status($Message) {
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    Write-Host "[$timestamp] $Message" -ForegroundColor Green
}

# Main deployment script
try {
    Write-Status "Starting deployment"
    
    # Check Node.js installation
    Write-Status "Checking prerequisites"
    if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
        throw "Node.js is required but not installed"
    }

    # Clean up old files
    Write-Status "Cleaning up"
    Remove-Item -Recurse -Force "dist" -ErrorAction SilentlyContinue
    Remove-Item -Recurse -Force "node_modules" -ErrorAction SilentlyContinue
    
    # Install dependencies
    Write-Status "Installing dependencies"
    & npm ci
    if ($LASTEXITCODE -ne 0) { throw "npm ci failed" }

    # Build application
    Write-Status "Building web components"
    & npm run build:elements
    if ($LASTEXITCODE -ne 0) { throw "build:elements failed" }

    Write-Status "Building application"
    & nx build whiskey-wiz --configuration=production
    if ($LASTEXITCODE -ne 0) { throw "nx build failed" }

    # Deploy
    Write-Status "Deploying to Firebase"
    & firebase deploy --non-interactive
    if ($LASTEXITCODE -ne 0) { throw "Firebase deployment failed" }

    Write-Status "Deployment completed successfully"
    
    # Final instructions
    Write-Host "`nPlease verify:" -ForegroundColor Yellow
    Write-Host "1. Visit https://whiskeywiz2.web.app"
    Write-Host "2. Test Shopify integration"
    Write-Host "3. Verify game functionality"

} catch {
    Write-Host "`n[ERROR] $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}
