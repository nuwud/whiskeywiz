# Path to your project
$projectRoot = "C:\Users\Nuwud\whiskey-wiz"
$scriptFile = "reset.ps1"

# Step 1: Remove old files if they exist, but exclude this script
Write-Host "Cleaning up old files, but keeping $scriptFile..."
Get-ChildItem -Path $projectRoot -Recurse | Where-Object { $_.Name -ne $scriptFile } | Remove-Item -Recurse -Force

# Step 2: Ensure necessary folders and files exist
Write-Host "Creating necessary folders and files..."

# Create src and public directories
$srcDir = "$projectRoot\src"
$publicDir = "$projectRoot\public"
$environmentsDir = "$srcDir\environments"

New-Item -ItemType Directory -Force -Path $srcDir
New-Item -ItemType Directory -Force -Path $publicDir
New-Item -ItemType Directory -Force -Path $environmentsDir

# Add environment files
Write-Host "Adding environment files..."
@"
export const environment = {
  production: false,
  firebaseConfig: {
    apiKey: "YOUR_API_KEY",
    authDomain: "whiskey-wiz.firebaseapp.com",
    projectId: "whiskey-wiz",
    storageBucket: "whiskey-wiz.appspot.com",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID",
    measurementId: "YOUR_MEASUREMENT_ID"
  }
};
"@ | Out-File "$environmentsDir\environment.ts" -Force

@"
export const environment = {
  production: true,
  firebaseConfig: {
    apiKey: "YOUR_API_KEY",
    authDomain: "whiskey-wiz.firebaseapp.com",
    projectId: "whiskey-wiz",
    storageBucket: "whiskey-wiz.appspot.com",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID",
    measurementId: "YOUR_MEASUREMENT_ID"
  }
};
"@ | Out-File "$environmentsDir\environment.prod.ts" -Force

# Step 3: Initialize Angular project and Firebase setup
Write-Host "Initializing new Angular project..."
cd $projectRoot
npx -p @angular/cli ng new whiskey-wiz --style=scss --routing --skip-git --directory ./ --skip-install
npm install
npm install firebase @angular/fire --save

# Step 4: Add Firebase and SSR support
Write-Host "Setting up Firebase and SSR..."
ng add @angular/fire
ng add @nguniversal/express-engine --skip-confirmation

# Add SSR scripts to package.json
$packageJson = Get-Content -Path "$projectRoot\package.json" -Raw | ConvertFrom-Json
$packageJson.scripts["build:ssr"] = "ng build && ng run whiskey-wiz:server"
$packageJson.scripts["serve:ssr"] = "node dist/whiskey-wiz/server/main.js"
$packageJson.scripts["dev:ssr"] = "ng run whiskey-wiz:serve-ssr"
$packageJson.scripts["prerender"] = "ng run whiskey-wiz:prerender"
$packageJson | ConvertTo-Json -Compress | Set-Content "$projectRoot\package.json"

# Step 5: Commit the new project to Git and push to GitHub
Write-Host "Committing changes and creating new branch..."
git pull origin fresh-start-20240906 --rebase
git add .
git commit -m "Initial commit with Angular SSR and Firebase"
git push -u origin fresh-start-20240906

# Step 6: Serve the Angular app with SSR
Write-Host "Serving the new Angular app..."
npm run dev:ssr
