# SEO Policy

## Strict Rules

### 1. Never Modify SEO Without Request
- Do not change metadata, titles, descriptions, or structured data unless explicitly asked
- Do not modify `generateMetadata` functions
- Do not modify `sitemap.ts` or `robots.ts`
- Do not modify JSON-LD schema components

### 2. SEO Components (Read-Only)
- `src/components/seo/` — never modify unless specifically requested
- `src/app/sitemap.ts` — never modify
- `src/app/robots.ts` — never modify
- `src/app/layout.tsx` metadata export — never modify

### 3. No Meta Tag Changes
- Do not add, remove, or modify meta tags, OG tags, or Twitter cards
- Do not modify canonical URLs or alternate hreflang tags
