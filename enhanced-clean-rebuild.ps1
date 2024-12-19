# enhanced-clean-rebuild.ps1
Write-Host "Starting enhanced deployment process..." -ForegroundColor Yellow

# Function to wait for file unlock
function Wait-FileUnlock {
    param([string]$Path)
    $attempts = 0
    while ($attempts -lt 5) {
        try {
            $fileStream = [System.IO.File]::Open($Path, 'Open', 'Read', 'None')
            $fileStream.Close()
            $fileStream.Dispose()
            return $true
        }
        catch {
            Write-Host "Waiting for file to be unlocked: $Path" -ForegroundColor Yellow
            Start-Sleep -Seconds 2
            $attempts++
        }
    }
    return $false
}

# Kill any running Angular processes
Write-Host "Stopping any running Angular processes..." -ForegroundColor Yellow
Stop-Process -Name "ng" -ErrorAction SilentlyContinue

# Clean up with extra checks
Write-Host "Cleaning up..." -ForegroundColor Yellow
if (Test-Path "dist") {
    Remove-Item -Recurse -Force dist -ErrorAction SilentlyContinue
}
if (Test-Path ".angular/cache") {
    Remove-Item -Recurse -Force .angular/cache -ErrorAction SilentlyContinue
}

# Special handling for locked files
if (Test-Path "node_modules") {
    Get-ChildItem -Path "node_modules" -Recurse | 
    ForEach-Object {
        if (Wait-FileUnlock $_.FullName) {
            Remove-Item -Recurse -Force $_.FullName -ErrorAction SilentlyContinue
        }
    }
}

# Install necessary global packages
Write-Host "Installing global dependencies..." -ForegroundColor Yellow
npm install -g @angular/cli
npm install -g nx

# Clear npm cache
Write-Host "Clearing npm cache..." -ForegroundColor Yellow
npm cache clean --force

# Install project dependencies
Write-Host "Installing project dependencies..." -ForegroundColor Yellow
npm install

# Verify Nx installation
Write-Host "Verifying Nx installation..." -ForegroundColor Yellow
if (-not (Get-Command "nx" -ErrorAction SilentlyContinue)) {
    Write-Host "Installing Nx locally..." -ForegroundColor Yellow
    npm install -D @nrwl/cli
    $env:PATH = "$(Get-Location)\node_modules\.bin;$env:PATH"
}

# Build the project
Write-Host "Building project..." -ForegroundColor Yellow
Write-Host "Running nx build command..." -ForegroundColor Yellow
npx nx build whiskey-wiz --configuration=production --skip-nx-cache

# Deploy to Firebase
Write-Host "Deploying to Firebase..." -ForegroundColor Yellow
firebase deploy --only hosting --force

Write-Host "Deployment process complete!" -ForegroundColor Green