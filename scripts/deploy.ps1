<<<<<<< HEAD
# WhiskeyWiz deployment script
||||||| 9fd117f
# WhiskeyWiz Deployment Script

=======
>>>>>>> 0b87a3037c21936ecf7a2d22c8eb404663b34300
$ErrorActionPreference = "Stop"

function Write-Log($msg) {
    Write-Host "[$(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')] $msg" -ForegroundColor Green
}

try {
<<<<<<< HEAD
    Write-Log "Starting fresh installation"
    
    # Clean install
    Write-Log "Installing dependencies"
    npm install
    if ($LASTEXITCODE -ne 0) { throw "npm install failed" }
||||||| 9fd117f
    Write-Status "Starting deployment"
    
    # Check Node.js installation
    Write-Status "Checking prerequisites"
    if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
        throw "Node.js is required but not installed"
    }
=======
    Write-Log "Starting deployment"

    # Prerequisites check
    Write-Log "Checking Node.js"
    if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
        throw "Node.js is required but not installed"
    }
>>>>>>> 0b87a3037c21936ecf7a2d22c8eb404663b34300

<<<<<<< HEAD
    # Build with nx
    Write-Log "Building application"
    nx build whiskey-wiz --configuration=production
||||||| 9fd117f
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
=======
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
>>>>>>> 0b87a3037c21936ecf7a2d22c8eb404663b34300
    if ($LASTEXITCODE -ne 0) { throw "nx build failed" }

    # Copy web components
    Write-Log "Copying web components"
    New-Item -ItemType Directory -Force -Path "dist/whiskey-wiz/elements"
    Copy-Item "src/app/elements/game-bundle.js" -Destination "dist/whiskey-wiz/elements/game-elements.js" -Force

    # Deploy
<<<<<<< HEAD
    Write-Log "Deploying to Firebase"
    firebase deploy --non-interactive
||||||| 9fd117f
    Write-Status "Deploying to Firebase"
    & firebase deploy --non-interactive
=======
    Write-Log "Deploying"
    & firebase deploy --non-interactive
>>>>>>> 0b87a3037c21936ecf7a2d22c8eb404663b34300
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