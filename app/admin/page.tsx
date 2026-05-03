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
    <div className="space-y-12 pb-20">
      <header className="mb-12">
        <div className="flex items-center gap-3 mb-2">
          <div className="h-1 w-8 bg-brand-orange rounded-full" />
          <span className="text-[10px] font-black text-brand-black/40 uppercase tracking-[0.3em]">
            Administração
          </span>
        </div>
        <h1 className="text-4xl font-black uppercase tracking-tighter text-brand-black lg:text-5xl">
          Painel de <span className="text-brand-red">Controle</span>
        </h1>
      </header>

      <section className="glass rounded-[2rem] p-8 lg:p-10 border-brand-green/5">
        <div className="flex items-center gap-3 mb-8">
          <div className="h-1 w-6 bg-brand-green rounded-full" />
          <h2 className="text-[10px] font-black text-brand-black uppercase tracking-[0.3em]">
            Visão Geral e Relatórios
          </h2>
        </div>
        <AdminStats stats={data?.stats} />
      </section>

      <section className="glass rounded-[2rem] p-8 lg:p-10 border-brand-green/5">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <div className="h-1 w-6 bg-brand-red rounded-full" />
              <h2 className="text-[10px] font-black text-brand-black uppercase tracking-[0.3em]">
                Eventos
              </h2>
            </div>
            <p className="text-2xl font-black text-brand-black uppercase tracking-tight mt-2">
              Criação e Moderação
            </p>
          </div>
          <div className="flex flex-wrap gap-3 w-full md:w-auto">
            <Button className="bg-brand-red hover:bg-brand-red/90 text-white font-black uppercase tracking-widest text-[10px] px-8 h-12 rounded-xl shadow-lg shadow-brand-red/20 flex-1 md:flex-none" asChild>
              <Link href="/admin/events">Criar Novo Evento</Link>
            </Button>
            <Button
              variant="outline"
              className="bg-white/50 border-brand-green/10 text-brand-black hover:bg-brand-green hover:text-white font-black uppercase tracking-widest text-[10px] px-8 h-12 rounded-xl flex-1 md:flex-none"
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

      <section className="glass rounded-[2rem] p-8 lg:p-10 border-brand-green/5">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <div className="h-1 w-6 bg-brand-orange rounded-full" />
              <h2 className="text-[10px] font-black text-brand-black uppercase tracking-[0.3em]">
                Parceiros
              </h2>
            </div>
            <p className="text-2xl font-black text-brand-black uppercase tracking-tight mt-2">
              Aprovação de Locais & Empresas
            </p>
          </div>
          <Button
            variant="outline"
            className="bg-white/50 border-brand-green/10 text-brand-black hover:bg-brand-green hover:text-white font-black uppercase tracking-widest text-[10px] px-8 h-12 rounded-xl w-full md:w-auto"
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <section className="glass rounded-[2rem] p-8 lg:p-10 border-brand-green/5">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <div className="h-1 w-6 bg-brand-green rounded-full" />
                <h2 className="text-[10px] font-black text-brand-black uppercase tracking-[0.3em]">
                  Marcas
                </h2>
              </div>
              <p className="text-xl font-black text-brand-black uppercase tracking-tight mt-2">
                Edição de Parceiras
              </p>
            </div>
            <Button
              variant="outline"
              className="bg-white/50 border-brand-green/10 text-brand-black hover:bg-brand-green hover:text-white font-black uppercase tracking-widest text-[10px] px-6 h-10 rounded-xl"
              asChild
            >
              <Link href="/admin/brands">Ver todas</Link>
            </Button>
          </div>
          <BrandContentTable brands={data?.brands} />
        </section>

        <section className="glass rounded-[2rem] p-8 lg:p-10 border-brand-green/5">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <div className="h-1 w-6 bg-brand-red rounded-full" />
                <h2 className="text-[10px] font-black text-brand-black uppercase tracking-[0.3em]">
                  Time
                </h2>
              </div>
              <p className="text-xl font-black text-brand-black uppercase tracking-tight mt-2">
                Atribuição de Cargos
              </p>
            </div>
            <Button
              variant="outline"
              className="bg-white/50 border-brand-green/10 text-brand-black hover:bg-brand-green hover:text-white font-black uppercase tracking-widest text-[10px] px-6 h-10 rounded-xl"
              asChild
            >
              <Link href="/admin/team">Ver todos</Link>
            </Button>
          </div>
          <RoleAssignmentList team={data?.team} />
        </section>
      </div>
    </div>
  );
}
