# deploy.ps1

# Enable strict mode
Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

# Configure Node.js settings to prevent memory leaks
$env:NODE_OPTIONS = "--max-old-space-size=4096 --max-http-header-size=16384"
$env:UV_THREADPOOL_SIZE = "32"

# Utility Functions
function Write-ColorOutput($ForegroundColor) {
    $fc = $host.UI.RawUI.ForegroundColor
    $host.UI.RawUI.ForegroundColor = $ForegroundColor
    if ($args) {
        Write-Output $args
    }
    $host.UI.RawUI.ForegroundColor = $fc
}

...