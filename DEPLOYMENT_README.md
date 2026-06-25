# Enzyme Skincare — Deployment Guide

## Build Status
- **Build**: ✅ Pass (0 errors, 0 warnings)
- **TypeScript**: ✅ Clean (strict: true, 0 errors)
- **Routes**: 34 (22 pages + 12 API endpoints)

## Prerequisites

| Service | Why | Link |
|---------|-----|------|
| GitHub | Host source code | github.com |
| Vercel | Host the site | vercel.com |
| Supabase | PostgreSQL database | supabase.com |
| Stripe | Payment processing | stripe.com |
| Resend | Transactional emails | resend.com |

## Step 1: Push to GitHub

```bash
cd enzyme-skincare
git init
git add .
git commit -m "Initial commit"
gh repo create enzyme-skincare --public --push
```

Or create repo manually at github.com/new, then:
```bash
git remote add origin https://github.com/YOUR_USERNAME/enzyme-skincare.git
git push -u origin main
```

## Step 2: Configure Vercel

1. Go to [vercel.com](https://vercel.com) → Add New → Project
2. Import `enzyme-skincare` repo
3. Add these **10 environment variables**:

### Required Environment Variables

| Variable | Value | Source |
|----------|-------|--------|
| `DATABASE_URL` | `postgresql://postgres:PASS@db.xtutmfmuzpkfttvtznocp.supabase.co:6543/postgres?pgbouncer=true&connection_limit=3&sslmode=require` | Supabase Settings → Database |
| `DIRECT_URL` | `postgresql://postgres:PASS@db.xtutmfmuzpkfttvtznocp.supabase.co:5432/postgres?sslmode=require` | Supabase Settings → Database |
| `STRIPE_SECRET_KEY` | `sk_test_...` | Stripe Dashboard → API Keys |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | `pk_test_...` | Stripe Dashboard → API Keys |
| `STRIPE_WEBHOOK_SECRET` | `whsec_...` | Stripe Dashboard → Webhooks |
| `RESEND_API_KEY` | `re_...` | Resend Dashboard |
| `NEXT_PUBLIC_SITE_URL` | `https://enzymeskincare.vercel.app` | Your Vercel domain |
| `NEXT_PUBLIC_GA_ID` | `G-XXXXXXXXXX` | Google Analytics |
| `NEXT_PUBLIC_TIKTOK_PIXEL_ID` | (optional) | TikTok Ads |
| `NEXT_PUBLIC_META_PIXEL_ID` | (optional) | Meta Business |

4. Deploy — wait 2 minutes

## Step 3: Post-Deployment

### Database Migration
Vercel will auto-run migrations. Verify in Supabase SQL Editor:
```sql
SELECT * FROM information_schema.tables WHERE table_schema = 'public';
```

### Stripe Webhook
1. Stripe Dashboard → Developers → Webhooks → Add endpoint
2. URL: `https://enzymeskincare.vercel.app/api/webhook`
3. Events to listen for:
   - `checkout.session.completed`
   - `checkout.session.expired`
   - `payment_intent.succeeded`
4. Copy **Signing Secret** → add as `STRIPE_WEBHOOK_SECRET` in Vercel

### Test Payment
1. Go to your live site
2. Add a product to cart
3. Click Checkout
4. Use test card: `4242 4242 4242 4242` (exp: any future date, CVC: any 3 digits)

## Rollback Plan
- Vercel automatic rollback on build failure
- Stripe test mode protects against real charges
- Supabase has point-in-time recovery

## Security Checklist
- [ ] `DATABASE_URL` uses PgBouncer pooled connection (port 6543)
- [ ] `DIRECT_URL` only used for migrations (port 5432)
- [ ] Stripe keys are in test mode (sk_test_ / pk_test_)
- [ ] `.env.local` is in `.gitignore` (not committed)
- [ ] RLS policies enabled on Supabase tables