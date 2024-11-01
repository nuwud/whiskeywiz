# clean-rebuild.ps1
Write-Host "Cleaning up old builds and dependencies..." -ForegroundColor Yellow
Remove-Item -Recurse -Force dist -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force node_modules -ErrorAction SilentlyContinue

Write-Host "Cleaning npm cache..." -ForegroundColor Yellow
npm cache clean --force

Write-Host "Reinstalling Angular CLI..." -ForegroundColor Yellow
npm install -g @angular/cli

Write-Host "Installing dependencies..." -ForegroundColor Yellow
npm install

Write-Host "Resetting Nx cache..." -ForegroundColor Yellow
nx reset

Write-Host "Building project..." -ForegroundColor Yellow
nx build whiskey-wiz --configuration=production --skip-nx-cache

Write-Host "Deploying to Firebase..." -ForegroundColor Yellow
firebase deploy --only hosting

Write-Host "Deployment complete!" -ForegroundColor Green