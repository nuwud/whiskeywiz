# PowerShell script to create quarterly folders and files

# Function to create a quarter component
function Create-QuarterComponent {
    param (
        [string]$quarterName,
        [string]$year
    )

    $folderPath = "src\app\quarters\$quarterName"
    $componentName = "$quarterName"

    # Create folder
    New-Item -ItemType Directory -Path $folderPath -Force | Out-Null

    # Create component file
    $componentContent = @"
import { Component } from '@angular/core';

@Component({
  selector: 'app-$quarterName',
  template: '<app-game quarterId="$quarterName"></app-game>'
})
export class $(($componentName | Select-Object @{n='Name';e={$_.Name.ToUpper()}}).Name)Component {}
"@

    Set-Content -Path "$folderPath\$quarterName.component.ts" -Value $componentContent
}

# Starting point
$startYear = 22
$quarters = @("01", "03", "06", "09", "12")

# Calculate the number of quarters to generate
$currentYear = 24
$currentQuarter = 3  # 0924 is the 3rd quarter of 2024
$yearsToGenerate = 2  # Generate for 2 more years

# Generate quarters
for ($year = $startYear; $year -le ($currentYear + $yearsToGenerate); $year++) {
    foreach ($quarter in $quarters) {
        $quarterName = "$quarter$year"
        Create-QuarterComponent -quarterName $quarterName -year $year
        
        # Stop if we've reached two years beyond the current quarter
        if ($year -eq ($currentYear + $yearsToGenerate) -and $quarter -eq "09") {
            break
        }
    }
}

Write-Host "Quarter components have been generated successfully!"

# Remove old incorrect folders
$oldFolders = Get-ChildItem -Path "src\app\quarters" -Directory | Where-Object { $_.Name -notmatch "^\d{4}$" }
$oldFolders | ForEach-Object {
    Remove-Item $_.FullName -Recurse -Force
    Write-Host "Removed old folder: $($_.Name)"
}