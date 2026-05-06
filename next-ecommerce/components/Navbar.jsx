import Link from "next/link";

export default function Navbar() {
  return (
    <header className="border-b border-slate-200 bg-white">
      <nav className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4">
        <Link href="/" className="text-xl font-semibold">
          NextStore
        </Link>
        <div className="flex gap-4 text-sm font-medium text-slate-700">
          <Link href="/products">Products</Link>
          <Link href="/cart">Cart</Link>
          <Link href="/admin">Admin</Link>
        </div>
      </nav>
    </header>
  );
}
