# unlock-deploy.ps1

function Write-Status {
    param(
        [string]$Message,
        [string]$Color = "White"
    )
    Write-Host $Message -ForegroundColor $Color
}

# Stop all related processes
Write-Status "Stopping all related processes..." "Yellow"
Get-Process | Where-Object { $_.ProcessName -match 'node|ng|nx|npm|firebase|code|electron' } | ForEach-Object {
    try {
        $_.Kill()
        $_.WaitForExit()
    } catch {}
}

# Force close handle using handle64.exe (needs to be downloaded first)
Write-Status "Attempting to force close file handles..." "Yellow"
$handlePath = "C:\Tools\handle64.exe"  # Adjust path as needed
if (Test-Path $handlePath) {
    & $handlePath -accepteula -a -v "nx.win32-x64-msvc.node" 2>&1 | ForEach-Object {
        if ($_ -match '([A-F0-9]+):\s+Process\s+(\d+):.+nx\.win32-x64-msvc\.node') {
            $handle = $matches[1]
            $pid = $matches[2]
            & $handlePath -accepteula -c $handle -p $pid -y
        }
    }
}

# Remove problematic directories
Write-Status "Removing problematic directories..." "Yellow"
$pathsToRemove = @(
    "node_modules",
    ".angular",
    "dist",
    ".nx",
    ".firebase"
)

foreach ($path in $pathsToRemove) {
    if (Test-Path $path) {
        Write-Status "Removing $path..." "Gray"
        Remove-Item -Path $path -Recurse -Force -ErrorAction SilentlyContinue
        Start-Sleep -Seconds 2
    }
}

# Clear npm cache
Write-Status "Clearing npm cache..." "Yellow"
npm cache clean --force

# Install dependencies fresh
Write-Status "Installing dependencies..." "Yellow"
npm install --force

# Build and deploy
Write-Status "Building project..." "Yellow"
if ($LASTEXITCODE -eq 0) {
    $env:NODE_OPTIONS="--max_old_space_size=4096"
    npx nx build whiskey-wiz --configuration=production --skip-nx-cache
    
    if ($LASTEXITCODE -eq 0) {
        Write-Status "Deploying to Firebase..." "Yellow"
        firebase deploy --force
        
        if ($LASTEXITCODE -eq 0) {
            Write-Status "Deployment completed successfully!" "Green"
        } else {
            Write-Status "Firebase deployment failed" "Red"
        }
    } else {
        Write-Status "Build failed" "Red"
    }
} else {
    Write-Status "npm install failed" "Red"
}