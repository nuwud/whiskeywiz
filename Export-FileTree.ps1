param (
    [string]$Path = ".",
    [string]$OutputFile = "filetree.txt",
    [string[]]$ExcludeDirs = @("node_modules", ".vscode", ".git", "dist")
)

function Export-FileTree {
    param (
        [string]$DirPath,
        [string]$Indent = ""
    )

    # Get all the child items (files and directories)
    $items = Get-ChildItem -Path $DirPath

    # Loop through each item and handle directories and files
    foreach ($item in $items) {
        # Check if the item is a directory and should be excluded
        if ($item.PSIsContainer -and $ExcludeDirs -contains $item.Name) {
            # Skip this directory if it's in the exclusion list
            continue
        }

        # Write the item (directory or file) to the output file
        "$Indent|-- $($item.Name)" | Out-File -Append -FilePath $OutputFile

        # If the item is a directory, recursively call Export-FileTree
        if ($item.PSIsContainer) {
            Export-FileTree -DirPath $item.FullName -Indent ("$Indent  ") 
        }
    }
}

# Clear the output file if it exists, or create a new one
Clear-Content -Path $OutputFile -ErrorAction SilentlyContinue
New-Item -ItemType File -Path $OutputFile -Force

# Start exporting the file tree from the specified directory
Export-FileTree -DirPath $Path

# Notify the user where the file tree has been saved
Write-Host "File tree exported to $OutputFile"
