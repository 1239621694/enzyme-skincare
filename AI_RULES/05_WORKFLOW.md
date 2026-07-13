# Workflow

## Standard Task Execution

### Step 1 — Understand
- Read task description
- Identify the target file(s) from `01_PROJECT_CONTEXT.md`
- Do NOT re-read the entire project

### Step 2 — Locate
- Use targeted Grep to find the exact code to change
- Read only the target file + directly related files
- Do NOT open unrelated modules

### Step 3 — Edit
- Use `Edit` for small changes
- Use `Write` for new files or major rewrites
- Follow `04_EDIT_POLICY.md`

### Step 4 — Verify
- Run `npx next build` TypeScript check (unless told not to)
- Check git diff to confirm only expected changes
- Report: files read, files modified, reason, status

### Step 5 — Commit & Stop
- `git add` specific files (never `git add -A` unless intentional)
- Commit with descriptive message
- Push if applicable
- Stop — do not continue exploring

## Stopping Conditions
- Task completed and verified → STOP
- Task impossible (permission, missing files) → report once → STOP
- Task ambiguous → ask once → wait for answer → STOP until answer
- Build failure → report error → STOP (do not try to fix without instruction)
