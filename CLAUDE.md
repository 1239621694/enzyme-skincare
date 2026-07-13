@AGENTS.md

## Token Optimization Mandates
1. Never scan entire repo — use targeted search
2. Never re-read unchanged files — cache in context
3. Never suggest follow-ups after task completion
4. Never run `find .` or `ls -R` on full project
5. Never open `node_modules/`, `.next/`, `README.md`

## Session Start
1. Read this file
2. Read `AI_RULES/01_PROJECT_CONTEXT.md`
3. Read `AI_RULES/02_TOKEN_POLICY.md`
4. Begin task

## Task Output Format
```
## Summary
## Files Read
## Files Modified
## Reason
## Verification
## Remaining Risks
## Next Step
```

## Core Constraints

### Never Modify
- Payment logic (`/api/checkout`, `/api/webhook`, `lib/stripe.ts`)
- SEO metadata, sitemap, robots
- Database schema without explicit approval
- Admin Chinese translations except when specifically asked

### Always Keep
- Existing UI component library
- TailwindCSS styling conventions
- Admin i18n pattern (`src/lib/admin-i18n.ts`)
- Image path conventions (`public/images/`)
