import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/formatters";

async function getProduct(idOrSlug) {
  if (!process.env.DATABASE_URL) {
    return { product: null, error: "DATABASE_URL is missing. Add it to your .env.local file." };
  }

  try {
    const product = await prisma.product.findFirst({
      where: {
        active: true,
        OR: [{ id: idOrSlug }, { slug: idOrSlug }],
      },
    });

    return { product, error: null };
  } catch (error) {
    console.error("Failed to fetch product detail:", error);
    return {
      product: null,
      error:
        "We couldn't load this product right now. Check your database connection and Prisma setup.",
    };
  }
}

export default async function ProductDetailPage({ params }) {
  const { product, error } = await getProduct(params.id);

  if (!error && !product) {
    notFound();
  }

  if (error) {
    return (
      <section className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-amber-900">
        {error}
      </section>
    );
  }

  const isOutOfStock = product.stock <= 0;

  return (
    <section className="rounded-2xl bg-white p-6 shadow-sm md:p-8">
      <div className="grid gap-8 md:grid-cols-2">
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-100">
          <img src={product.imageUrl} alt={product.name} className="h-full w-full object-cover" />
        </div>

        <div className="space-y-5">
          <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
            {product.category || "General"}
          </p>
          <h1 className="text-3xl font-bold text-slate-900">{product.name}</h1>
          <p className="text-2xl font-bold text-slate-900">{formatPrice(product.price)}</p>

          <p className={`text-sm font-semibold ${isOutOfStock ? "text-rose-600" : "text-emerald-600"}`}>
            {isOutOfStock ? "Out of stock" : `In stock: ${product.stock}`}
          </p>

          <p className="text-slate-700">{product.shortDescription}</p>
          <p className="leading-relaxed text-slate-600">{product.description}</p>

          <button
            type="button"
            disabled={isOutOfStock}
            className="rounded-full bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            Add to cart
          </button>
        </div>
      </div>
    </section>
  );
}
