# Git & Version Control Guidelines

## Branch Strategy

### Main Branches
- **`main`** - Production-ready code
- **`develop`** - Development branch (if used)

### Feature Branches
Create feature branches from `main` or `develop`:
```bash
git checkout -b feature/short-link-creation
git checkout -b feature/link-analytics
git checkout -b feature/user-dashboard
```

### Other Branch Types
```bash
# Bug fixes
git checkout -b fix/link-validation-error

# Hotfixes (urgent production fixes)
git checkout -b hotfix/database-connection

# Refactoring
git checkout -b refactor/database-queries

# Documentation
git checkout -b docs/api-documentation
```

## Branch Naming Convention

### Format
```
<type>/<description>
```

### Types
- `feature/` - New features
- `fix/` - Bug fixes
- `hotfix/` - Urgent production fixes
- `refactor/` - Code refactoring
- `docs/` - Documentation updates
- `test/` - Adding or updating tests
- `chore/` - Maintenance tasks

### Examples
```
feature/qr-code-generation
fix/url-validation
hotfix/clerk-auth-error
refactor/database-schema
docs/setup-instructions
test/link-creation-tests
chore/update-dependencies
```

## Commit Message Convention

### Format
```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types
- `feat` - New feature
- `fix` - Bug fix
- `docs` - Documentation changes
- `style` - Code style changes (formatting, no code change)
- `refactor` - Code refactoring
- `perf` - Performance improvements
- `test` - Adding or updating tests
- `chore` - Maintenance tasks
- `build` - Build system changes
- `ci` - CI/CD changes

### Examples
```bash
# Feature
git commit -m "feat(links): add short link creation functionality"

# Bug fix
git commit -m "fix(validation): handle invalid URL format"

# With body
git commit -m "feat(analytics): add click tracking

- Track IP address and user agent
- Store country and city data
- Create clicks table schema"

# Breaking change
git commit -m "refactor(db)!: update schema to use UUID

BREAKING CHANGE: Link IDs changed from auto-increment to UUID"

# Multiple scopes
git commit -m "feat(links,analytics): add link statistics dashboard"
```

### Scopes
Common scopes for this project:
- `links` - Link management functionality
- `auth` - Authentication
- `analytics` - Analytics and tracking
- `ui` - UI components
- `db` - Database related
- `api` - API endpoints
- `config` - Configuration changes

### Commit Message Best Practices

#### Do's
✅ Use present tense ("add feature" not "added feature")
✅ Use imperative mood ("move cursor to..." not "moves cursor to...")
✅ Keep subject line under 72 characters
✅ Capitalize the subject line
✅ Don't end subject with a period
✅ Separate subject from body with blank line
✅ Use body to explain *what* and *why* vs. *how*
✅ Reference issues/PRs in footer

#### Don'ts
❌ Don't use vague messages like "fix bug" or "update code"
❌ Don't commit unrelated changes together
❌ Don't commit debugging code or console.logs
❌ Don't commit sensitive data (API keys, passwords)

### Example Commit Messages
```bash
# Good ✅
git commit -m "feat(links): implement custom short code generation

- Add validation for custom short codes
- Ensure uniqueness in database
- Add error handling for duplicates

Closes #123"

# Bad ❌
git commit -m "fixed stuff"
git commit -m "Updated files"
git commit -m "WIP"
```

## Git Workflow

### Starting a New Feature
```bash
# 1. Update main branch
git checkout main
git pull origin main

# 2. Create feature branch
git checkout -b feature/link-qr-code

# 3. Make changes and commit
git add .
git commit -m "feat(links): add QR code generation"

# 4. Push to remote
git push origin feature/link-qr-code

# 5. Create Pull Request on GitHub
```

### Syncing with Main
```bash
# Update your branch with latest main
git checkout main
git pull origin main
git checkout feature/link-qr-code
git merge main
# Or use rebase (preferred for cleaner history)
git rebase main
```

### Before Committing
```bash
# Check status
git status

# Review changes
git diff

# Stage specific files
git add src/components/LinkForm.tsx
git add src/app/actions.ts

# Or stage all changes
git add .

# Commit with detailed message
git commit -m "feat(links): add link form validation"

# Verify commit
git log -1
```

## Pull Request Guidelines

### PR Title Format
Follow commit message convention:
```
feat(links): Add link analytics dashboard
fix(auth): Resolve Clerk authentication error
docs: Update README with setup instructions
```

### PR Description Template
```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Changes Made
- Change 1
- Change 2
- Change 3

