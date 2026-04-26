# Security Note

This starter includes admin pages and protected API routes.

**Backend protection (JWT):** Creating, updating, and deleting products, uploading images, and listing orders require a valid admin token from `POST /api/auth/login`.

**Frontend:** Admin HTML pages use client-side checks; always keep strong `ADMIN_PASSWORD` and `JWT_SECRET` in production.

Before running a real store in production, also review:

- Stored XSS (product fields rendered with `innerHTML` in the storefront)
- Rate limiting on login
- Persistent file storage for uploads on your host
