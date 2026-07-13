# Token Optimization Policy

## Core Principle
Every token spent must directly contribute to completing the current task. No speculative work.

## Rules

### 1. No Repository-Wide Scans
- NEVER run `find .` or `ls -R` on the full project
- Use targeted `find src/app/X` for specific route, not the entire `src/`
- Prefer `Grep` with file glob pattern over blanket search

### 2. No Repeated Reads
- Cache file content in context — do not re-read unchanged files
- If you read a file in this session, refer to your cached copy
- Only re-read if specifically asked or if the file was just edited

### 3. No Regeneration
- Do not regenerate project understanding between tasks
- Refer to `AI_RULES/01_PROJECT_CONTEXT.md` for architecture
- Do not re-read `CLAUDE.md` on every task

### 4. Stop After Success
- Stop immediately when a task is verified complete
- Do not suggest improvements unless asked
- Do not explore edge cases unless the task requires it
- Do not refactor unrelated code

### 5. Stop After Irrecoverable Failure
- If a task cannot be completed (wrong approach, dependency missing, permission denied), report failure once and stop
- Do not propose alternative solutions unless asked

### 6. Limit Tool Calls
- Merge related operations into fewer tool calls where possible
- Prefer `Edit` over `Write` for small changes (partial replace = fewer tokens)
- Prefer `Grep` with `files_with_matches` over `content` when only file location is needed

### 7. No Background Exploration
- Never run background searches or analysis without explicit instruction
- Never "prefetch" or "preload" context for future steps

### 8. Optimize Git Usage
- Prefer `git diff` over reading files to understand what changed
- Use `git log --oneline -N` for recent history instead of full log
