# fixed-deploy.ps1

function Write-Status {
    param(
        [string]$Message,
        [string]$Color = "White"
    )
    Write-Host $Message -ForegroundColor $Color
}

function Wait-FileUnlock {
    param(
        [string]$Path,
        [int]$Attempts = 5,
        [int]$SleepSeconds = 2
    )
    for ($i = 0; $i -lt $Attempts; $i++) {
        try {
            $fileHandle = [System.IO.File]::Open($Path, 'Open', 'Read', 'None')
            $fileHandle.Close()
            $fileHandle.Dispose()
            return $true
        }
        catch {
            Write-Status "Waiting for file to unlock: $Path" "Yellow"
            Start-Sleep -Seconds $SleepSeconds
        }
    }
    return $false
}

function Kill-ProcessesByName {
    param([string[]]$ProcessNames)
    foreach ($procName in $ProcessNames) {
        Get-Process | Where-Object { $_.ProcessName -like "*$procName*" } | ForEach-Object {
            try {
                $_.Kill()
                $_.WaitForExit()
                Write-Status "Killed process: $($_.ProcessName)" "Gray"
            }
            catch {
                Write-Status "Could not kill process: $($_.ProcessName)" "Red"
            }
        }
    }
}

# Start deployment
Write-Status "Starting enhanced deployment process..." "Yellow"

# Kill all related processes
Write-Status "Stopping all related processes..." "Yellow"
Kill-ProcessesByName @("ng", "node", "nx")

# Clean up with retry logic
Write-Status "Cleaning up previous builds..." "Yellow"
$pathsToClean = @(
    ".angular",
    "dist",
    ".firebase",
    "node_modules\@nx\.nx-win32-x64-msvc*"
)

foreach ($path in $pathsToClean) {
    if (Test-Path $path) {
        Write-Status "Removing $path..." "Gray"
        Remove-Item -Path $path -Recurse -Force -ErrorAction SilentlyContinue
        Start-Sleep -Seconds 2
    }
}

# Clear npm cache
Write-Status "Clearing npm cache..." "Yellow"
npm cache clean --force

# Clean install dependencies with retry logic
Write-Status "Installing dependencies..." "Yellow"
$maxRetries = 3
$retryCount = 0
$success = $false

while (-not $success -and $retryCount -lt $maxRetries) {
    try {
        $retryCount++
        Write-Status "Attempt $retryCount of $maxRetries..." "Yellow"
        
        # Remove package-lock and node_modules
        Remove-Item -Path "package-lock.json" -Force -ErrorAction SilentlyContinue
        if (Test-Path "node_modules") {
            Remove-Item -Path "node_modules" -Recurse -Force -ErrorAction SilentlyContinue
        }
        
        # Fresh install
        npm install
        if ($LASTEXITCODE -eq 0) {
            $success = $true
        }
        else {
            throw "npm install failed with exit code $LASTEXITCODE"
        }
    }
    catch {
        Write-Status "Attempt $retryCount failed: $_" "Red"
        if ($retryCount -lt $maxRetries) {
            Write-Status "Waiting before retry..." "Yellow"
            Start-Sleep -Seconds 10
        }
    }
}

if (-not $success) {
    Write-Status "Failed to install dependencies after $maxRetries attempts" "Red"
    exit 1
}

# Build project
Write-Status "Building project..." "Yellow"
try {
    $env:NODE_OPTIONS="--max_old_space_size=4096"
    npx nx build whiskey-wiz --configuration=production
    if ($LASTEXITCODE -ne 0) { throw "Build failed" }
}
catch {
    Write-Status "Build failed: $_" "Red"
    exit 1
}

# Deploy to Firebase
Write-Status "Deploying to Firebase..." "Yellow"
try {
    firebase deploy --force
    if ($LASTEXITCODE -ne 0) { throw "Deployment failed" }
}
catch {
    Write-Status "Deployment failed: $_" "Red"
    exit 1
}

Write-Status "Deployment completed successfully!" "Green"
Write-Status "Please verify the changes at https://whiskeywiz2.web.app" "Green"