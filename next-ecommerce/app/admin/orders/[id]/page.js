export default function AdminOrderDetailPage({ params }) {
  return (
    <section className="space-y-3">
      <h1 className="text-2xl font-bold">Order Detail</h1>
      <p className="text-slate-600">Viewing placeholder order id: {params.id}</p>
    </section>
  );
}
