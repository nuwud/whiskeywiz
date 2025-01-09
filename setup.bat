@echo off
echo Checking and updating development environment for WhiskeyWiz

REM Check Node.js version
node --version
if errorlevel 1 (
    echo Node.js is not installed. Please install Node.js 20.9.0 or later.
    exit /b 1
)

REM Uninstall global packages to prevent conflicts
npm uninstall -g @angular/cli @nrwl/cli nx

REM Install global packages
npm install -g @angular/cli@latest @nrwl/cli nx firebase-tools

REM Clean install of project dependencies
cd "%~dp0"
npm ci

REM Verify installations
echo Checking Angular CLI version:
ng version

echo Checking Nx version:
nx --version

echo Checking Firebase Tools version:
firebase --version

echo Setup complete. You can now run npm start or nx serve.
pause