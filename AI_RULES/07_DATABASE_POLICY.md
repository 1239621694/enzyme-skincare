# Database Policy

## Strict Rules

### 1. Schema Changes Require Approval
- Never modify `prisma/schema.prisma` without explicit approval
- Never run `prisma migrate` without explicit approval
- Never modify Prisma client usage patterns

### 2. Query Optimization
- Use selective `select` / `include` — never fetch all columns unnecessarily
- Use `Prisma.count` instead of loading all records and counting in JS
- Use `take` + `skip` for pagination
- Limit relations: only include what's needed

### 3. No Raw SQL
- Never use `$queryRaw` or `$executeRaw` unless Prisma API cannot achieve the goal
- Never bypass Prisma client for database operations

### 4. Connection Management
- Use the existing singleton in `src/lib/prisma.ts`
- Do not create new PrismaClient instances
