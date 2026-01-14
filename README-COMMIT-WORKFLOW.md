# Automated Commit Workflow Guide

This guide explains how to use the automated commit system that includes chat logs and context documentation.

## 🎯 Quick Start

### Method 1: Interactive Quick Commit (Easiest)
```powershell
.\scripts\quick-commit.ps1
```
This will:
1. Prompt you for a commit message
2. Ask for a session description
3. Stage all changes
4. Create a commit log automatically
5. Commit and optionally push

### Method 2: Direct Commit with Parameters
```powershell
.\scripts\commit-with-log.ps1 "feat: Add user authentication" "Auth Implementation"
```

### Method 3: Using Git Aliases (Recommended for Speed)
Set up once:
```powershell
git config alias.clog '!powershell -File scripts/commit-with-log.ps1'
git config alias.qc '!powershell -File scripts/quick-commit.ps1'
```

Then use:
```bash
git qc                    # Quick interactive commit
git clog "message" "desc" # Direct commit with log
```

## 📁 What Gets Created

Each commit creates a structured log in `docs/commit-logs/`:

```
docs/
  commit-logs/
    commit-log-20260114-181945.md
    commit-log-20260114-192130.md
    ...
```

## 📝 Commit Log Structure

Each log contains:
- **Metadata**: Date, branch, commit message
- **Files Changed**: Modified, new, and deleted files
- **Context**: What was accomplished and why
- **Technical Details**: Technologies and patterns used
- **Next Steps**: Follow-up tasks

## 🔄 Typical Workflow

### 1. Make Changes
Edit your files as usual:
```powershell
# Work on your code
code app/components/new-feature.tsx
```

### 2. Review Changes
```powershell
git status
git diff
```

### 3. Commit with Context
```powershell
.\scripts\quick-commit.ps1
```

### 4. The Script Handles:
- ✅ Staging all changes
- ✅ Creating commit log with file list
- ✅ Committing with your message
- ✅ Optionally pushing to remote

## 🎨 Commit Message Conventions

Follow conventional commits:

```
feat: Add new feature
fix: Fix a bug
docs: Documentation changes
style: Code style changes (formatting)
refactor: Code refactoring
test: Add or update tests
chore: Maintenance tasks
perf: Performance improvements
```

Examples:
```powershell
# Feature
.\scripts\commit-with-log.ps1 "feat: Add payment integration" "Stripe Setup"

# Bug fix
.\scripts\commit-with-log.ps1 "fix: Resolve navigation menu bug" "UI Bug Fix"

# Documentation
.\scripts\commit-with-log.ps1 "docs: Update API documentation" "API Docs"

# Multiple features in one session
.\scripts\commit-with-log.ps1 "feat: Add auth + dashboard" "User Management"
```

## 📚 Best Practices

### 1. Commit Frequently
- Commit after completing each logical unit of work
- Don't wait until end of day
- Smaller, focused commits are better

### 2. Descriptive Messages
```powershell
# ✅ Good
"feat: Add user authentication with JWT tokens"

# ❌ Bad
"update stuff"
```

### 3. Edit Commit Logs
After the log is created, you can edit it to add:
- Detailed explanations
- Design decisions
- Links to resources
- Screenshots or diagrams

### 4. Use Session Descriptions
Group related commits:
```powershell
# Morning session
"feat: Add login form" → "Auth Implementation"

# Afternoon session  
"feat: Add JWT validation" → "Auth Implementation"

# Next day
"test: Add auth tests" → "Auth Testing"
```

## 🔍 Viewing Commit History

### View all commit logs
```powershell
Get-ChildItem docs/commit-logs/ | Sort-Object LastWriteTime -Descending
```

### View latest log
```powershell
Get-Content (Get-ChildItem docs/commit-logs/ | Sort-Object LastWriteTime -Descending | Select-Object -First 1).FullName
```

### Search logs
```powershell
Get-ChildItem docs/commit-logs/ | Select-String "authentication"
```

## 🔧 Troubleshooting

### Script won't run
```powershell
# Enable script execution
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Commit log not created
- Check if `docs/commit-logs/` directory exists
- Ensure you have write permissions
- Check PowerShell version (requires 5.0+)

### Push fails
- Ensure remote is configured: `git remote -v`
- Check credentials: `git config user.name` and `git config user.email`
- Try manual push: `git push origin main`

## 🎯 Advanced Usage

### Custom Log Template
Edit `.github/COMMIT_TEMPLATE.md` to customize the log structure.

### Pre-commit Hooks
Add validation before commits:
```powershell
# .git/hooks/pre-commit
#!/bin/sh
npm run lint
npm run test
```

### Integration with IDEs
VS Code task (`.vscode/tasks.json`):
```json
{
  "version": "2.0.0",
  "tasks": [
    {
      "label": "Quick Commit",
      "type": "shell",
      "command": ".\\scripts\\quick-commit.ps1",
      "problemMatcher": []
    }
  ]
}
```

## 📊 Monthly Review

Generate monthly summary:
```powershell
# Get all commits from current month
$Month = (Get-Date).ToString("yyyyMM")
Get-ChildItem "docs/commit-logs/commit-log-$Month*.md"
```

## 🚀 Automation Tips

### Git Aliases
```bash
# Add to ~/.gitconfig or use git config
[alias]
    qc = !powershell -File scripts/quick-commit.ps1
    clog = !powershell -File scripts/commit-with-log.ps1
    ac = !git add . && powershell -File scripts/quick-commit.ps1
```

### VS Code Shortcuts
Add to `keybindings.json`:
```json
{
  "key": "ctrl+shift+c",
  "command": "workbench.action.tasks.runTask",
  "args": "Quick Commit"
}
```

## 📖 Examples

### Example 1: Feature Development
```powershell
# Start work
git checkout -b feature/user-profile

# Make changes
# ... code ...

# Commit with context
.\scripts\commit-with-log.ps1 "feat: Add user profile page" "Profile Feature"

# Continue work
# ... more code ...

# Another commit
.\scripts\commit-with-log.ps1 "feat: Add profile edit functionality" "Profile Feature"

# Push all changes
git push origin feature/user-profile
```

### Example 2: Bug Fix
```powershell
# Quick commit for urgent fix
.\scripts\quick-commit.ps1
# Enter: "fix: Resolve payment processing error"
# Enter: "Critical Bug Fix"
```

### Example 3: Daily Standup Reference
```powershell
# Show what you worked on yesterday
$Yesterday = (Get-Date).AddDays(-1).ToString("yyyyMMdd")
Get-ChildItem "docs/commit-logs/commit-log-$Yesterday*.md" | ForEach-Object {
    Write-Host "`n=== $($_.Name) ===" -ForegroundColor Cyan
    Get-Content $_.FullName | Select-Object -First 10
}
```

## 🎓 Learning Resources

- [Conventional Commits](https://www.conventionalcommits.org/)
- [Git Best Practices](https://git-scm.com/book/en/v2)
- [Semantic Versioning](https://semver.org/)

---

**Questions?** Check the commit logs in `docs/commit-logs/` for examples of how others have used this system!
