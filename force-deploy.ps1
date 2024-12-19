# force-deploy.ps1

function Write-Status {
    param(
        [string]$Message,
        [string]$Color = "White"
    )
    Write-Host $Message -ForegroundColor $Color
}

function Exit-WithError {
    param([string]$Message)
    Write-Status $Message "Red"
    exit 1
}

# Start deployment
Write-Status "Starting forced deployment process..." "Yellow"

# Force kill any running Angular processes
Write-Status "Stopping any running Angular processes..." "Yellow"
Get-Process | Where-Object {$_.ProcessName -like "*ng*"} | Stop-Process -Force -ErrorAction SilentlyContinue
Get-Process | Where-Object {$_.ProcessName -like "*node*"} | Stop-Process -Force -ErrorAction SilentlyContinue

# Clean up
Write-Status "Cleaning up previous builds..." "Yellow"
if (Test-Path ".angular") {
    Remove-Item -Path ".angular" -Recurse -Force -ErrorAction SilentlyContinue
}
if (Test-Path "dist") {
    Remove-Item -Path "dist" -Recurse -Force -ErrorAction SilentlyContinue
}
if (Test-Path ".firebase") {
    Remove-Item -Path ".firebase" -Recurse -Force -ErrorAction SilentlyContinue
}

# Clear npm cache
Write-Status "Clearing npm cache..." "Yellow"
npm cache clean --force

# Clean install dependencies
Write-Status "Reinstalling dependencies..." "Yellow"
try {
    Remove-Item -Path "package-lock.json" -Force -ErrorAction SilentlyContinue
    Remove-Item -Path "node_modules" -Recurse -Force -ErrorAction SilentlyContinue
    npm install
    if ($LASTEXITCODE -ne 0) { throw "npm install failed" }
} catch {
    Exit-WithError "Failed to install dependencies: $_"
}

# Build project with no cache
Write-Status "Building project..." "Yellow"
try {
    $env:NODE_OPTIONS="--max_old_space_size=4096"
    nx reset
    nx clear-cache
    nx build whiskey-wiz --configuration=production --skip-nx-cache
    if ($LASTEXITCODE -ne 0) { throw "build failed" }
} catch {
    Exit-WithError "Build failed: $_"
}

# Force deploy to Firebase
Write-Status "Deploying to Firebase..." "Yellow"
try {
    firebase deploy --force --only hosting
    if ($LASTEXITCODE -ne 0) { throw "deployment failed" }
} catch {
    Exit-WithError "Deployment failed: $_"
}

Write-Status "Forced deployment completed successfully!" "Green"
Write-Status "Please verify the changes at https://whiskeywiz2.web.app" "Green"