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

// Start server after the database tables are ready.
initializeDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });
});
