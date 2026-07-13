# Debug Policy

## Minimal Debugging

### 1. Build Errors
- Run `npx next build` to verify TypeScript compilation
- If build fails, report the error and STOP
- Do not attempt to fix build errors unless the task specifically requires it

### 2. Runtime Errors
- Do not run `npm run dev` to test UI changes
- Do not inspect browser console logs
- Rely on TypeScript compilation for correctness

### 3. No Proactive Debugging
- Do not add `console.log` statements for debugging unless asked
- Do not inspect network requests
- Do not test API endpoints with curl unless needed to verify a specific behavior

### 4. Error Reporting
Report errors in this format:
```
Error: [error message]
File: [file:line]
Context: [what was happening]
```
