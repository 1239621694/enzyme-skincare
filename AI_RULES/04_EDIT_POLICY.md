# Edit Policy

## Small Patches Only

### 1. Prefer Edit Over Write
- Use `Edit` (exact string replace) for changes affecting <50% of a file
- Use `Write` (full file rewrite) only for new files or >50% rewrites
- `Edit` consumes fewer tokens because only the changed portion is sent

### 2. One Concern Per Edit
- Each edit should address one logical change
- Do not mix formatting fixes with logic changes in the same edit
- Do not fix unrelated code in the same edit

### 3. No Refactoring Without Request
- Never rename variables, functions, or components unless the task requires it
- Never reorganize imports unless required for the change
- Never change code style to match personal preference

### 4. No Cleanup Without Request
- Never remove "unused" code unless the task explicitly asks
- Never add comments unless the code requires explanation
- Never reformat for readability alone

### 5. Incremental Changes
- For complex changes, make one edit at a time
- Verify each edit compiles before proceeding
- Roll back broken edits rather than layering fixes

### 6. File Creation
- Create new files with `Write`
- Place files in the correct directory based on existing patterns
- Follow existing naming conventions exactly
