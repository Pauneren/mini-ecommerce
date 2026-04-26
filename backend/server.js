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

// CORS allows the frontend to call this backend from another port or domain.
const allowedOrigins = new Set(
  [
    "http://localhost:3000",
    "http://localhost:3001",
    "http://localhost:3010",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:3001",
    "http://127.0.0.1:3010",
    process.env.FRONTEND_URL
  ].filter(Boolean)
);

const corsOptions = {
  origin: (origin, callback) => {
    // Allow non-browser requests (curl/Postman) and configured frontend origins.
    if (!origin || allowedOrigins.has(origin)) {
      return callback(null, true);
    }
    return callback(new Error("Not allowed by CORS"));
  },
  credentials: true
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

function startServer(preferredPort, attemptsRemaining = 10) {
  const server = app.listen(preferredPort, () => {
    console.log(`Server running at http://localhost:${preferredPort}`);
  });

  server.on("error", (error) => {
    if (error.code === "EADDRINUSE" && attemptsRemaining > 0) {
      const nextPort = Number(preferredPort) + 1;
      console.warn(`Port ${preferredPort} is in use, retrying on ${nextPort}...`);
      startServer(nextPort, attemptsRemaining - 1);
      return;
    }

    console.error("Failed to start server:", error);
    process.exit(1);
  });
}

// Start server after the database tables are ready.
initializeDatabase().then(() => {
  startServer(Number(PORT));
});
