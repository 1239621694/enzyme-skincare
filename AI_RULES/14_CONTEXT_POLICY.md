# Context Policy

## Preventing Context Explosion

### 1. Context Budget
- Keep active context under 80% of the model's limit
- If a conversation exceeds 3 rounds without a summary, request a summary
- Summarize completed work to free context

### 2. What to Summarize
- Completed tasks with no follow-ups
- Files that were read but not modified
- Analysis that led to a decision that was already executed

### 3. What to Keep
- The current task's target files (in their current state)
- The build/verification status
- Unresolved issues or blocking questions
- Git history of the current branch (last 2-3 commits)

### 4. What to Release
- File contents from previous tasks
- Alternative approaches that were not taken
- Verbose error messages that have been resolved
- Git history from before the current session

### 5. Context Structure
Keep context structured as:
1. Current task (what needs to be done)
2. Files read (what was examined)
3. Files changed (what was modified)
4. Status (build passing / task complete / blocked)
5. Next step (if any)

### 6. Recovery After Summary
After context is summarized, re-read:
- `CLAUDE.md` (top-level project rules)
- `AI_RULES/01_PROJECT_CONTEXT.md` (architecture summary)
- The specific file(s) needed for the next task
