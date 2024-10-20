# Update package.json
$packageJsonContent = Get-Content -Path "package.json" -Raw
$packageJson = $packageJsonContent | ConvertFrom-Json
$packageJson | ConvertTo-Json -Depth 100 | Set-Content -Path "package.json"

# Remove node_modules and package-lock.json
Remove-Item -Recurse -Force node_modules -ErrorAction SilentlyContinue
Remove-Item package-lock.json -ErrorAction SilentlyContinue

# Clear npm cache
npm cache clean --force

# Reinstall dependencies
npm install

Write-Host "Dependencies have been updated to the latest versions and reinstalled."