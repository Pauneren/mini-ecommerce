# MiniStore — Beginner-Friendly Full-Stack Mini E-commerce Website

This is a simple full-stack e-commerce starter project using:

- HTML
- CSS
- Vanilla JavaScript
- Node.js
- Express
- SQLite

It includes:

- Home page
- Products page
- Product detail page
- Cart page using localStorage
- Checkout page
- Thank-you page
- Admin orders page
- REST API
- SQLite database
- Products, orders, and order items tables
- Seed file with example products

No payment processing is included yet.

---

## Project Structure

```text
mini-ecommerce/
  frontend/
    index.html
    products.html
    product.html
    cart.html
    checkout.html
    thank-you.html
    admin.html
    css/
      styles.css
    js/
      main.js
      cart.js
      checkout.js
      admin.js
    assets/

  backend/
    server.js
    database.js
    seed.js
    package.json
    routes/
      products.js
      orders.js
    db/
      store.sqlite
```

---

## How to Run the Backend

Open a terminal:

```bash
cd backend
npm install
npm run seed
npm start
```

The backend will run here:

```text
http://localhost:5000
```

Useful API routes:

```text
GET    http://localhost:5000/api/products
GET    http://localhost:5000/api/products/1
POST   http://localhost:5000/api/orders
GET    http://localhost:5000/api/orders
POST   http://localhost:5000/api/products
PUT    http://localhost:5000/api/products/1
DELETE http://localhost:5000/api/products/1
```

---

## How to Run the Frontend

Open the `frontend` folder with a simple local server.

The easiest option in VS Code is:

1. Install the **Live Server** extension.
2. Right-click `frontend/index.html`.
3. Click **Open with Live Server**.

Or use this command:

```bash
cd frontend
python3 -m http.server 3000
```

Then open:

```text
http://localhost:3000
```

---

## Important

The frontend expects the backend to run at:

```text
http://localhost:5000/api
```

You can change this in:

```text
frontend/js/main.js
```

Look for:

```js
const API_BASE = "http://localhost:5000/api";
```

---

## How Checkout Works

1. User adds products to cart.
2. Cart is saved in `localStorage`.
3. User completes the checkout form.
4. Frontend sends order data to `POST /api/orders`.
5. Backend validates the order.
6. Backend saves the order and order items in SQLite.
7. User is redirected to the thank-you page.

---

## Deployment Notes

For a real deployment:

- Deploy frontend to Netlify, Vercel, or GitHub Pages.
- Deploy backend to Render, Railway, Fly.io, or similar.
- Replace `API_BASE` in `frontend/js/main.js` with your live backend URL.
- Add authentication before using the admin page publicly.
- Add real payment processing later with Stripe, Mercado Pago, PayPal, etc.
