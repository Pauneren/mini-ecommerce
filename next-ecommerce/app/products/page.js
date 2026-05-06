import ProductCard from "@/components/ProductCard";
import { prisma } from "@/lib/prisma";

async function getActiveProducts() {
  if (!process.env.DATABASE_URL) {
    return { products: [], error: "DATABASE_URL is missing. Add it to your .env.local file." };
  }

  try {
    const products = await prisma.product.findMany({
      where: { active: true },
      orderBy: { createdAt: "desc" },
    });

    return { products, error: null };
  } catch (error) {
    console.error("Failed to fetch products:", error);
    return {
      products: [],
      error:
        "We couldn't load products right now. Check your database connection and run Prisma migrations/seed.",
    };
  }
}

export default async function ProductsPage() {
  const { products, error } = await getActiveProducts();

  return (
    <section className="space-y-8">
      <header className="rounded-2xl bg-white p-8 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">Catalog</p>
        <h1 className="mt-2 text-3xl font-bold text-slate-900">All Products</h1>
        <p className="mt-2 max-w-2xl text-slate-600">
          Browse active products from PostgreSQL. Newest items appear first.
        </p>
      </header>

      {error ? (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-amber-900">{error}</div>
      ) : null}

      {!error && products.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">No active products yet</h2>
          <p className="mt-2 text-slate-600">Seed products or add active items to see them here.</p>
        </div>
      ) : null}

      {products.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : null}
    </section>
  );
}
