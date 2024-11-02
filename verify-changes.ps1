# verify-changes.ps1

function Test-FileContent {
    param(
        [string]$FilePath,
        [string]$SearchString
    )
    
    if (Test-Path $FilePath) {
        $content = Get-Content $FilePath -Raw
        return $content.Contains($SearchString)
    }
    return $false
}

Write-Host "Verifying build files..." -ForegroundColor Yellow

# Check if build directory exists
if (-not (Test-Path "dist/whiskey-wiz")) {
    Write-Host "Build directory not found!" -ForegroundColor Red
    exit 1
}

# Check specific files
$adminComponent = "dist/whiskey-wiz/main.js"
if (Test-Path $adminComponent) {
    Write-Host "Found main.js - Checking content..." -ForegroundColor Green
    $content = Get-Content $adminComponent -Raw
    
    # Add specific strings you expect to find in your built files
    $expectedStrings = @(
        ".sidebar",
        ".main-content",
        ".samples-container"
    )

    foreach ($str in $expectedStrings) {
        if ($content.Contains($str)) {
            Write-Host "Found '$str' in build files" -ForegroundColor Green
        } else {
            Write-Host "WARNING: Could not find '$str' in build files" -ForegroundColor Red
        }
    }
} else {
    Write-Host "main.js not found!" -ForegroundColor Red
}