# Git Policy

## Commit Standards

### 1. Commit Frequency
- One commit per logical change
- Do not batch unrelated changes into one commit
- Do not split a single logical change across multiple commits

### 2. Commit Messages
Format:
```
type: short description

Optional details, one per line.
```

Types:
- `feat:` — new feature
- `fix:` — bug fix
- `refactor:` — code change without feature/fix
- `docs:` — documentation only
- `style:` — formatting, no logic change
- `chore:` — maintenance

### 3. File Staging
- Prefer `git add <file1> <file2>` over `git add -A`
- Only stage files related to the current change
- Verify staged changes with `git diff --cached`

### 4. Push
- Push after each commit unless told otherwise
- Use `git push origin master`

### 5. Branching
- Default branch is `master`
- Do not create branches unless asked
- Never force push
