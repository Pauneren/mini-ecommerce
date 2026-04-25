const express = require("express");
const { getDatabase } = require("../database");

const router = express.Router();

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// POST /api/orders
router.post("/", async (req, res, next) => {
  try {
    const { customer, items } = req.body;

    if (!customer || !items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: "Customer details and cart items are required." });
    }

    const requiredFields = ["name", "email", "phone", "address", "city", "postal_code"];

    for (const field of requiredFields) {
      if (!customer[field]) {
        return res.status(400).json({ error: `${field} is required.` });
      }
    }

    if (!isValidEmail(customer.email)) {
      return res.status(400).json({ error: "A valid email is required." });
    }

    const db = await getDatabase();

    // Get product prices from the database, not from the browser.
    let total = 0;
    const preparedItems = [];

    for (const item of items) {
      if (!item.product_id || !item.quantity || item.quantity < 1) {
        return res.status(400).json({ error: "Invalid order item." });
      }

      const product = await db.get("SELECT * FROM products WHERE id = ?", item.product_id);

      if (!product) {
        return res.status(404).json({ error: `Product ${item.product_id} not found.` });
      }

      const quantity = Number(item.quantity);
      total += product.price * quantity;

      preparedItems.push({
        product_id: product.id,
        product_name: product.name,
        quantity,
        price: product.price,
      });
    }

    const orderResult = await db.run(
      `
      INSERT INTO orders (
        customer_name,
        customer_email,
        customer_phone,
        address,
        city,
        postal_code,
        notes,
        total
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `,
      customer.name,
      customer.email,
      customer.phone,
      customer.address,
      customer.city,
      customer.postal_code,
      customer.notes || "",
      total
    );

    const orderId = orderResult.lastID;

    for (const item of preparedItems) {
      await db.run(
        `
        INSERT INTO order_items (order_id, product_id, product_name, quantity, price)
        VALUES (?, ?, ?, ?, ?)
        `,
        orderId,
        item.product_id,
        item.product_name,
        item.quantity,
        item.price
      );
    }

    res.status(201).json({
      message: "Order created successfully.",
      order_id: orderId,
      total,
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/orders
router.get("/", async (req, res, next) => {
  try {
    const db = await getDatabase();

    const orders = await db.all("SELECT * FROM orders ORDER BY created_at DESC");

    for (const order of orders) {
      order.items = await db.all(
        "SELECT product_id, product_name, quantity, price FROM order_items WHERE order_id = ?",
        order.id
      );
    }

    res.json(orders);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
