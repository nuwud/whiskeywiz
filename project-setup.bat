@echo off
setlocal enabledelayedexpansion

cd /d "%~dp0"

echo Current Node.js Version:
node --version

echo Current npm Version:
npm --version

echo Cleaning npm cache...
npm cache clean --force

echo Removing old dependencies...
rmdir /s /q node_modules
del package-lock.json

echo Uninstalling global packages...
npm uninstall -g @angular/cli @nrwl/cli nx firebase-tools

echo Installing global packages...
npm install -g @angular/cli@latest @nrwl/cli nx firebase-tools

echo Installing project dependencies...
npm install

echo Verifying installations:
echo Node.js Version:
node --version

echo npm Version:
npm --version

echo Angular CLI Version:
ng version

echo Nx Version:
nx --version

echo Firebase Tools Version:
firebase --version

echo Project setup complete!
pause
