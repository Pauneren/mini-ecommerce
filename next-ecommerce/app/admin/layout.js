import AdminSidebar from "@/components/AdminSidebar";

export default function AdminLayout({ children }) {
  return (
    <div className="grid gap-6 md:grid-cols-[240px_1fr]">
      <AdminSidebar />
      <div className="rounded-xl bg-white p-6 shadow-sm">{children}</div>
    </div>
  );
}
