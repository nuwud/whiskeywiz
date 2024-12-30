$ErrorActionPreference = "Stop"

function Write-Log($msg) {
    Write-Host "[$(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')] $msg" -ForegroundColor Green
}

try {
    Write-Log "Starting deployment"

    # Prerequisites check
    Write-Log "Checking Node.js"
    if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
        throw "Node.js is required but not installed"
    }

    # Cleanup
    Write-Log "Cleaning environment"
    Remove-Item -Recurse -Force "dist" -ErrorAction SilentlyContinue
    Remove-Item -Recurse -Force "node_modules" -ErrorAction SilentlyContinue
    
    # Dependencies
    Write-Log "Installing dependencies"
    & npm ci
    if ($LASTEXITCODE -ne 0) { throw "npm ci failed" }

    # Build
    Write-Log "Building components"
    & npm run build:elements
    if ($LASTEXITCODE -ne 0) { throw "build:elements failed" }

    Write-Log "Building application"
    & nx build whiskey-wiz --configuration=production
    if ($LASTEXITCODE -ne 0) { throw "nx build failed" }

    # Deploy
    Write-Log "Deploying"
    & firebase deploy --non-interactive
    if ($LASTEXITCODE -ne 0) { throw "Firebase deployment failed" }

    Write-Log "Deployment successful!"
    Write-Host "`nPlease verify:" -ForegroundColor Yellow
    Write-Host "1. Visit https://whiskeywiz2.web.app"
    Write-Host "2. Test Shopify integration"
    Write-Host "3. Verify game functionality"

} catch {
    Write-Host "`n[ERROR] $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}