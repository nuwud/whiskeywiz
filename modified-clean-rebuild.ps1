# modified-clean-rebuild.ps1
Write-Host "Cleaning up..." -ForegroundColor Yellow
Remove-Item -Recurse -Force dist -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force .angular/cache -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force node_modules -ErrorAction SilentlyContinue

Write-Host "Installing dependencies..." -ForegroundColor Yellow
npm install

Write-Host "Clearing Nx cache..." -ForegroundColor Yellow
nx reset

Write-Host "Building project..." -ForegroundColor Yellow
nx build whiskey-wiz --configuration=production --skip-nx-cache

Write-Host "Deploying to Firebase..." -ForegroundColor Yellow
firebase deploy --only hosting --force

Write-Host "Deployment complete!" -ForegroundColor Green