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
    <div className="space-y-12 pb-24">
      <header className="mb-12">
        <h1 className="text-4xl sm:text-6xl font-black text-black uppercase italic tracking-tighter mb-2">
          Dashboard <span className="text-primary">Admin</span>
        </h1>
        <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest">Controle total da plataforma MeetOff</p>
      </header>

      <section className="bg-gray-50 p-8 sm:p-12 rounded-[3.5rem] border border-gray-100">
        <h2 className="text-2xl font-black italic uppercase text-black mb-10 tracking-tight">Relatórios de Performance</h2>
        <AdminStats stats={data?.stats} />
      </section>

      <section className="space-y-10 bg-white p-2 rounded-md">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <h2 className="text-3xl font-black italic uppercase text-black tracking-tight">Gestão de Eventos</h2>
          <div className="flex flex-wrap gap-4 w-full md:w-auto">
            <Button className="bg-accent hover:bg-accent/90 text-white flex-1 md:flex-none" asChild>
              <Link href="/admin/events">Criar Novo Evento</Link>
            </Button>
            <Button
              variant="outline"
              className="bg-white text-black border-gray-200 flex-1 md:flex-none"
              asChild
            >
              <Link href="/admin/events">Ver todos os eventos</Link>
            </Button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data?.events.map((event: any) => (
            <AdminEventCard key={event.id} {...event} />
          ))}
        </div>
      </section>

      <section className="space-y-10 bg-white p-2 rounded-md">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <h2 className="text-3xl font-black italic uppercase text-black tracking-tight">Locais & Empresas</h2>
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

      <section className="space-y-10 bg-white p-2 rounded-md">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <h2 className="text-3xl font-black italic uppercase text-black tracking-tight">Marcas Parceiras</h2>
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

      <section className="space-y-10 bg-white p-2 rounded-md">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <h2 className="text-3xl font-black italic uppercase text-black tracking-tight">Equipe & Cargos</h2>
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
