# Next E-commerce (Migration Foundation)

This folder contains the new Next.js App Router foundation for migrating the existing mini e-commerce project.

## Current Status

- Next.js App Router scaffolded in JavaScript
- Tailwind CSS enabled
- Placeholder storefront/admin pages created
- Placeholder API route handlers created
- Placeholder files for Prisma/Auth/Cloudinary/Stripe created
- Existing repository `frontend/` and `backend/` remain untouched

## Run Locally

```bash
cd next-ecommerce
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Next Steps

- Implement Prisma models + migrations
- Implement authentication/session handling
- Implement Cloudinary uploads
- Implement Stripe Checkout + webhook
- Port business logic from old backend routes
