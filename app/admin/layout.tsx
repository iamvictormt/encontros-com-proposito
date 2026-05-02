import { AdminSidebar } from "@/components/admin-sidebar";
import { AdminMobileHeader } from "@/components/admin-mobile-header";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-white">
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-h-screen">
        <AdminMobileHeader />
        <main className="flex-1 p-4 lg:p-8 overflow-y-auto">
          <div className="mx-auto max-w-7xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
