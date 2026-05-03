import { AdminSidebar } from "@/components/admin-sidebar";
import { AdminMobileHeader } from "@/components/admin-mobile-header";
import { AdminBottomNav } from "@/components/admin-bottom-nav";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-background selection:bg-brand-orange/30">
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-h-screen relative">
        <AdminMobileHeader />
        <main className="flex-1 p-4 lg:p-12 lg:pl-4 overflow-y-auto pb-32 lg:pb-12">
          <div className="mx-auto max-w-7xl animate-in fade-in slide-in-from-bottom-4 duration-700">
            {children}
          </div>
        </main>
        <AdminBottomNav />
      </div>
    </div>
  );
}
