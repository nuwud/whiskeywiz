# Clean script for Firebase deployment
$deployScript = @"
# Clean up
Write-Host "Cleaning up..." -ForegroundColor Yellow
Remove-Item -Recurse -Force dist -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force .angular -ErrorAction SilentlyContinue

# Clear caches
Write-Host "Clearing caches..." -ForegroundColor Yellow
npm cache clean --force
nx reset

# Fresh install and build
Write-Host "Installing dependencies..." -ForegroundColor Yellow
npm install

# Production build
Write-Host "Building for production..." -ForegroundColor Yellow
ng build --configuration=production

# Deploy
Write-Host "Deploying to Firebase..." -ForegroundColor Yellow
firebase deploy

# Clear browser cache notification
Write-Host "`nDeployment complete!" -ForegroundColor Green
Write-Host "IMPORTANT: Clear your browser cache or use incognito mode to see updates." -ForegroundColor Yellow
"@