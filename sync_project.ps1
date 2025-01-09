# WhiskeyWiz Project Synchronization Script

# Ensure we're in the correct directory
Set-Location C:\Users\nuwud\whiskeywiz

# Pull latest changes from remote repository
git fetch origin
git pull origin main

# Check for any uncommitted local changes
$localChanges = git status --porcelain

if ($localChanges) {
    Write-Host "Detected local changes. Committing and pushing..."
    
    # Stage all changes
    git add .
    
    # Commit with timestamp
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    git commit -m "Sync project changes at $timestamp"
    
    # Push to remote
    git push origin main
} else {
    Write-Host "No local changes detected. Repository is in sync."
}

# Verify synchronization
git status