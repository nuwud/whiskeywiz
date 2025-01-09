# PowerShell script to help add GitHub secrets

# Firebase CI Token (from firebase login:ci)
$FIREBASE_TOKEN = "1//06mYMoHsl9skQCgYIARAAGAYSNwF-L9IrvWRF567KxN4FkZzRVPOYUB9GBi1hQf84pb540gsW6aqSFgGdadtIiaYZOTgnlbpB588"

# Firebase Configuration
$FIREBASE_SECRETS = @{
    "FIREBASE_TOKEN" = $FIREBASE_TOKEN
    "FIREBASE_API_KEY" = "AIzaSyCqZMaGpJGf5veYgTXmytg1bLerva-of0U"
    "FIREBASE_AUTH_DOMAIN" = "whiskeywiz2.firebaseapp.com"
    "FIREBASE_PROJECT_ID" = "whiskeywiz2"
    "FIREBASE_STORAGE_BUCKET" = "whiskeywiz2.appspot.com"
    "FIREBASE_MESSAGING_SENDER_ID" = "555320797929"
    "FIREBASE_APP_ID" = "1:555320797929:web:0d4b062d7f2ab330fc1e78"
    "FIREBASE_MEASUREMENT_ID" = "G-SK0TJJEPF5"
}

# GitHub CLI command to add secrets
Write-Host "Adding GitHub Secrets..."
foreach ($secret in $FIREBASE_SECRETS.GetEnumerator()) {
    gh secret set $secret.Key -b $secret.Value -R nuwud/whiskey-wiz-react
    Write-Host "Added secret: $($secret.Key)"
}

Write-Host "All secrets have been added to the GitHub repository."
Write-Host "Please verify in the GitHub repository settings."