# deploy.ps1

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
Write-Status "Starting deployment process..." "Yellow"

# Function to safely remove directory
function Remove-DirectoryIfExists {
    param([string]$Path)
    if (Test-Path $Path) {
        Write-Status "Removing $Path..." "Gray"
        Remove-Item -Path $Path -Recurse -Force -ErrorAction SilentlyContinue
    }
}

# Clean up
Write-Status "Cleaning up previous builds..." "Yellow"
Remove-DirectoryIfExists ".angular/cache"
Remove-DirectoryIfExists "dist"

# Install dependencies
Write-Status "Installing dependencies..." "Yellow"
try {
    npm install @angular/forms @angular/elements --save
    if ($LASTEXITCODE -ne 0) { throw "npm install failed" }
} catch {
    Exit-WithError "Failed to install dependencies: $_"
}

# Build project
Write-Status "Building project..." "Yellow"
try {
    npx nx build whiskey-wiz --configuration=production
    if ($LASTEXITCODE -ne 0) { throw "build failed" }
} catch {
    Exit-WithError "Build failed: $_"
}

# Deploy to Firebase
Write-Status "Deploying to Firebase..." "Yellow"
try {
    firebase deploy --force
    if ($LASTEXITCODE -ne 0) { throw "deployment failed" }
} catch {
    Exit-WithError "Deployment failed: $_"
}

Write-Status "Deployment completed successfully!" "Green"