# API Policy

## Strict Rules

### 1. Existing Endpoints
- Do not create new API routes unless the task explicitly requires it
- Prefer extending existing route handlers over creating new files

### 2. API Route Convention
- All API routes are in `src/app/api/`
- Use `route.ts` naming convention (Next.js App Router)
- Export `GET`, `POST`, `PUT`, `PATCH`, `DELETE` functions

### 3. Validation
- Validate request bodies at the start of each handler
- Return meaningful error messages
- Use HTTP status codes correctly (400, 401, 404, 409, 500)

### 4. No Breaking Changes
- Never change API response shape unless explicitly requested
- Adding fields is safe; removing or renaming fields is not

### 5. Security
- Never remove authentication checks
- Never expose internal fields in API responses
- Sanitize user input in search/filter parameters
