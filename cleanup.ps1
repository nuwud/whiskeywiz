# PowerShell script to forcefully remove WhiskeyWiz project directories

$baseDir = "C:\Users\nuwud\whiskeywiz"
$directoriesToRemove = @(
    "whiskeywiz-angular", 
    "whiskey-wiz-react-new", 
    "whiskeywiz-projects"
)

foreach ($dir in $directoriesToRemove) {
    $fullPath = Join-Path $baseDir $dir
    if (Test-Path $fullPath) {
        try {
            Remove-Item -Path $fullPath -Recurse -Force -ErrorAction Stop
            Write-Host "Successfully removed $dir"
        }
        catch {
            Write-Host "Error removing $dir : $_"
        }
    }
}

Write-Host "Cleanup process completed."