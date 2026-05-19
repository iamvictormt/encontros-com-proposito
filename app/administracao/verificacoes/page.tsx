"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Loader2, 
  CheckCircle2, 
  XCircle, 
  FileText, 
  ExternalLink, 
  Video, 
  Search, 
  Filter, 
  Mail, 
  Phone, 
  MapPin, 
  UserCircle2
} from "lucide-react";
import { toast } from "sonner";
import { ConfirmModal } from "@/components/modals/confirm-modal";
import { AdminPagination } from "@/components/admin-pagination";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

export default function AdminVerifications() {
  const [verifications, setVerifications] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("recent"); // "recent" | "old"
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    description: string;
    onConfirm: () => void;
    variant: "default" | "destructive" | "secondary";
  }>({
    isOpen: false,
    title: "",
    description: "",
    onConfirm: () => {},
    variant: "default",
  });

  const fetchVerifications = async () => {
    try {
      const res = await fetch("/api/admin/verifications");
      if (res.ok) {
        const data = await res.json();
        setVerifications(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchVerifications();
  }, []);

  // Reset page on search
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const handleAction = async (id: string, status: string) => {
    setActionLoading(id);
    try {
      const res = await fetch(`/api/admin/verifications/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        toast.success(`Usuário ${status.toLowerCase()} com sucesso!`);
        fetchVerifications();
      } else {
        toast.error("Erro ao atualizar status");
      }
    } catch (error) {
      console.error(error);
      toast.error("Erro ao conectar com servidor");
    } finally {
      setActionLoading(null);
    }
  };

  const confirmAction = (id: string, status: string, name: string) => {
    const actions: Record<string, any> = {
      APROVADO: {
        title: "Aprovar Usuário",
        description: `Tem certeza que deseja aprovar ${name}? O usuário terá acesso aos benefícios da sua categoria.`,
        variant: "default"
      },
      RECUSADO: {
        title: "Recusar Usuário",
        description: `Tem certeza que deseja recusar o cadastro de ${name}? O usuário não terá acesso à plataforma.`,
        variant: "destructive"
      },
      AGUARDANDO_REUNIAO: {
        title: "Solicitar Reunião",
        description: `Deseja marcar o status de ${name} como aguardando reunião de alinhamento?`,
        variant: "secondary"
      }
    };

    const config = actions[status];

    setConfirmModal({
      isOpen: true,
      title: config.title,
      description: config.description,
      variant: config.variant,
      onConfirm: () => handleAction(id, status)
    });
  };

  const filteredVerifications = verifications
    .filter(v => 
      (v.full_name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (v.email || "").toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      // Usar a data de criação ou id como fallback
      const dateA = a.created_at ? new Date(a.created_at).getTime() : Number(a.id) || 0;
      const dateB = b.created_at ? new Date(b.created_at).getTime() : Number(b.id) || 0;
      return filterType === "recent" ? dateB - dateA : dateA - dateB;
    });

  const totalPages = Math.max(1, Math.ceil(filteredVerifications.length / itemsPerPage));
  const paginatedVerifications = filteredVerifications.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="space-y-16 pb-12">
      <section className="space-y-12">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8">
          <div className="space-y-2">
            <span className="glass-dark px-4 py-1.5 rounded-full text-[10px] font-black text-white uppercase tracking-[0.3em]">
              Auditoria
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-brand-black tracking-tighter uppercase mt-4">
              Verificação de <span className="text-brand-orange">Usuários</span>
            </h2>
            <p className="text-gray-500 font-medium">Aprove novos membros, empresas e parceiros.</p>
          </div>

          <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-4 w-full lg:w-auto">
            <div className="relative flex-1 sm:w-80">
              <Search className="h-4 w-4 absolute left-4 top-1/2 -translate-y-1/2 text-brand-green" />
              <Input
                placeholder="Buscar por nome ou e-mail..."
                className="pl-12 h-14 bg-white border-brand-green/10 rounded-2xl focus:ring-brand-orange/20 focus:border-brand-orange transition-all w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex gap-4 w-full sm:w-auto">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="h-14 px-6 border-brand-black/10 bg-white rounded-2xl text-brand-black font-black uppercase tracking-widest text-[10px] hover:bg-brand-black hover:text-white transition-all flex-1 sm:flex-none gap-3"
                  >
                    <Filter className="h-4 w-4 text-brand-orange" />
                    <span>
                      {filterType === "recent" ? "Mais Recentes" : "Mais Antigos"}
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 glass border-white/20 p-2 rounded-2xl">
                  <DropdownMenuItem 
                    onClick={() => setFilterType("recent")}
                    className={cn(
                      "rounded-xl px-4 py-3 text-[10px] font-black uppercase tracking-widest transition-all",
                      filterType === "recent" ? "bg-brand-black text-white" : "text-brand-black/60 hover:bg-brand-black/5"
                    )}
                  >
                    Mais Recentes
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => setFilterType("old")}
                    className={cn(
                      "rounded-xl px-4 py-3 text-[10px] font-black uppercase tracking-widest transition-all",
                      filterType === "old" ? "bg-brand-black text-white" : "text-brand-black/60 hover:bg-brand-black/5"
                    )}
                  >
                    Mais Antigos
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-24 grayscale opacity-30"><Loader2 className="animate-spin text-brand-black w-12 h-12" /></div>
        ) : (
          <div className="space-y-12">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {paginatedVerifications.map((v) => {
                const docUrl = v.document_url || v.company_docs_url || v.partner_docs_url;
                return (
                  <div key={v.id} className="bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100 flex flex-col relative overflow-hidden group hover:shadow-xl transition-all duration-300">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-brand-orange/5 to-transparent rounded-bl-full -z-0" />
                    
                    <div className="relative z-10 flex justify-between items-start mb-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
                          <UserCircle2 className="w-8 h-8" />
                        </div>
                        <div>
                          <h3 className="font-black text-brand-black leading-tight uppercase tracking-tight line-clamp-1">{v.full_name}</h3>
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-black bg-brand-black/5 text-brand-black uppercase tracking-[0.2em] mt-1">
                            {v.user_category}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3 mb-8 relative z-10">
                      <div className="flex items-center gap-3 text-xs text-gray-500 font-medium">
                        <Mail className="w-4 h-4 text-brand-orange" />
                        <span className="truncate">{v.email}</span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-gray-500 font-medium">
                        <Phone className="w-4 h-4 text-brand-green" />
                        <span>{v.phone || "Não informado"}</span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-gray-500 font-medium">
                        <MapPin className="w-4 h-4 text-brand-red" />
                        <span>{v.city || "Não informada"}</span>
                      </div>
                    </div>

                    <div className="mt-auto relative z-10">
                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl mb-4 border border-gray-100">
                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">Status</span>
                        <span className={cn(
                          "px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest",
                          v.verification_status === "EM_ANALISE" ? "bg-brand-orange/10 text-brand-orange" : 
                          v.verification_status === "AGUARDANDO_REUNIAO" ? "bg-blue-100 text-blue-600" :
                          "bg-gray-100 text-gray-500"
                        )}>
                          {v.verification_status.replace("_", " ")}
                        </span>
                      </div>

                      {docUrl && (
                        <a 
                          href={docUrl} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="flex items-center justify-center gap-2 w-full h-10 mb-4 rounded-xl border border-brand-green/20 text-brand-green hover:bg-brand-green/5 text-[10px] font-black uppercase tracking-widest transition-colors"
                        >
                          <FileText className="w-4 h-4" /> Visualizar Documento <ExternalLink className="w-3 h-3 ml-1" />
                        </a>
                      )}

                      <div className="grid grid-cols-3 gap-2">
                        <Button
                          variant="outline"
                          className="h-12 border-brand-red/20 text-brand-red hover:bg-brand-red/10 rounded-xl"
                          onClick={() => confirmAction(v.id, "RECUSADO", v.full_name)}
                          disabled={actionLoading === v.id}
                          title="Recusar"
                        >
                          <XCircle className="w-5 h-5" />
                        </Button>
                        <Button
                          variant="outline"
                          className="h-12 border-blue-200 text-blue-600 hover:bg-blue-50 rounded-xl"
                          onClick={() => confirmAction(v.id, "AGUARDANDO_REUNIAO", v.full_name)}
                          disabled={actionLoading === v.id}
                          title="Solicitar Reunião"
                        >
                          <Video className="w-5 h-5" />
                        </Button>
                        <Button
                          className="h-12 bg-brand-green hover:bg-brand-green/90 text-white rounded-xl shadow-lg shadow-brand-green/20"
                          onClick={() => confirmAction(v.id, "APROVADO", v.full_name)}
                          disabled={actionLoading === v.id}
                          title="Aprovar"
                        >
                          {actionLoading === v.id ? <Loader2 className="w-5 h-5 animate-spin" /> : <CheckCircle2 className="w-5 h-5" />}
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {paginatedVerifications.length === 0 && (
              <div className="text-center py-24 glass rounded-[2.5rem] border-dashed border-brand-green/20">
                <div className="text-6xl mb-6 grayscale opacity-50">🛡️</div>
                <h3 className="text-xl sm:text-2xl font-black text-brand-black mb-2 uppercase tracking-tight">
                  Tudo Limpo!
                </h3>
                <p className="text-gray-500 max-w-md mx-auto text-sm leading-relaxed px-4 font-medium">
                  Não há perfis pendentes de verificação com esses critérios no momento.
                </p>
              </div>
            )}

            {filteredVerifications.length > 0 && (
              <AdminPagination 
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                totalItems={filteredVerifications.length}
                itemsPerPage={itemsPerPage}
                itemName="usuários"
              />
            )}
          </div>
        )}
      </section>

      <ConfirmModal
        isOpen={confirmModal.isOpen}
        title={confirmModal.title}
        description={confirmModal.description}
        onConfirm={() => {
          confirmModal.onConfirm();
          setConfirmModal((prev) => ({ ...prev, isOpen: false }));
        }}
        onClose={() => setConfirmModal((prev) => ({ ...prev, isOpen: false }))}
        variant={confirmModal.variant}
      />
    </div>
  );
}
