import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Image from "next/image";

import { formatDateHour } from "@/lib/utils/format";

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
    <div className="space-y-6">
      {/* View de Cards para Mobile */}
      <div className="grid grid-cols-1 gap-6 lg:hidden">
        {team?.map((member, i) => (
          <div
            key={i}
            className="bg-white/40 backdrop-blur-sm rounded-[2rem] border border-brand-green/5 p-6 space-y-6 premium-card"
          >
            <div className="flex items-center gap-4">
              <div className="relative w-14 h-14 min-w-[56px] overflow-hidden rounded-full border-2 border-brand-green/10">
                <Image
                  src={member.avatar || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=800&auto=format&fit=crop&q=60"}
                  alt={member.full_name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="min-w-0">
                <p className="text-lg font-black text-brand-black uppercase tracking-tight truncate">{member.full_name}</p>
                <span className="text-[10px] font-black text-brand-green uppercase tracking-widest px-3 py-1 rounded-full glass inline-block mt-1">{member.role}</span>
              </div>
            </div>

            <div className="flex justify-between items-center py-4 border-t border-b border-brand-green/5">
              <span className="text-[10px] font-black text-brand-black/30 uppercase tracking-widest">Atualização:</span>
              <span className="text-[10px] font-black text-brand-black/60 uppercase tracking-widest">{formatDateHour(member.updated_at)}</span>
            </div>

            <div className="flex gap-3">
              <Button 
                onClick={() => onEdit?.(member)}
                className="bg-brand-black hover:bg-brand-black/80 text-white font-black uppercase tracking-widest text-[10px] h-12 rounded-xl flex-1 shadow-lg shadow-brand-black/20"
              >
                Editar
              </Button>
              <Button
                variant="outline"
                onClick={() => onDelete?.(member.id)}
                className="border-brand-red/20 text-brand-red hover:bg-brand-red hover:text-white font-black uppercase tracking-widest text-[10px] h-12 rounded-xl flex-1"
              >
                Remover
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* View de Tabela para Desktop */}
      <div className="hidden lg:block bg-white/40 backdrop-blur-md rounded-[2.5rem] border border-brand-green/5 overflow-hidden shadow-xl">
        <Table>
          <TableHeader className="bg-brand-green/5">
            <TableRow className="hover:bg-transparent border-brand-green/5">
              <TableHead className="text-[10px] font-black text-brand-black/40 uppercase tracking-[0.2em] h-16 px-8">Usuário</TableHead>
              <TableHead className="text-[10px] font-black text-brand-black/40 uppercase tracking-[0.2em] h-16">Cargo</TableHead>
              <TableHead className="text-[10px] font-black text-brand-black/40 uppercase tracking-[0.2em] h-16">Atualização</TableHead>
              <TableHead className="text-[10px] font-black text-brand-black/40 uppercase tracking-[0.2em] h-16 text-center">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {team?.map((member, i) => (
              <TableRow key={i} className="hover:bg-brand-green/5 border-brand-green/5 transition-colors group">
                <TableCell className="px-8 py-6">
                  <div className="flex flex-row items-center gap-4">
                    <div className="relative w-10 h-10 min-w-[40px] overflow-hidden rounded-full border border-brand-green/5">
                      <Image
                        src={member.avatar || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=800&auto=format&fit=crop&q=60"}
                        alt={member.full_name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    </div>
                    <span className="text-sm font-black text-brand-black uppercase tracking-tight">
                      {member.full_name}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="text-[10px] font-black text-brand-green uppercase tracking-widest px-4 py-2 rounded-xl glass">
                    {member.role}
                  </span>
                </TableCell>
                <TableCell>
                  <span className="text-[10px] font-black text-brand-black/60 uppercase tracking-widest">
                    {formatDateHour(member.updated_at)}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex justify-center gap-3">
                    <Button 
                      onClick={() => onEdit?.(member)}
                      className="bg-brand-black hover:bg-brand-black/80 text-white font-black uppercase tracking-widest text-[10px] h-10 px-6 rounded-xl shadow-lg shadow-brand-black/20"
                    >
                      Editar
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => onDelete?.(member.id)}
                      className="border-brand-red/20 text-brand-red hover:bg-brand-red hover:text-white font-black uppercase tracking-widest text-[10px] h-10 px-6 rounded-xl"
                    >
                      Remover Cargo
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
