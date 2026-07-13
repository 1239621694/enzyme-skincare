# Project Context

## Stack
- Next.js 16 (App Router)
- React 19 + TypeScript
- TailwindCSS v4
- Prisma + Supabase (PostgreSQL)
- Stripe (Payment)
- Resend (Email)
- Vercel (Deployment)

## Structure
```
src/
├── app/           # App Router pages + API routes
│   ├── admin/     # Admin dashboard (Chinese UI)
│   ├── api/       # API routes
│   ├── products/  # Product listing + detail
│   ├── cart/      # Shopping cart
│   ├── checkout/  # Checkout pages
│   ├── orders/    # Customer order pages
│   ├── about/     # About page
│   ├── cases/     # Before/After gallery
│   └── contact/   # Contact page
├── components/    # Shared React components
│   ├── ui/        # UI primitives (Button, Badge, Stars, Modal)
│   ├── layout/    # Header, Footer
│   ├── products/  # ProductCard, ProductGrid, etc.
│   ├── cart/      # CartSidebar
│   └── home/      # Homepage sections
├── lib/           # Utilities, products.ts, prisma.ts
└── hooks/         # useCart, useWishlist
prisma/
└── schema.prisma  # Database schema
```

## Key Architecture Decisions
- Products are defined in `src/lib/products.ts` (static data array)
- Cart uses React Context + localStorage (`src/hooks/useCart.tsx`)
- Admin UI uses Chinese translations from `src/lib/admin-i18n.ts`
- Checkout via `POST /api/checkout` creates Order + Customer + Payment
- Images stored in `public/images/`

## Never Read
- `node_modules/`
- `.next/`
- `README.md` (unless explicitly asked)
- `package.json` (unless dependency change is discussed)
- `.git/` history

## Always Prioritize
- Targeted grep over recursive search
- Git diff over full file read for understanding changes
- Reading only the specific file that needs modification
