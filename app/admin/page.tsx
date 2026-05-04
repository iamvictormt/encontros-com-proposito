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
    <div className="space-y-16">
      <section>
        <div className="flex items-center gap-3 mb-8">
          <div className="h-1 w-8 bg-brand-orange rounded-full" />
          <h2 className="text-[10px] font-black text-brand-black uppercase tracking-[0.3em]">
            Visão Geral e Relatórios
          </h2>
        </div>
        <AdminStats stats={data?.stats} />
      </section>

      <section className="space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div className="space-y-2">
            <span className="glass-dark px-4 py-1.5 rounded-full text-[10px] font-black text-white uppercase tracking-[0.3em]">
              Eventos
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-brand-black tracking-tighter uppercase mt-4">
              Criação e <span className="text-brand-red">Moderação</span>
            </h2>
          </div>
          <div className="flex flex-wrap gap-4 w-full md:w-auto">
            <Button className="bg-brand-red hover:bg-brand-red/90 text-white font-black uppercase tracking-widest text-[10px] px-8 h-14 rounded-2xl shadow-lg shadow-brand-red/20 flex-1 md:flex-none" asChild>
              <Link href="/admin/events">Criar Novo Evento</Link>
            </Button>
            <Button
              variant="outline"
              className="h-14 px-8 border-brand-black/10 bg-white rounded-2xl text-brand-black font-black uppercase tracking-widest text-[10px] hover:bg-brand-black hover:text-white transition-all flex-1 md:flex-none"
              asChild
            >
              <Link href="/admin/events">Ver todos</Link>
            </Button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {data?.events.map((event: any) => (
            <AdminEventCard key={event.id} {...event} />
          ))}
        </div>
      </section>

      <section className="space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div className="space-y-2">
            <span className="glass-dark px-4 py-1.5 rounded-full text-[10px] font-black text-white uppercase tracking-[0.3em]">
              Parceiros
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-brand-black tracking-tighter uppercase mt-4">
              Aprovação de <span className="text-brand-green">Locais</span>
            </h2>
          </div>
          <Button
            variant="outline"
            className="h-14 px-8 border-brand-black/10 bg-white rounded-2xl text-brand-black font-black uppercase tracking-widest text-[10px] hover:bg-brand-black hover:text-white transition-all w-full md:w-auto"
            asChild
          >
            <Link href="/admin/venues">Ver todos os locais</Link>
          </Button>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {data?.venues.map((venue: any, i: number) => (
            <VenueApprovalCard key={i} {...venue} />
          ))}
        </div>
      </section>

      <section className="space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div className="space-y-2">
            <span className="glass-dark px-4 py-1.5 rounded-full text-[10px] font-black text-white uppercase tracking-[0.3em]">
              Marcas
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-brand-black tracking-tighter uppercase mt-4">
              Marcas <span className="text-brand-orange">Parceiras</span>
            </h2>
          </div>
          <Button
            variant="outline"
            className="h-14 px-8 border-brand-black/10 bg-white rounded-2xl text-brand-black font-black uppercase tracking-widest text-[10px] hover:bg-brand-black hover:text-white transition-all w-full md:w-auto"
            asChild
          >
            <Link href="/admin/brands">Ver todas as marcas</Link>
          </Button>
        </div>
        <BrandContentTable brands={data?.brands} />
      </section>

      <section className="space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div className="space-y-2">
            <span className="glass-dark px-4 py-1.5 rounded-full text-[10px] font-black text-white uppercase tracking-[0.3em]">
              Equipe
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-brand-black tracking-tighter uppercase mt-4">
              Gestão de <span className="text-brand-green">Cargos</span>
            </h2>
          </div>
          <Button
            variant="outline"
            className="h-14 px-8 border-brand-black/10 bg-white rounded-2xl text-brand-black font-black uppercase tracking-widest text-[10px] hover:bg-brand-black hover:text-white transition-all w-full md:w-auto"
            asChild
          >
            <Link href="/admin/team">Ver toda a equipe</Link>
          </Button>
        </div>
          <RoleAssignmentList team={data?.team} />

      </section>
    </div>
  );
}
