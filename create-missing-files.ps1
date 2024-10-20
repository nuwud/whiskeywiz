# Create main.ts
$mainContent = @"
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
"@

New-Item -Path "src\main.ts" -ItemType File -Force
Set-Content -Path "src\main.ts" -Value $mainContent

# Create polyfills.ts
$polyfillsContent = @"
/**
 * This file includes polyfills needed by Angular and is loaded before the app.
 * You can add your own extra polyfills to this file.
 *
 * This file is divided into 2 sections:
 *   1. Browser polyfills. These are applied before loading ZoneJS and are sorted by browsers.
 *   2. Application imports. Files imported after ZoneJS that should be loaded before your main
 *      file.
 *
 * The current setup is for so-called "evergreen" browsers; the last versions of browsers that
 * automatically update themselves. This includes recent versions of Safari, Chrome (including
 * Opera), Edge on the desktop, and iOS and Chrome on mobile.
 *
 * Learn more in https://angular.io/guide/browser-support
 */

/***************************************************************************************************
 * BROWSER POLYFILLS
 */

/**
 * By default, zone.js will patch all possible macroTask and DomEvents
 * user can disable parts of macroTask/DomEvents patch by setting following flags
 * because those flags need to be set before `zone.js` being loaded, and webpack
 * will put import in the top of bundle, so user need to create a separate file
 * in this directory (for example: zone-flags.ts), and put the following flags
 * into that file, and then add the following code before importing zone.js.
 * import './zone-flags';
 *
 * The flags allowed in zone-flags.ts are listed here.
 *
 * The following flags will work for all browsers.
 *
 * (window as any).__Zone_disable_requestAnimationFrame = true; // disable patch requestAnimationFrame
 * (window as any).__Zone_disable_on_property = true; // disable patch onProperty such as onclick
 * (window as any).__zone_symbol__UNPATCHED_EVENTS = ['scroll', 'mousemove']; // disable patch specified eventNames
 *
 *  in IE/Edge developer tools, the addEventListener will also be wrapped by zone.js
 *  with the following flag, it will bypass `zone.js` patch for IE/Edge
 *
 *  (window as any).__Zone_enable_cross_context_check = true;
 *
 */

/***************************************************************************************************
 * Zone JS is required by default for Angular itself.
 */
import 'zone.js';  // Included with Angular CLI.

/***************************************************************************************************
 * APPLICATION IMPORTS
 */
"@

New-Item -Path "src\polyfills.ts" -ItemType File -Force
Set-Content -Path "src\polyfills.ts" -Value $polyfillsContent

# Update angular.json
$angularJson = Get-Content -Path "angular.json" -Raw | ConvertFrom-Json

# Ensure the "projects" property exists
if (-not $angularJson.projects) {
    $angularJson | Add-Member -MemberType NoteProperty -Name "projects" -Value @{}
}

# Ensure the "whiskey-wiz" project exists
if (-not $angularJson.projects."whiskey-wiz") {
    $angularJson.projects | Add-Member -MemberType NoteProperty -Name "whiskey-wiz" -Value @{
        "projectType" = "application"
        "root" = ""
        "sourceRoot" = "src"
        "architect" = @{
            "build" = @{
                "builder" = "@angular-devkit/build-angular:browser"
                "options" = @{
                    "outputPath" = "dist/whiskey-wiz"
                    "index" = "src/index.html"
                    "main" = "src/main.ts"
                    "polyfills" = "src/polyfills.ts"
                    "tsConfig" = "tsconfig.app.json"
                }
            }
            "serve" = @{
                "builder" = "@angular-devkit/build-angular:dev-server"
                "options" = @{
                    "browserTarget" = "whiskey-wiz:build"
                }
            }
        }
    }
}

$angularJson | ConvertTo-Json -Depth 10 | Set-Content -Path "angular.json"

Write-Host "Missing files have been created and angular.json has been updated."