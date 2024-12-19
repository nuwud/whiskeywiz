# clean-deploy.ps1

function Write-Status {
    param(
        [string]$Message,
        [string]$Color = "White"
    )
    Write-Host $Message -ForegroundColor $Color
}

# Stop any running processes
Write-Status "Stopping related processes..." "Yellow"
Get-Process | Where-Object {$_.ProcessName -match 'ng|node'} | ForEach-Object {
    try {
        $_.Kill()
        $_.WaitForExit()
    } catch {}
}

# Clean up dist directory
Write-Status "Removing dist directory..." "Yellow"
if (Test-Path "dist") {
    Remove-Item -Path "dist" -Recurse -Force -ErrorAction SilentlyContinue
    Start-Sleep -Seconds 2  # Give the system time to release file handles
}

# Clear Angular cache
Write-Status "Clearing Angular cache..." "Yellow"
if (Test-Path ".angular/cache") {
    Remove-Item -Path ".angular/cache" -Recurse -Force -ErrorAction SilentlyContinue
}

# Build the project
Write-Status "Building project..." "Yellow"
$buildResult = nx build whiskey-wiz --configuration=production
if ($LASTEXITCODE -ne 0) {
    Write-Status "Build failed!" "Red"
    exit 1
}

# Verify dist directory was created
if (-not (Test-Path "dist/whiskey-wiz")) {
    Write-Status "Build directory not found!" "Red"
    exit 1
}

# Deploy to Firebase
Write-Status "Deploying to Firebase..." "Yellow"
firebase deploy --only hosting

Write-Status "Deployment complete!" "Green"
Write-Status "Visit https://whiskeywiz2.web.app to verify changes" "Cyan"