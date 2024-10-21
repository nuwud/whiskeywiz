$angularJson = Get-Content -Raw -Path .\angular.json | ConvertFrom-Json

$angularJson.projects.'whiskey-wiz'.architect | Add-Member -NotePropertyName "serve" -NotePropertyValue @{
    "builder" = "@angular-devkit/build-angular:dev-server"
    "options" = @{
        "browserTarget" = "whiskey-wiz:build"
    }
    "configurations" = @{
        "production" = @{
            "browserTarget" = "whiskey-wiz:build:production"
        }
    }
}

$angularJson.projects.'whiskey-wiz'.architect | Add-Member -NotePropertyName "extract-i18n" -NotePropertyValue @{
    "builder" = "@angular-devkit/build-angular:extract-i18n"
    "options" = @{
        "browserTarget" = "whiskey-wiz:build"
    }
}

$angularJson.projects.'whiskey-wiz'.architect | Add-Member -NotePropertyName "test" -NotePropertyValue @{
    "builder" = "@angular-devkit/build-angular:karma"
    "options" = @{
        "main" = "src/test.ts"
        "polyfills" = "src/polyfills.ts"
        "tsConfig" = "tsconfig.spec.json"
        "karmaConfig" = "karma.conf.js"
        "assets" = @("src/favicon.ico", "src/assets")
        "styles" = @("src/styles.css")
        "scripts" = @()
    }
}

$angularJson | ConvertTo-Json -Depth 10 | Set-Content -Path .\angular.json