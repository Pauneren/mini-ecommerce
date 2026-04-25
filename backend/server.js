const express = require("express");
const cors = require("cors");
const { initializeDatabase } = require("./database");

const productRoutes = require("./routes/products");
const orderRoutes = require("./routes/orders");

const app = express();
const PORT = process.env.PORT || 5000;

// CORS allows the frontend to call this backend from another port or domain.
app.use(cors());

// Parse JSON body data from requests.
app.use(express.json());

// API routes.
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);

// Simple health check route.
app.get("/", (req, res) => {
  res.json({ message: "Mini e-commerce API is running." });
});

// Generic error handler.
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "Something went wrong on the server." });
});

// Start server after the database tables are ready.
initializeDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
});
