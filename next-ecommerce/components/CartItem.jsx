export default function CartItem({ item }) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-white p-4">
      <p className="font-medium">{item?.name || "Cart item"}</p>
      <p className="text-sm text-slate-600">{item?.quantity || 1}x</p>
    </div>
  );
}
