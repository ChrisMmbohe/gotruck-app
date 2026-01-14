# Quick Commit Script - Simplified version
# Usage: .\scripts\quick-commit.ps1

Write-Host "`n🚀 Quick Commit Wizard`n" -ForegroundColor Cyan

# Get commit message
$CommitMsg = Read-Host "Commit message"

if ([string]::IsNullOrWhiteSpace($CommitMsg)) {
    Write-Host "❌ Commit message cannot be empty!" -ForegroundColor Red
    exit 1
}

# Get session description
$Session = Read-Host "Session description (press Enter for 'Development Session')"
if ([string]::IsNullOrWhiteSpace($Session)) {
    $Session = "Development Session"
}

# Stage all changes
Write-Host "`n📦 Staging all changes..." -ForegroundColor Yellow
git add .

# Run the main commit script
& "$PSScriptRoot\commit-with-log.ps1" -CommitMessage $CommitMsg -SessionDescription $Session
