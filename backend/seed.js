const { initializeDatabase } = require("./database");

const products = [
  {
    name: "Ceramic Coffee Mug",
    price: 18.99,
    image: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?auto=format&fit=crop&w=900&q=80",
    short_description: "Minimal ceramic mug for slow mornings.",
    description: "A premium ceramic coffee mug with a smooth matte finish. Perfect for coffee, tea, or hot chocolate."
  },
  {
    name: "Canvas Tote Bag",
    price: 26.5,
    image: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=900&q=80",
    short_description: "Durable everyday tote with clean style.",
    description: "A strong canvas tote bag designed for everyday errands, work, markets, and casual use."
  },
  {
    name: "Desk Notebook",
    price: 14.0,
    image: "https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&w=900&q=80",
    short_description: "Simple notebook for ideas and plans.",
    description: "A clean, lightweight notebook with smooth pages for journaling, notes, sketches, and planning."
  },
  {
    name: "Soft Linen Scarf",
    price: 34.99,
    image: "https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?auto=format&fit=crop&w=900&q=80",
    short_description: "Lightweight scarf with soft texture.",
    description: "A breathable linen scarf that adds texture and elegance to simple outfits."
  },
  {
    name: "Minimal Table Lamp",
    price: 59.0,
    image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=900&q=80",
    short_description: "Warm light for desks and bedrooms.",
    description: "A minimal table lamp with a warm tone, perfect for a bedroom, workspace, or reading corner."
  },
  {
    name: "Glass Water Bottle",
    price: 22.0,
    image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=900&q=80",
    short_description: "Reusable bottle for daily hydration.",
    description: "A reusable glass water bottle with a simple design and comfortable grip."
  }
];

async function seed() {
  const db = await initializeDatabase();

  await db.run("DELETE FROM order_items");
  await db.run("DELETE FROM orders");
  await db.run("DELETE FROM products");

  for (const product of products) {
    await db.run(
      `
      INSERT INTO products (name, price, image, short_description, description)
      VALUES (?, ?, ?, ?, ?)
      `,
      product.name,
      product.price,
      product.image,
      product.short_description,
      product.description
    );
  }

  console.log("Database seeded with example products.");
}

seed();
