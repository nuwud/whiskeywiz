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

<<<<<<< HEAD
function Write-Log($message) {
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    Write-ColorOutput Green "[$timestamp] $message"
}

function Write-ErrorLog($message) {
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    Write-ColorOutput Red "[ERROR] $message"
    exit 1
}

function Write-WarningLog($message) {
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    Write-ColorOutput Yellow "[WARNING] $message"
}

# Initial setup
function Initialize-NodeEnvironment {
    Write-Log "Configuring Node.js environment..."
    
    try {
        # Increase event listener limit through npm config
        npm config set maxsockets 25
        
        # Create .npmrc if it doesn't exist
        if (-not (Test-Path ".npmrc")) {
            @"
maxsockets=25
registry=https://registry.npmjs.org/
"@ | Set-Content ".npmrc"
        }
        
        Write-Log "Node.js environment configured ✓"
    }
    catch {
        Write-ErrorLog "Failed to configure Node.js environment: $_"
    }
}

# Check prerequisites
function Test-Prerequisites {
    Write-Log "Checking prerequisites..."
    
    try {
        # Check Node.js
        $nodeVersion = node --version
        if (-not $nodeVersion) {
            Write-ErrorLog "Node.js is required but not installed"
        }
        
        $versionNumber = $nodeVersion.Replace('v', '')
        if ([version]$versionNumber -lt [version]"16.0.0") {
            Write-ErrorLog "Node.js version must be 16.0.0 or higher. Current version: $versionNumber"
        }
        
        # Check npm
        $null = npm --version
        
        # Verify Firebase CLI globally
        if (-not (Get-Command firebase -ErrorAction SilentlyContinue)) {
            Write-Log "Firebase CLI not found globally, installing..."
            npm install -g firebase-tools
        }
        
        Write-Log "Prerequisites check passed ✓"
    }
    catch {
        Write-ErrorLog "Prerequisites check failed: $_"
    }
}

# Clean environment
function Clear-Environment {
    Write-Log "Cleaning environment..."
    
    try {
        # Clear npm cache
        npm cache clean --force
        
        # Remove problematic folders
        $foldersToRemove = @(
            "node_modules",
            "dist",
            ".angular/cache"
        )
        
        foreach ($folder in $foldersToRemove) {
            if (Test-Path $folder) {
                Write-Log "Removing $folder..."
                Remove-Item -Recurse -Force $folder
            }
        }
        
        Write-Log "Environment cleaned ✓"
    }
    catch {
        Write-ErrorLog "Failed to clean environment: $_"
    }
}

# Build process with memory management
function Start-Build {
    Write-Log "Starting build process..."
    
    try {
        # Clean install dependencies
        Write-Log "Installing dependencies..."
        npm ci --no-audit --no-fund
        
        # Build elements
        Write-Log "Building web components..."
        npm run build:elements
        
        # Production build
        Write-Log "Building production application..."
        nx build whiskey-wiz --configuration=production
        
        Write-Log "Build process completed ✓"
    }
    catch {
        Write-ErrorLog "Build failed: $_"
    }
}

# Deployment with verification
function Start-FirebaseDeployment {
    Write-Log "Starting Firebase deployment..."
    
    try {
        # Verify Firebase login
        $loginStatus = firebase login:list
        if (-not ($loginStatus -match "nuwudorder@gmail.com")) {
            Write-ErrorLog "Not logged in to Firebase. Please run 'firebase login' first."
        }
        
        # Deploy
        firebase deploy --non-interactive
        
        Write-Log "Deployment completed ✓"
    }
    catch {
        Write-ErrorLog "Deployment failed: $_"
    }
}

# Main deployment flow
function Start-WhiskeyWizDeployment {
    Write-Log "Starting WhiskeyWiz deployment process..."
    
    try {
        Initialize-NodeEnvironment
        Test-Prerequisites
        Clear-Environment
        Start-Build
        Start-FirebaseDeployment
        
        Write-Log "Deployment completed successfully! 🎉"
        Write-Log "Please verify:"
        Write-Output "1. Visit https://whiskeywiz2.web.app"
        Write-Output "2. Test Shopify integration"
        Write-Output "3. Verify game functionality"
    }
    catch {
        Write-ErrorLog "Deployment failed: $_"
    }
}

# Execute deployment
Start-WhiskeyWizDeployment
||||||| adb8179
...
=======
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
>>>>>>> 43f167ddb510d349f4d0c211affd28493606f7fa
