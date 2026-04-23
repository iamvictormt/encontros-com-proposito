"use client";

import { useEffect, useState } from "react";
import { RoleAssignmentList } from "@/components/role-assignment-list";
import { Search, Filter, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function AdminTeam() {
  const [team, setTeam] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/team");
      const data = await res.json();
      setTeam(data.map((m:any) => ({
        ...m,
        user: { name: m.full_name, avatar: m.avatar || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=800&auto=format&fit=crop&q=60" }
      })));
    } catch (error) {
      toast.error("Erro ao carregar equipe");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleUpdateRole = async (id: string, role: string, isAdmin: boolean) => {
    try {
      const res = await fetch("/api/team", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, role, isAdmin })
      });
      if (res.ok) {
        toast.success("Cargo atualizado");
        fetchData();
      }
    } catch (error) {
      toast.error("Erro ao atualizar cargo");
    }
  };

  const filteredTeam = team.filter(m =>
    m.full_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <section className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <h2 className="text-xl font-bold text-black">Atribuição de Cargos</h2>
        <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-4 w-full md:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-black" />
            <Input
              className="pl-10 h-10 bg-white border-gray-200 rounded-lg w-full"
              placeholder="Procurar usuário"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button
            variant="outline"
            className="h-10 border-gray-200 bg-white text-gray-600 gap-2 w-full sm:w-auto"
          >
            <Filter className="h-4 w-4 text-black" />
            <span>Filtro</span>
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12"><Loader2 className="animate-spin text-primary w-8 h-8" /></div>
      ) : (
        <RoleAssignmentList team={filteredTeam} />
      )}
    </section>
  );
}
