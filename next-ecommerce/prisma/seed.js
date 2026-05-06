const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const sampleProducts = [
  {
    name: "Ceramic Coffee Mug",
    slug: "ceramic-coffee-mug",
    price: "18.99",
    imageUrl:
      "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?auto=format&fit=crop&w=900&q=80",
    shortDescription: "Minimal ceramic mug for slow mornings.",
    description:
      "A premium ceramic coffee mug with a smooth matte finish. Perfect for coffee, tea, or hot chocolate.",
    category: "Home",
    stock: 40,
    active: true,
  },
  {
    name: "Canvas Tote Bag",
    slug: "canvas-tote-bag",
    price: "26.50",
    imageUrl:
      "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=900&q=80",
    shortDescription: "Durable everyday tote with clean style.",
    description:
      "A strong canvas tote bag designed for everyday errands, work, markets, and casual use.",
    category: "Accessories",
    stock: 30,
    active: true,
  },
  {
    name: "Minimal Table Lamp",
    slug: "minimal-table-lamp",
    price: "59.00",
    imageUrl:
      "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=900&q=80",
    shortDescription: "Warm light for desks and bedrooms.",
    description:
      "A minimal table lamp with a warm tone, perfect for a bedroom, workspace, or reading corner.",
    category: "Lighting",
    stock: 15,
    active: true,
  },
  {
    name: "Desk Notebook",
    slug: "desk-notebook",
    price: "14.00",
    imageUrl:
      "https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&w=900&q=80",
    shortDescription: "Simple notebook for ideas and plans.",
    description:
      "A clean, lightweight notebook with smooth pages for journaling, notes, sketches, and planning.",
    category: "Office",
    stock: 70,
    active: true,
  },
];

async function main() {
  console.log("Seeding sample products...");

  for (const product of sampleProducts) {
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: product,
      create: product,
    });
  }

  // Optional in a future step:
  // Create an admin user here after auth flows are implemented.

  console.log(`Seed complete. ${sampleProducts.length} products are ready.`);
}

main()
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
