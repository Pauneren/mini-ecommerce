export default function OrderStatusBadge({ status = "pending" }) {
  return (
    <span className="inline-flex rounded-full bg-amber-100 px-2 py-1 text-xs font-medium text-amber-700">
      {status}
    </span>
  );
}
