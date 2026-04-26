# MiniStore — Beginner-Friendly Full-Stack Mini E-commerce

A simple full-stack e-commerce starter using HTML, CSS, vanilla JavaScript, Node.js, Express, and SQLite.

**Includes:** home, products, product detail, cart (localStorage), checkout, thank-you page, admin login (JWT), admin orders, admin product manager with **local image uploads**, and a REST API.

No payment processing is included.

**Repository:** [https://github.com/Pauneren/mini-ecommerce](https://github.com/Pauneren/mini-ecommerce)

---

## Project structure

```text
mini-ecommerce/
  frontend/          # Static site (Netlify)
  backend/           # API (Render)
```

---

## Local development

### 1. Backend

```bash
cd backend
npm install
npm run seed
PORT=5050 npm start
```

The API is available at `http://localhost:5050` (e.g. `http://localhost:5050/api/products`).

**Environment:** Copy `backend/.env.example` to `backend/.env` and edit values. **Do not commit `backend/.env`.**

### 2. Frontend

```bash
cd frontend
python3 -m http.server 3001
```

Open `http://localhost:3001`.

### 3. Point the frontend at the API

In `frontend/js/main.js`, local development uses:

```js
const API_BASE = "http://localhost:5050/api";
```

Set `FRONTEND_URL` in `backend/.env` to `http://localhost:3001` so CORS allows your frontend.

---

## Deploy backend on Render

1. Push this repo to GitHub (if it is not already).
2. In [Render](https://render.com), create a **Web Service** from the repo.
3. Settings:

| Setting | Value |
|--------|--------|
| **Root Directory** | `backend` |
| **Build Command** | `npm install` |
| **Start Command** | `npm start` |

4. **Environment variables** (example):

| Variable | Example / notes |
|----------|------------------|
| `PORT` | `10000` (Render often injects `PORT`; match what Render documents for your plan) |
| `FRONTEND_URL` | `https://YOUR-NETLIFY-SITE.netlify.app` |
| `ADMIN_EMAIL` | Your admin email |
| `ADMIN_PASSWORD` | Strong password (prefer bcrypt hash in production) |
| `JWT_SECRET` | Long random string |
| `DATABASE_PATH` | `./db/store.sqlite` |

5. After deploy, note your service URL, e.g. `https://YOUR-SERVICE.onrender.com`.

**Note:** Free tiers may sleep; first request after idle can be slow. Uploaded files on disk may not persist across redeploys—see “Image storage” below.

---

## Deploy frontend on Netlify

1. Create a site from the same GitHub repo.
2. Suggested settings:

| Setting | Value |
|--------|--------|
| **Base directory** | `frontend` |
| **Build command** | *(leave empty)* |
| **Publish directory** | `frontend` if Netlify measures from the **repository root**; use `.` (single dot) if paths are **relative to the base directory** (`frontend`) so Netlify publishes that folder’s contents. |

3. Deploy.

---

## After both are live

1. Open `frontend/js/main.js`.
2. Change **from:**

   ```js
   const API_BASE = "http://localhost:5050/api";
   ```

   **to:**

   ```js
   const API_BASE = "https://YOUR-RENDER-BACKEND-URL.onrender.com/api";
   ```

   (Use your real Render URL, with `/api` at the end.)

3. In Render, set `FRONTEND_URL` to your exact Netlify site URL (including `https://`, no trailing slash issues—both sides normalize trailing slashes for CORS).

4. Commit and push:

```bash
cd /path/to/mini-ecommerce
git add frontend/js/main.js
git commit -m "Point API_BASE to production Render URL"
git push origin main
```

5. Trigger a Netlify redeploy if it does not rebuild automatically.

---

## Environment variables reference (`backend/.env.example`)

```env
PORT=5000
FRONTEND_URL=http://localhost:3001
ADMIN_EMAIL=youremail@example.com
ADMIN_PASSWORD=change-this-password
JWT_SECRET=make-this-a-long-random-secret
DATABASE_PATH=./db/store.sqlite
```

Never commit `backend/.env`.

---

## Useful API routes

```text
GET    /api/products
GET    /api/products/:id
POST   /api/orders
GET    /api/orders          (admin + JWT)
POST   /api/products        (admin + JWT, multipart)
PUT    /api/products/:id    (admin + JWT, multipart)
DELETE /api/products/:id    (admin + JWT)
POST   /api/auth/login
GET    /api/auth/verify
POST   /api/upload          (admin + JWT)
```

---

## How checkout works

1. User adds products to the cart (stored in `localStorage`).
2. User submits the checkout form.
3. Frontend sends `POST /api/orders` with customer + line items.
4. Backend validates input and **recalculates totals from database prices** (not from client-submitted prices).
5. Order and line items are stored in SQLite.

---

## Product images

- Admin uploads images; files go to `backend/uploads/` and are served at `/uploads/...`.
- **Production:** disk storage on ephemeral hosts can be wiped on redeploy. For a real store, plan object storage (S3, Cloudinary, etc.) later.

---

## Security notes

- Admin routes for products, uploads, and orders require a valid JWT.
- Use strong `JWT_SECRET` and admin password in production.
- The storefront renders product text/HTML from the database; treat admin access carefully to avoid stored XSS (see `SECURITY-NOTE.md`).

---

## Scripts (`backend/package.json`)

```json
"scripts": {
  "start": "node server.js",
  "dev": "nodemon server.js",
  "seed": "node seed.js"
}
```

Development with auto-restart:

```bash
cd backend
npm run dev
```
