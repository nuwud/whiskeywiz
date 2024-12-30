# WhiskeyWiz deployment script
$ErrorActionPreference = "Stop"

function Write-Log($msg) {
    Write-Host "[$(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')] $msg" -ForegroundColor Green
}

try {
    Write-Log "Starting fresh installation"
    
    # Clean install
    Write-Log "Installing dependencies"
    npm install
    if ($LASTEXITCODE -ne 0) { throw "npm install failed" }

    # Build with nx
    Write-Log "Building application"
    nx build whiskey-wiz --configuration=production
    if ($LASTEXITCODE -ne 0) { throw "nx build failed" }

    # Copy web components
    Write-Log "Copying web components"
    New-Item -ItemType Directory -Force -Path "dist/whiskey-wiz/elements"
    Copy-Item "src/app/elements/game-bundle.js" -Destination "dist/whiskey-wiz/elements/game-elements.js" -Force

    # Deploy
    Write-Log "Deploying to Firebase"
    firebase deploy --non-interactive
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