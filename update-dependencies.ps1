$packages = @(
    "@angular/animations",
    "@angular/common",
    "@angular/compiler",
    "@angular/core",
    "@angular/elements",
    "@angular/forms",
    "@angular/platform-browser",
    "@angular/platform-browser-dynamic",
    "@angular/router",
    "@angular/cli",
    "@angular/compiler-cli",
    "@angular-devkit/build-angular"
)

foreach ($package in $packages) {
    npm install $package@17.3.12
}

npm install @angular/fire@latest
npm install rxjs@latest
npm install zone.js@latest
npm install tslib@latest
npm install typescript@5.2.2