# File Access Policy

## Read Only What You Need

### 1. Identify Before Opening
Before reading any file, identify exactly which file is needed based on:
- Task description
- Project context from `01_PROJECT_CONTEXT.md`
- Previous session knowledge

### 2. Read Priority
1. **Direct target file** (the file to modify)
2. **Immediate dependencies** (imports of that file)
3. **Nearby files in same directory** (same module)
4. **Configuration files** (only if needed for the specific change)

### 3. Never Read
- `node_modules/` — never
- `.next/` — never
- `README.md` — unless explicitly requested
- `package.json` — unless the task involves adding/removing dependencies
- Files outside `src/` for UI changes
- Files outside `prisma/` for database changes
- Git history — prefer `git diff` for recent changes

### 4. Search Strategy
For finding code:
```
1. Grep with glob:    Grep("src/app/admin", "search term")
2. Targeted find:     find src/app/admin -name "*.tsx"
3. NOT recursive:     Never find . -type f (full project scan)
```

### 5. Batch Reading
When you need multiple files:
- Read them in a single batch call if possible
- Prioritize by likelihood of relevance
- Skip files that turn out to be irrelevant

### 6. Cache Invalidation
- If you read a file, you do not need to re-read it later in the same task
- If a file was edited, the new version is in context
- Only re-read if context was summarized/lost