## Testing
- [ ] Tested locally
- [ ] Added unit tests
- [ ] Tested on multiple browsers

## Screenshots (if applicable)
[Add screenshots]

## Related Issues
Closes #123
Fixes #456

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-reviewed code
- [ ] Commented complex code
- [ ] Updated documentation
- [ ] No console errors
- [ ] Tested dark mode (if UI changes)
```

### PR Best Practices
- ✅ Keep PRs small and focused
- ✅ Update branch with latest main before creating PR
- ✅ Ensure all tests pass
- ✅ Request reviews from team members
- ✅ Address review comments promptly
- ✅ Squash commits if needed
- ✅ Delete branch after merge

## .gitignore

### Essential Entries
```gitignore
# Dependencies
node_modules/
.pnp
.pnp.js

# Next.js
.next/
out/
build/
dist/

# Environment variables
.env
.env*.local
.env.production

# Debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# IDE
.vscode/
.idea/
*.swp
*.swo
*~

# OS
.DS_Store
Thumbs.db

# Testing
coverage/
.nyc_output

# Misc
*.log
.vercel
```

## Git Commands Reference

### Common Commands
```bash
# Clone repository
git clone <repository-url>

# Check status
git status

# View changes
git diff
git diff --staged

# Stage changes
git add <file>
git add .
git add -p  # Interactive staging

# Commit
git commit -m "message"
git commit --amend  # Modify last commit

# Push
git push origin <branch>
git push -f origin <branch>  # Force push (use carefully!)

# Pull
git pull origin main
git pull --rebase origin main

# Branches
git branch  # List branches
git branch -d <branch>  # Delete local branch
git checkout -b <branch>  # Create and switch
git switch <branch>  # Switch branches

# Merge
git merge <branch>
git merge --no-ff <branch>  # Create merge commit

# Rebase
git rebase main
git rebase -i HEAD~3  # Interactive rebase for last 3 commits

# Stash
git stash
git stash pop
git stash list
git stash apply stash@{0}

# Log
git log
git log --oneline
git log --graph --oneline --all

# Undo changes
git checkout -- <file>  # Discard changes in working directory
git reset HEAD <file>  # Unstage
git reset --soft HEAD~1  # Undo last commit, keep changes
git reset --hard HEAD~1  # Undo last commit, discard changes
```

### Advanced Commands
```bash
# Find when a bug was introduced
git bisect start
git bisect bad
git bisect good <commit>

# Cherry-pick a commit
git cherry-pick <commit-hash>

# View file history
git log -p <file>

# Blame (find who changed what)
git blame <file>

# Clean untracked files
git clean -fd
```

## Troubleshooting

### Undo Last Commit
```bash
# Keep changes
git reset --soft HEAD~1

# Discard changes
git reset --hard HEAD~1
```

### Resolve Merge Conflicts
```bash
# 1. Start merge/rebase
git merge feature-branch

# 2. View conflicts
git status

# 3. Resolve conflicts in files
# Edit conflicting files, remove conflict markers

# 4. Stage resolved files
git add <resolved-files>

# 5. Continue merge
git merge --continue
# or for rebase
git rebase --continue
```

### Accidentally Committed to Wrong Branch
```bash
# 1. Create new branch with current changes
git branch feature-branch

# 2. Reset current branch
git reset --hard HEAD~1

# 3. Switch to new branch
git checkout feature-branch
```

### Remove File from Git but Keep Locally
```bash
git rm --cached <file>
git commit -m "chore: remove file from git tracking"
```

## Security Best Practices

### Never Commit
- ❌ Environment variables (.env files)
- ❌ API keys and secrets
- ❌ Database passwords
- ❌ SSL certificates
- ❌ Personal information
- ❌ node_modules/

### If You Accidentally Committed Secrets
```bash
# 1. Remove from history
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch <file>" \
  --prune-empty --tag-name-filter cat -- --all

# 2. Force push
git push origin --force --all

# 3. Rotate compromised secrets immediately!
```

### Use Environment Variables
```bash
# .env.local (not committed)
DATABASE_URL=postgresql://...
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# .env.example (committed)
DATABASE_URL=your_database_url_here
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_key_here
CLERK_SECRET_KEY=your_clerk_secret_here
```
