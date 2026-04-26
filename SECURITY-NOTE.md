# Security Note

This starter project includes admin pages for learning purposes.

Before deploying a real store, protect these routes with login/authentication:

- frontend/admin.html
- frontend/admin-products.html
- GET /api/orders
- POST /api/products
- PUT /api/products/:id
- DELETE /api/products/:id

Without authentication, anyone who knows the admin URLs could view orders or change products.
