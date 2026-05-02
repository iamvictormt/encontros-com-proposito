"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { AdminStats } from "@/components/admin-stats";
import { AdminEventCard } from "@/components/admin-event-card";
import { VenueApprovalCard } from "@/components/venue-approval-card";
import { BrandContentTable } from "@/components/brand-content-table";
import { RoleAssignmentList } from "@/components/role-assignment-list";
import { Loader2 } from "lucide-react";
import Link from "next/link";

export default function AdminOverview() {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [reportsRes, eventsRes, venuesRes, brandsRes, teamRes] = await Promise.all([
          fetch("/api/admin/reports"),
          fetch("/api/events"),
          fetch("/api/venues"),
          fetch("/api/brands"),
          fetch("/api/team")
        ]);

        const safeJson = async (res: Response) => {
          if (!res.ok) return null;
          const contentType = res.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            return res.json();
          }
          return null;
        };

        const reportsData = await safeJson(reportsRes);
        const eventsData = await safeJson(eventsRes);
        const venuesData = await safeJson(venuesRes);
        const brandsData = await safeJson(brandsRes);
        const teamData = await safeJson(teamRes);

        setData({
          stats: reportsData?.stats || [],
          events: Array.isArray(eventsData) ? eventsData.slice(0, 3) : [],
          venues: Array.isArray(venuesData) ? venuesData.slice(0, 4) : [],
          brands: Array.isArray(brandsData) ? brandsData.slice(0, 4) : [],
          team: Array.isArray(teamData) ? teamData.slice(0, 4).map((m:any) => ({
            ...m,
            user: { name: m.full_name, avatar: m.avatar || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=800&auto=format&fit=crop&q=60" }
          })) : []
        });
      } catch (error) {
        console.error("Error fetching overview data", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  if (isLoading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-primary w-12 h-12" /></div>;

  return (
    <div className="space-y-12 animate-fade-in">
      <section className="bg-white/50 backdrop-blur-sm p-8 rounded-[2.5rem] shadow-xl border border-white">
        <h2 className="text-3xl font-black uppercase italic text-black mb-10 tracking-tight">Relatórios Gerais</h2>
        <AdminStats stats={data?.stats} />
      </section>

      <section className="space-y-8 bg-white/50 backdrop-blur-sm p-8 rounded-[2.5rem] shadow-xl border border-white">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
          <h2 className="text-3xl font-black uppercase italic text-black tracking-tight">Criação e Moderação</h2>
          <div className="flex flex-wrap gap-4 w-full md:w-auto">
            <Button className="bg-accent hover:bg-accent/90 text-white font-black uppercase italic py-7 px-8 rounded-2xl flex-1 md:flex-none" asChild>
              <Link href="/admin/events">Criar Novo Evento</Link>
            </Button>
            <Button
              variant="outline"
              className="bg-white text-black border-gray-200 font-black uppercase italic py-7 px-8 rounded-2xl flex-1 md:flex-none"
              asChild
            >
              <Link href="/admin/events">Ver todos</Link>
            </Button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data?.events.map((event: any) => (
            <AdminEventCard key={event.id} {...event} />
          ))}
        </div>
      </section>

      <section className="space-y-8 bg-white/50 backdrop-blur-sm p-8 rounded-[2.5rem] shadow-xl border border-white">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
          <h2 className="text-3xl font-black uppercase italic text-black tracking-tight">Aprovação de Locais</h2>
          <div className="flex gap-4 items-center w-full md:w-auto">
            <Button
              variant="outline"
              className="bg-white text-black border-gray-200 w-full md:w-auto"
              asChild
            >
              <Link href="/admin/venues">Ver todos os locais</Link>
            </Button>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {data?.venues.map((venue: any, i: number) => (
            <VenueApprovalCard key={i} {...venue} />
          ))}
        </div>
      </section>

      <section className="space-y-6 bg-white p-4 rounded-md">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <h2 className="text-xl font-bold text-black">Edição de Marcas parceiras</h2>
          <Button
            variant="outline"
            className="bg-white text-black border-gray-200 w-full md:w-auto"
            asChild
          >
            <Link href="/admin/brands">Ver todos</Link>
          </Button>
        </div>
        <BrandContentTable brands={data?.brands} />
      </section>

      <section className="space-y-6 bg-white p-4 rounded-md">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <h2 className="text-xl font-bold text-black">Atribuição de Cargos</h2>
          <div className="flex gap-4 items-center w-full md:w-auto">
            <Button
              variant="outline"
              className="bg-white text-black border-gray-200 w-full md:w-auto"
              asChild
            >
              <Link href="/admin/team">Ver todos</Link>
            </Button>
          </div>
        </div>
        <RoleAssignmentList team={data?.team} />
      </section>
    </div>
  );
}
