# update-quarter-comments.ps1

# Function to get quarter name from file ID
function Get-QuarterName {
    param (
        [string]$quarterId
    )
    
    $month = [int]($quarterId.Substring(0, 2))
    $year = "20" + $quarterId.Substring(2, 2)
    
    $quarterNumber = [math]::Floor(($month - 1) / 3) + 1
    return "Q$quarterNumber $year"
}

# Get all quarter component files
$quarterFiles = Get-ChildItem -Path "C:\Users\Nuwud\whiskey-wiz\src\app\quarters" -Filter "*.component.ts" -Recurse |
    Where-Object { $_.Name -match '^\d{4}\.component\.ts$' }

foreach ($file in $quarterFiles) {
    # Extract quarter ID from filename
    $quarterId = $file.BaseName.Split('.')[0]
    $quarterName = Get-QuarterName $quarterId
    
    # Create the comment block
    $fileComment = "// $($file.Name)`n"
    $componentComment = @"
/** 
 * Whiskey Wiz Quarter Component - $quarterName 
 * 
 * Integration:
 * <whiskey-wiz-$quarterId></whiskey-wiz-$quarterId> 
 */

"@

    # Read the file content
    $content = Get-Content $file.FullName -Raw

    # Create backup
    Copy-Item -Path $file.FullName -Destination "$($file.FullName).bak" -Force

    # Add comments at the top and preserve everything else exactly as is
    $newContent = $fileComment + $componentComment + $content

    # Write the content back
    $newContent | Set-Content -Path $file.FullName -Force -NoNewline

    Write-Host "Updated $($file.Name) with integration instructions for $quarterName"
}

Write-Host "`nBackups of all modified files were created with .bak extension"