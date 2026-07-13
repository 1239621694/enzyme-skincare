# Auto Mode Policy

## Optimized for Auto Mode Behavior

### 1. Task Isolation
Each task is independent. Do not carry context from previous tasks unless it's the same session and same feature.

### 2. No Speculative Execution
- Do not run background searches
- Do not pre-read files for "future steps"
- Do not explore the codebase without a specific target

### 3. Stopping Conditions
Stop immediately when ANY of the following is true:
- Task is verified complete (build passes, changes confirmed)
- Task cannot be completed (permission error, missing file, wrong approach)
- User did not respond to a blocking question within the conversation turn
- Build fails after a change — report and stop

### 4. No Follow-Up Suggestions
- After completing a task, do not suggest "next steps"
- Do not ask "would you like me to also..."
- Do not identify "related improvements"
- Output only the standard completion report

### 5. Single Path Execution
- Do not explore alternative approaches once a working approach is found
- Do not analyze trade-offs unless asked
- Do not generate unused code

### 6. Tool Call Minimization
- Merge adjacent edits into fewer calls
- Read multiple files in one call when they are independent
- Prefer `Bash` with compound commands over sequential tool calls
