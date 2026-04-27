// Load environment variables
require('dotenv').config();

const express = require("express");
const fs = require("fs");
const cors = require("cors");
const path = require("path");
const { initializeDatabase } = require("./database");

const productRoutes = require("./routes/products");
const orderRoutes = require("./routes/orders");
const authRoutes = require("./routes/auth");
const { router: uploadRoutes } = require("./routes/upload");

const app = express();
const PORT = process.env.PORT || 5000;
const uploadsDir = path.join(__dirname, "uploads");

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

function normalizeOrigin(url) {
  if (!url || typeof url !== "string") return null;
  return url.replace(/\/$/, "");
}

// CORS: local dev + deployed Netlify (set FRONTEND_URL to your https://....netlify.app)
const allowedOrigins = new Set(
  [
    normalizeOrigin("http://localhost:3000"),
    normalizeOrigin("http://localhost:3001"),
    normalizeOrigin("http://localhost:3010"),
    normalizeOrigin(process.env.FRONTEND_URL),
  ].filter(Boolean)
);

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.has(normalizeOrigin(origin))) {
      return callback(null, true);
    }
    return callback(null, false);
  },
  credentials: true,
};
app.use(cors(corsOptions));

// Parse JSON body data from requests.
app.use(express.json());

// API routes.
app.use("/api/auth", authRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);

// Serve uploaded images publicly
app.use("/uploads", express.static("uploads"));

// Simple health check route.
app.get("/", (req, res) => {
  res.json({ message: "Mini e-commerce API is running." });
});

// Generic error handler.
app.use((err, req, res, next) => {
  console.error(err);

  if (err.code === "LIMIT_FILE_TYPE") {
    return res.status(400).json({ error: err.message });
  }

  if (err.code === "LIMIT_FILE_SIZE" || err.code === "LIMIT_FILE_COUNT") {
    return res.status(400).json({ error: "File size too large. Maximum size is 5MB." });
  }

  res.status(500).json({ error: "Something went wrong on the server." });
});

// Auto-seed sample products if the database is empty.
async function seedIfEmpty(db) {
  const row = await db.get("SELECT COUNT(*) as count FROM products");
  if (row.count > 0) return;

  const products = [
    { name: "Ceramic Coffee Mug", price: 18.99, image: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?auto=format&fit=crop&w=900&q=80", short_description: "Minimal ceramic mug for slow mornings.", description: "A premium ceramic coffee mug with a smooth matte finish. Perfect for coffee, tea, or hot chocolate." },
    { name: "Canvas Tote Bag", price: 26.5, image: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=900&q=80", short_description: "Durable everyday tote with clean style.", description: "A strong canvas tote bag designed for everyday errands, work, markets, and casual use." },
    { name: "Desk Notebook", price: 14.0, image: "https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&w=900&q=80", short_description: "Simple notebook for ideas and plans.", description: "A clean, lightweight notebook with smooth pages for journaling, notes, sketches, and planning." },
    { name: "Soft Linen Scarf", price: 34.99, image: "https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?auto=format&fit=crop&w=900&q=80", short_description: "Lightweight scarf with soft texture.", description: "A breathable linen scarf that adds texture and elegance to simple outfits." },
    { name: "Minimal Table Lamp", price: 59.0, image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=900&q=80", short_description: "Warm light for desks and bedrooms.", description: "A minimal table lamp with a warm tone, perfect for a bedroom, workspace, or reading corner." },
    { name: "Glass Water Bottle", price: 22.0, image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=900&q=80", short_description: "Reusable bottle for daily hydration.", description: "A reusable glass water bottle with a simple design and comfortable grip." },
  ];

  for (const p of products) {
    await db.run(
      "INSERT INTO products (name, price, image, short_description, description) VALUES (?, ?, ?, ?, ?)",
      p.name, p.price, p.image, p.short_description, p.description
    );
  }

  console.log("Auto-seeded 6 sample products.");
}

// Start server after the database tables are ready.
initializeDatabase().then(async (db) => {
  try {
    await seedIfEmpty(db);
  } catch (err) {
    console.error("Auto-seed failed (server will still start):", err.message);
  }
  app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });
}).catch((err) => {
  console.error("Failed to initialise database:", err);
  process.exit(1);
});
