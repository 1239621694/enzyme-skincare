# Payment Policy

## Strict Rules

### 1. Never Modify Payment Logic
- Do not modify Stripe integration code without explicit approval
- Do not modify checkout amount calculations
- Do not modify payment confirmation logic
- Do not modify webhook handlers

### 2. Read-Only
- Payment-related code can be read for context, but never edited
- If a payment bug is suspected, report it — do not fix it

### 3. Escalation
Payment issues must be escalated to the project owner. Do not attempt hotfixes on payment code.

### Payment Files (Never Edit)
- `src/app/api/webhook/route.ts`
- `src/app/api/checkout/route.ts`
- `src/lib/stripe.ts`
