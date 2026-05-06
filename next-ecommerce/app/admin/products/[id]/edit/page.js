export default function AdminEditProductPage({ params }) {
  return (
    <section className="space-y-3">
      <h1 className="text-2xl font-bold">Edit Product</h1>
      <p className="text-slate-600">Editing placeholder product id: {params.id}</p>
    </section>
  );
}
