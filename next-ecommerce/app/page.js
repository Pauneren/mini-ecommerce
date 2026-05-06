import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import { prisma } from "@/lib/prisma";

async function getFeaturedProducts() {
  if (!process.env.DATABASE_URL) {
    return { products: [], error: "DATABASE_URL is missing. Add it to your .env.local file." };
  }

  try {
    const products = await prisma.product.findMany({
      where: { active: true },
      orderBy: { createdAt: "desc" },
      take: 3,
    });

    return { products, error: null };
  } catch (error) {
    console.error("Failed to fetch featured products:", error);
    return {
      products: [],
      error:
        "We couldn't load featured products right now. Check your database connection and Prisma setup.",
    };
  }
}

export default async function HomePage() {
  const { products, error } = await getFeaturedProducts();

  return (
    <div className="space-y-10">
      <section className="overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 p-8 text-white shadow-xl md:p-12">
        <p className="text-sm font-semibold uppercase tracking-wider text-slate-300">Modern online store</p>
        <h1 className="mt-4 max-w-2xl text-4xl font-bold leading-tight md:text-5xl">
          Premium essentials for your everyday life.
        </h1>
        <p className="mt-4 max-w-2xl text-base text-slate-200 md:text-lg">
          Discover curated products with a clean shopping experience powered by Next.js and
          PostgreSQL.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/products"
            className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-900 hover:bg-slate-100"
          >
            Shop products
          </Link>
        </div>
      </section>

      <section className="space-y-5">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">Featured</p>
            <h2 className="text-2xl font-bold text-slate-900">Latest active products</h2>
          </div>
          <Link href="/products" className="text-sm font-semibold text-slate-700 hover:text-slate-900">
            View all
          </Link>
        </div>

        {error ? (
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-amber-900">{error}</div>
        ) : null}

        {!error && products.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-8 text-slate-600 shadow-sm">
            No featured products are available yet.
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
    </div>
  );
}
