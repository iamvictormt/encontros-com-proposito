import { Button } from "@/components/ui/button";
import Image from "next/image";
import { formatDateHour } from "@/lib/utils/format";
import { Edit3, Trash2, ShieldCheck, User as UserIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface RoleAssignmentProps {
  id: string;
  full_name: string;
  avatar: string;
  role: string;
  updated_at: string;
  is_admin?: boolean;
}

interface RoleAssignmentListProps {
  team: RoleAssignmentProps[];
  onEdit?: (member: RoleAssignmentProps) => void;
  onDelete?: (id: string) => void;
}

export function RoleAssignmentList({ team, onEdit, onDelete }: RoleAssignmentListProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {team?.map((member, i) => (
        <div
          key={i}
          className="group premium-card bg-white rounded-3xl border border-brand-black/5 p-6 flex flex-col"
        >
          <div className="flex items-center gap-4 mb-6">
            <div className="relative w-14 h-14 shrink-0">
              <Image
                src={member.avatar || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=800&auto=format&fit=crop&q=60"}
                alt={member.full_name}
                fill
                className="object-cover rounded-2xl shadow-sm"
              />
              {member.is_admin && (
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-brand-green rounded-full flex items-center justify-center text-white border-2 border-white shadow-sm">
                  <ShieldCheck size={10} />
                </div>
              )}
            </div>
            <div className="min-w-0">
              <h4 className="font-black text-brand-black text-base uppercase tracking-tighter truncate group-hover:text-brand-orange transition-colors">
                {member.full_name}
              </h4>
              <p className="text-[10px] font-black uppercase tracking-widest text-brand-black/40">
                {member.role || "Sem cargo"}
              </p>
            </div>
          </div>

          <div className="space-y-4 mb-6 flex-1">
            <div className="flex items-center justify-between py-2 border-b border-brand-black/5">
              <span className="text-[9px] font-black uppercase tracking-widest text-gray-400">Permissão</span>
              <span className={cn(
                "text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-lg",
                member.is_admin ? "bg-brand-green/10 text-brand-green" : "bg-brand-black/5 text-brand-black/40"
              )}>
                {member.is_admin ? "Admin" : "Usuário"}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[9px] font-black uppercase tracking-widest text-gray-400">Último Acesso</span>
              <span className="text-[9px] font-black text-brand-black/60">{formatDateHour(member.updated_at)}</span>
            </div>
          </div>

          <div className="flex gap-2">
            <Button 
              onClick={() => onEdit?.(member)}
              className="flex-1 h-12 bg-brand-black hover:bg-brand-black/80 text-white font-black uppercase tracking-widest text-[9px] rounded-xl transition-all"
            >
              <Edit3 size={12} className="mr-2" />
              Editar Cargo
            </Button>
            <Button
              variant="outline"
              onClick={() => onDelete?.(member.id)}
              className="w-12 h-12 border-brand-red/10 text-brand-red hover:bg-brand-red hover:text-white rounded-xl transition-all flex items-center justify-center p-0"
            >
              <Trash2 size={14} />
            </Button>
          </div>
        </div>
      ))}

      {(!team || team.length === 0) && (
        <div className="col-span-full py-20 text-center glass rounded-[2rem] border-dashed border-brand-green/20">
          <UserIcon className="w-12 h-12 text-brand-black/10 mx-auto mb-4" />
          <p className="text-[10px] font-black uppercase tracking-widest text-brand-black/40">Nenhum membro da equipe encontrado.</p>
        </div>
      )}
    </div>
  );
}
