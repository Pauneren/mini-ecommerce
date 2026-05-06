import Link from "next/link";
import { formatPrice } from "@/lib/formatters";

export default function ProductCard({ product }) {
  const href = `/products/${product.slug || product.id}`;
  const isOutOfStock = product.stock <= 0;

  return (
    <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <Link href={href} className="block">
        <div className="aspect-[4/3] w-full bg-slate-100">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="h-full w-full object-cover"
            loading="lazy"
          />
        </div>
      </Link>

      <div className="space-y-3 p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              {product.category || "General"}
            </p>
            <Link href={href} className="mt-1 block text-lg font-semibold text-slate-900 hover:text-slate-700">
              {product.name}
            </Link>
          </div>
          <p className="text-base font-bold text-slate-900">{formatPrice(product.price)}</p>
        </div>

        <p className="line-clamp-2 text-sm text-slate-600">{product.shortDescription}</p>

        <div className="flex items-center justify-between pt-1">
          <p
            className={`text-sm font-medium ${
              isOutOfStock ? "text-rose-600" : "text-emerald-600"
            }`}
          >
            {isOutOfStock ? "Out of stock" : `In stock: ${product.stock}`}
          </p>
          <Link
            href={href}
            className="rounded-full border border-slate-300 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-700 hover:bg-slate-100"
          >
            View
          </Link>
        </div>
      </div>
    </article>
  );
}
