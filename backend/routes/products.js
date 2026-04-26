const express = require("express");
const { getDatabase } = require("../database");
const { requireAdmin } = require("../middleware/auth");
const { upload } = require("./upload");

const router = express.Router();

// GET /api/products
router.get("/", async (req, res, next) => {
  try {
    const db = await getDatabase();
    const products = await db.all("SELECT * FROM products ORDER BY id DESC");
    res.json(products);
  } catch (error) {
    next(error);
  }
});

// GET /api/products/:id
router.get("/:id", async (req, res, next) => {
  try {
    const db = await getDatabase();
    const product = await db.get("SELECT * FROM products WHERE id = ?", req.params.id);

    if (!product) {
      return res.status(404).json({ error: "Product not found." });
    }

    res.json(product);
  } catch (error) {
    next(error);
  }
});

// Admin endpoint: POST /api/products
router.post("/", requireAdmin, upload.single("image_file"), async (req, res, next) => {
  try {
    const { name, price, short_description, description } = req.body;

    const uploadedImageUrl = req.file
      ? `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`
      : null;

    if (!uploadedImageUrl) {
      return res.status(400).json({ error: "Product image upload is required." });
    }

    if (!name || !price || !short_description || !description) {
      return res.status(400).json({ error: "All product fields are required." });
    }

    const db = await getDatabase();
    const result = await db.run(
      `
      INSERT INTO products (name, price, image, short_description, description)
      VALUES (?, ?, ?, ?, ?)
      `,
      name,
      price,
      uploadedImageUrl,
      short_description,
      description
    );

    res.status(201).json({ id: result.lastID });
  } catch (error) {
    next(error);
  }
});

// Admin endpoint: PUT /api/products/:id
router.put("/:id", requireAdmin, upload.single("image_file"), async (req, res, next) => {
  try {
    const { name, price, short_description, description } = req.body;
    const db = await getDatabase();
    const existingProduct = await db.get("SELECT * FROM products WHERE id = ?", req.params.id);

    if (!existingProduct) {
      return res.status(404).json({ error: "Product not found." });
    }

    const uploadedImageUrl = req.file
      ? `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`
      : null;
    const imageUrl = uploadedImageUrl || existingProduct.image;

    if (!name || !price || !imageUrl || !short_description || !description) {
      return res.status(400).json({ error: "All product fields are required." });
    }

    await db.run(
      `
      UPDATE products
      SET name = ?, price = ?, image = ?, short_description = ?, description = ?
      WHERE id = ?
      `,
      name,
      price,
      imageUrl,
      short_description,
      description,
      req.params.id
    );

    res.json({ message: "Product updated." });
  } catch (error) {
    next(error);
  }
});

// Admin endpoint: DELETE /api/products/:id
router.delete("/:id", requireAdmin, async (req, res, next) => {
  try {
    const db = await getDatabase();
    await db.run("DELETE FROM products WHERE id = ?", req.params.id);
    res.json({ message: "Product deleted." });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
