# PowerShell Script: Automated Commit with Chat Log
# Usage: .\scripts\commit-with-log.ps1 "Your commit message" "Optional: session description"

param(
    [Parameter(Mandatory=$true)]
    [string]$CommitMessage,
    
    [Parameter(Mandatory=$false)]
    [string]$SessionDescription = "Development Session"
)

# Colors for output
$InfoColor = "Cyan"
$SuccessColor = "Green"
$WarningColor = "Yellow"
$ErrorColor = "Red"

Write-Host "`n📝 Starting Automated Commit with Chat Log...`n" -ForegroundColor $InfoColor

# Get current date and branch
$CurrentDate = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
$CurrentBranch = git rev-parse --abbrev-ref HEAD

# Create logs directory if it doesn't exist
$LogsDir = "docs/commit-logs"
if (-not (Test-Path $LogsDir)) {
    New-Item -ItemType Directory -Path $LogsDir -Force | Out-Null
    Write-Host "✅ Created logs directory: $LogsDir" -ForegroundColor $SuccessColor
}

# Generate log filename
$Timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
$LogFileName = "$LogsDir/commit-log-$Timestamp.md"

# Get git status information
$ModifiedFiles = git diff --name-only --cached
$UntrackedFiles = git ls-files --others --exclude-standard
$DeletedFiles = git diff --name-only --cached --diff-filter=D

# Create the commit log
$LogContent = @"
# Commit Log: $SessionDescription

**Date**: $CurrentDate
**Branch**: $CurrentBranch
**Commit Message**: $CommitMessage

---

## Files Changed

### Staged Files
$(if ($ModifiedFiles) { ($ModifiedFiles -split "`n" | ForEach-Object { "- $_" }) -join "`n" } else { "- None" })

### Untracked Files
$(if ($UntrackedFiles) { ($UntrackedFiles -split "`n" | ForEach-Object { "- $_" }) -join "`n" } else { "- None" })

### Deleted Files
$(if ($DeletedFiles) { ($DeletedFiles -split "`n" | ForEach-Object { "- $_" }) -join "`n" } else { "- None" })

---

## Context

### What was accomplished
[Automatically generated - edit if needed]
$CommitMessage

### Technical details
- **Files modified**: $(($ModifiedFiles -split "`n").Count)
- **New files**: $(($UntrackedFiles -split "`n").Count)
- **Deleted files**: $(($DeletedFiles -split "`n").Count)

### Chat/Development Notes
[Add any relevant discussion points or decisions made during this session]

- 
- 

### Next Steps
[What should be done next]

- 
- 

---

## Git Information

``````bash
# To view this commit later:
git show HEAD

# To view the diff:
git diff HEAD~1 HEAD
``````

---

*Generated automatically by commit-with-log.ps1*
*Last updated: $CurrentDate*
"@

# Write the log file
$LogContent | Out-File -FilePath $LogFileName -Encoding UTF8
Write-Host "✅ Created commit log: $LogFileName" -ForegroundColor $SuccessColor

# Stage the log file
git add $LogFileName
Write-Host "✅ Staged commit log" -ForegroundColor $SuccessColor

# Show what will be committed
Write-Host "`n📋 Files to be committed:" -ForegroundColor $InfoColor
git diff --name-only --cached

# Commit
Write-Host "`n🚀 Creating commit..." -ForegroundColor $InfoColor
git commit -m "$CommitMessage"

if ($LASTEXITCODE -eq 0) {
    Write-Host "`n✅ Commit successful!" -ForegroundColor $SuccessColor
    
    # Show the commit
    Write-Host "`n📊 Commit details:" -ForegroundColor $InfoColor
    git log -1 --stat
    
    # Ask if user wants to push
    Write-Host "`n" -NoNewline
    $Response = Read-Host "Would you like to push to origin? (y/n)"
    
    if ($Response -eq "y" -or $Response -eq "Y") {
        Write-Host "`n📤 Pushing to origin/$CurrentBranch..." -ForegroundColor $InfoColor
        git push origin $CurrentBranch
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✅ Push successful!" -ForegroundColor $SuccessColor
        } else {
            Write-Host "❌ Push failed. You can push manually later." -ForegroundColor $ErrorColor
        }
    }
    
    Write-Host "`n✨ All done! Your commit log is at: $LogFileName`n" -ForegroundColor $SuccessColor
} else {
    Write-Host "`n❌ Commit failed!" -ForegroundColor $ErrorColor
    exit 1
}
