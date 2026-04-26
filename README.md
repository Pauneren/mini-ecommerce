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
- Admin products management page
- Admin login system with JWT authentication
- REST API with protected admin routes
- Cloudinary image upload for products
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

## 🚀 Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Git

### Local Development Setup

1. **Clone the repository:**
```bash
git clone <repository-url>
cd mini-ecommerce
```

2. **Backend Setup:**
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your admin credentials
npm run seed  # Optional: adds sample products
npm start
```

3. **Frontend Setup:**
```bash
cd frontend
python3 -m http.server 3000
# Or use Live Server extension in VS Code
```

4. **Access the application:**
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- Admin Login: http://localhost:3000/admin-login.html

### Local Run Commands

**Backend:**
```bash
cd backend
npm install
npm run seed  # Add sample products
npm start      # Start backend server
```

**Frontend:**
```bash
cd frontend
python3 -m http.server 3000
```

**Development Mode (with auto-restart):**
```bash
cd backend
npm run dev
```

---

## 🌐 Deployment Instructions

### Backend Deployment (Render or Railway)

#### 1. Prepare Environment Variables

Create a `.env` file in the backend directory:

```env
PORT=5000
FRONTEND_URL=https://your-frontend-domain.com
ADMIN_EMAIL=owner@example.com
ADMIN_PASSWORD=change-this-password
JWT_SECRET=change-this-long-random-secret
DATABASE_PATH=./db/store.sqlite
```

#### 2. Deploy to Render

1. **Push your code to GitHub**
2. **Create a new Web Service on Render:**
   - Connect your GitHub repository
   - Set **Root Directory** to: `backend`
   - Set **Build Command**: `npm install`
   - Set **Start Command**: `npm start`
   - Add all environment variables from your `.env` file

#### 3. Deploy to Railway

1. **Push your code to GitHub**
2. **Create a new Project on Railway**
3. **Add a new service from GitHub repository**
4. **Set the Root Directory** to: `backend`
5. **Add environment variables** from your `.env` file
6. **Deploy**

### Frontend Deployment

Deploy the frontend to any static hosting service:

#### Netlify, Vercel, or GitHub Pages:

1. **Update API URL** in `frontend/js/main.js`:
```javascript
// Replace localhost with your deployed backend URL
const API_BASE = "https://your-backend-url.onrender.com/api";
```

2. **Deploy the frontend folder** to your chosen hosting service

---

## 📸 Image Storage Considerations

### Local Development
- Images are uploaded to the `backend/uploads` directory
- Served statically at `/uploads`

### Production Deployment
**Important:** Uploaded images saved locally may disappear on some hosting platforms after redeploys or restarts.

For real production use, consider using:

- **Cloudinary** - Cloud-based image management
- **Firebase Storage** - Google's cloud storage
- **Supabase Storage** - PostgreSQL-based storage
- **Amazon S3** - AWS cloud storage
- **Uploadcare** - Developer-friendly file upload service

### Recommended Production Setup
1. Use a cloud storage service for images
2. Update the upload route to use the chosen service
3. Store image URLs in the database instead of local paths
4. Configure CDN for faster image delivery

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
---

## Owner Product Manager

The project now includes a simple admin product manager:

```text
frontend/admin-products.html
frontend/js/admin-products.js
```

The store owner can:

- Add a new product
- Edit an existing product
- Delete a product
- See all current products

The product manager uses these backend routes:

```text
POST   /api/products
PUT    /api/products/:id
DELETE /api/products/:id
```

### Important security note

The admin pages currently do **not** have login protection because this is a beginner-friendly starter project.

Before publishing a real store, add authentication so only the owner can access:

```text
/admin.html
/admin-products.html
POST /api/products
PUT /api/products/:id
DELETE /api/products/:id
GET /api/orders
```

Good beginner-friendly options later:

- Firebase Auth
- Supabase Auth
- Auth0
- Express sessions with username/password
- JWT authentication

### About product images

Right now the owner adds products using an image URL.

For real image upload later, use a service like:

- Cloudinary
- Firebase Storage
- Supabase Storage
- S3-compatible storage

This keeps the first version simple and easier to understand.
---

## Product Image Uploads

The admin product manager now supports uploading product images directly from the owner's computer.

How it works:

1. The owner selects an image in `admin-products.html`.
2. The frontend sends the product data using `FormData`.
3. The backend receives the image using `multer`.
4. The image is saved inside:

```text
backend/uploads/
```

5. The backend stores the image URL in SQLite, for example:

```text
http://localhost:5000/uploads/1712345678900-product.jpg
```

Accepted image formats:

- JPG
- PNG
- WEBP
- GIF

Maximum size:

```text
5MB
```

Important for deployment:

Uploaded files saved directly on the backend server may disappear on some hosting platforms after redeploys or restarts.

For a real production store, use image storage such as:

- Cloudinary
- Firebase Storage
- Supabase Storage
- Amazon S3
- Uploadcare

For the beginner local version, the current upload folder works well.

---

## 🚀 Production Deployment

This project is now production-ready with authentication, Cloudinary image upload, and environment variable configuration.

### Backend Deployment (Render or Railway)

#### 1. Prepare Your Environment

1. **Set up Cloudinary** (if not already done):
   - Create a free Cloudinary account
   - Get your Cloud Name, API Key, and API Secret from the dashboard

2. **Create a .env file** in the backend directory:
   ```bash
   cd backend
   cp .env.example .env
   ```

3. **Update .env with your values**:
   ```env
   PORT=5000
   FRONTEND_URL=https://your-frontend-domain.com
   ADMIN_EMAIL=your-admin-email@example.com
   ADMIN_PASSWORD=your-secure-password
   JWT_SECRET=your-long-random-jwt-secret-key
   CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
   CLOUDINARY_API_KEY=your-cloudinary-api-key
   CLOUDINARY_API_SECRET=your-cloudinary-api-secret
   DATABASE_PATH=./db/store.sqlite
   ```

#### 2. Deploy to Render

1. **Push your code to GitHub**
2. **Create a new Web Service on Render**:
   - Connect your GitHub repository
   - Set the **Root Directory** to: `backend`
   - Set **Build Command**: `npm install`
   - Set **Start Command**: `npm start`
   - Add all environment variables from your .env file

#### 3. Deploy to Railway

1. **Push your code to GitHub**
2. **Create a new Project on Railway**
3. **Add a new service from GitHub repository**
4. **Set the Root Directory** to: `backend`
5. **Add environment variables** from your .env file
6. **Deploy**

### Frontend Deployment

Deploy the frontend to any static hosting service:

#### Netlify, Vercel, or GitHub Pages:

1. **Update API URL** in `frontend/js/main.js`:
   ```javascript
   // Replace localhost with your deployed backend URL
   const API_BASE = "https://your-backend-url.onrender.com/api";
   ```

2. **Deploy the frontend folder** to your chosen hosting service

### Required Environment Variables for Backend

| Variable | Description | Example |
|----------|-------------|---------|
| `FRONTEND_URL` | Your deployed frontend URL | `https://your-store.netlify.app` |
| `ADMIN_EMAIL` | Admin login email | `admin@yourstore.com` |
| `ADMIN_PASSWORD` | Admin login password | `your-secure-password` |
| `JWT_SECRET` | Secret for JWT tokens | `long-random-string-here` |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name | `your-cloud-name` |
| `CLOUDINARY_API_KEY` | Cloudinary API key | `your-api-key` |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret | `your-api-secret` |
| `DATABASE_PATH` | SQLite database path | `./db/store.sqlite` |

### Post-Deployment Checklist

- [ ] Backend deployed and accessible
- [ ] Frontend deployed with correct API URL
- [ ] Admin login working
- [ ] Product image upload working
- [ ] Orders and products management working
- [ ] CORS properly configured for your domain

### Security Notes

- Use strong, unique passwords for admin credentials
- Keep your JWT secret long and random
- Never commit your .env file to version control
- Consider adding rate limiting for production use
- Use HTTPS in production
