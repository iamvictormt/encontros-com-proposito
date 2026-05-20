"use client";

import { useEffect, useState } from "react";
import { Edit2, Loader2, Save, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export default function AdminSubscriptions() {
  const [plans, setPlans] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    amount: "",
  });
  const [isSaving, setIsSaving] = useState(false);

  const fetchPlans = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/subscription-plans");
      if (res.ok) {
        const data = await res.json();
        setPlans(data);
      } else {
        toast.error("Erro ao carregar planos de assinatura");
      }
    } catch (error) {
      toast.error("Erro de conexão ao buscar planos");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  const handleEditClick = (plan: any) => {
    setEditingId(plan.id);
    setFormData({
      name: plan.name,
      description: plan.description || "",
      amount: String(plan.amount),
    });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
  };

  const handleSave = async (id: string) => {
    if (!formData.name.trim() || !formData.amount) {
      toast.error("Nome e Valor são obrigatórios.");
      return;
    }

    const price = Number(formData.amount);
    if (isNaN(price) || price < 0) {
      toast.error("Valor inválido.");
      return;
    }

    setIsSaving(true);
    try {
      const res = await fetch("/api/admin/subscription-plans", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id,
          name: formData.name,
          description: formData.description,
          amount: price,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Plano atualizado com sucesso!");
        setEditingId(null);
        fetchPlans();
      } else {
        toast.error(data.message || "Erro ao atualizar plano");
      }
    } catch (error) {
      toast.error("Erro de conexão ao salvar alterações");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-12">
      <div className="space-y-2">
        <span className="glass-dark px-4 py-1.5 rounded-full text-[10px] font-black text-white uppercase tracking-[0.3em]">
          Configurações do Sistema
        </span>
        <h2 className="text-2xl sm:text-4xl font-black text-brand-black tracking-tighter uppercase mt-4">
          Assinaturas <span className="text-brand-orange">& Planos</span>
        </h2>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-24 grayscale opacity-30">
          <Loader2 className="animate-spin text-brand-black w-12 h-12" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {plans.map((plan) => {
            const isEditing = editingId === plan.id;
            const isUserPlan = plan.id === "USER";

            return (
              <div
                key={plan.id}
                className={`relative group bg-white rounded-[2.5rem] p-8 sm:p-10 shadow-sm border transition-all ${
                  isEditing 
                    ? "border-brand-orange ring-1 ring-brand-orange/20" 
                    : "border-brand-green/5 hover:shadow-md hover:border-brand-green/10"
                }`}
              >
                {/* Visual Accent bar */}
                <div
                  className={`absolute top-0 left-0 w-full h-2 bg-gradient-to-r ${
                    isUserPlan 
                      ? "from-brand-red via-brand-orange to-brand-orange/70" 
                      : "from-brand-green via-brand-black to-brand-black/80"
                  } rounded-t-[2.5rem]`}
                />

                <div className="flex justify-between items-start mb-6">
                  <div className="space-y-1">
                    <span
                      className={`text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${
                        isUserPlan 
                          ? "bg-brand-red/10 text-brand-red" 
                          : "bg-brand-green/15 text-brand-green"
                      }`}
                    >
                      {plan.id === "USER" ? "Individual" : "Business"}
                    </span>
                    <h3 className="text-xl font-black text-brand-black uppercase tracking-tight mt-2">
                      {plan.name}
                    </h3>
                  </div>

                  {!isEditing && (
                    <Button
                      onClick={() => handleEditClick(plan)}
                      variant="outline"
                      className="h-10 w-10 p-0 rounded-xl border-brand-black/5 bg-brand-black/[0.02] hover:bg-brand-black hover:text-white transition-all shrink-0"
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>

                {isEditing ? (
                  <div className="space-y-5">
                    <div className="space-y-2">
                      <Label htmlFor={`name-${plan.id}`} className="text-[10px] font-black uppercase tracking-widest text-brand-black/40">
                        Nome do Plano
                      </Label>
                      <Input
                        id={`name-${plan.id}`}
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="h-12 rounded-xl border-brand-black/5 bg-brand-black/[0.03] px-4 font-bold focus:bg-white"
                        placeholder="Nome do Plano"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`amount-${plan.id}`} className="text-[10px] font-black uppercase tracking-widest text-brand-black/40">
                        Valor Mensal (R$)
                      </Label>
                      <Input
                        id={`amount-${plan.id}`}
                        type="number"
                        step="0.01"
                        value={formData.amount}
                        onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                        className="h-12 rounded-xl border-brand-black/5 bg-brand-black/[0.03] px-4 font-bold focus:bg-white"
                        placeholder="0.00"
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <Label htmlFor={`desc-${plan.id}`} className="text-[10px] font-black uppercase tracking-widest text-brand-black/40">
                          Vantagens do Plano (Separadas por ;)
                        </Label>
                        <span className="text-[9px] text-gray-400 font-bold uppercase">Use ";" para criar novas linhas</span>
                      </div>
                      <Textarea
                        id={`desc-${plan.id}`}
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        className="min-h-[120px] rounded-xl border-brand-black/5 bg-brand-black/[0.03] p-4 font-semibold focus:bg-white text-xs leading-relaxed"
                        placeholder="Vantagem 1; Vantagem 2; Vantagem 3..."
                      />
                    </div>

                    <div className="flex gap-3 pt-4 border-t border-brand-green/5">
                      <Button
                        onClick={() => handleSave(plan.id)}
                        disabled={isSaving}
                        className="flex-1 h-12 bg-brand-black hover:bg-brand-black/80 text-white font-black uppercase tracking-widest text-[10px] rounded-xl flex items-center justify-center gap-2"
                      >
                        {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        Salvar
                      </Button>
                      <Button
                        onClick={handleCancelEdit}
                        variant="outline"
                        className="h-12 px-5 border-brand-black/10 rounded-xl text-brand-black/60 font-black uppercase tracking-widest text-[10px] hover:bg-brand-red hover:text-white hover:border-brand-red transition-all"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="min-h-[120px] space-y-2">
                      <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider block">
                        Vantagens Exibidas:
                      </span>
                      <div className="space-y-2 max-h-[180px] overflow-y-auto pr-2">
                        {(plan.description || "").split(";").map((feat: string, index: number) => {
                          const trimmed = feat.trim();
                          if (!trimmed) return null;
                          return (
                            <div key={index} className="flex items-start gap-2.5 text-xs font-semibold text-gray-600">
                              <span className="w-1.5 h-1.5 rounded-full bg-brand-green mt-1.5 shrink-0" />
                              <span className="leading-tight uppercase text-[10px] tracking-tight">{trimmed}</span>
                            </div>
                          );
                        })}
                        {!(plan.description || "").trim() && (
                          <p className="text-xs text-gray-400 italic">Nenhuma vantagem cadastrada.</p>
                        )}
                      </div>
                    </div>

                    <div className="pt-6 border-t border-brand-green/5 flex items-baseline justify-between">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                        Preço Cadastrado
                      </span>
                      <div className="text-right">
                        <span className="text-3xl font-black text-brand-black tracking-tighter">
                          R$ {Number(plan.amount).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                        </span>
                        <span className="text-xs text-gray-400 font-bold uppercase ml-1">/mês</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
