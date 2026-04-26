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
    <div className="space-y-4">
      {/* View de Cards para Mobile */}
      <div className="grid grid-cols-1 gap-4 lg:hidden">
        {team?.map((member, i) => (
          <div
            key={i}
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 space-y-4"
          >
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10 min-w-[40px]">
                <Image
                  src={member.avatar || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=800&auto=format&fit=crop&q=60"}
                  alt={member.full_name}
                  fill
                  className="object-cover rounded-full"
                />
              </div>
              <div className="min-w-0">
                <p className="font-bold text-black truncate">{member.full_name}</p>
                <p className="text-sm font-bold text-secondary">{member.role}</p>
              </div>
            </div>

            <div className="flex justify-between items-center py-2 border-t border-b border-gray-50">
              <span className="text-xs text-muted-foreground">Última atualização:</span>
              <span className="text-xs text-black font-medium">{formatDateHour(member.updated_at)}</span>
            </div>

            <div className="flex gap-2">
              <Button 
                size="sm" 
                onClick={() => onEdit?.(member)}
                className="bg-accent hover:bg-accent/90 text-white flex-1 font-bold"
              >
                Editar
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={() => onDelete?.(member.id)}
                className="bg-[#8a0204] hover:bg-[#7a0204] text-white flex-1 font-bold"
              >
                Remover
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* View de Tabela para Desktop */}
      <div className="hidden lg:block bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <Table>
          <TableHeader className="bg-gray-50/50">
            <TableRow>
              <TableHead className="text-muted-foreground whitespace-nowrap">Usuário</TableHead>
              <TableHead className="text-muted-foreground whitespace-nowrap">Cargo</TableHead>
              <TableHead className="text-muted-foreground whitespace-nowrap">Atualização</TableHead>
              <TableHead className="text-center text-muted-foreground whitespace-nowrap">
                Ações
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {team?.map((member, i) => (
              <TableRow key={i}>
                <TableCell>
                  <div className="flex flex-row items-center gap-3">
                    <div className="relative w-8 h-8 min-w-[32px]">
                      <Image
                        src={member.avatar || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=800&auto=format&fit=crop&q=60"}
                        alt={member.full_name}
                        fill
                        className="object-cover rounded-full"
                      />
                    </div>
                    <span className="text-black whitespace-nowrap font-medium">
                      {member.full_name}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="text-sm font-bold text-secondary">{member.role}</TableCell>
                <TableCell className="text-sm text-black">{formatDateHour(member.updated_at)}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-center gap-2">
                    <Button 
                      size="sm" 
                      onClick={() => onEdit?.(member)}
                      className="bg-accent hover:bg-accent/90 text-white"
                    >
                      Editar
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => onDelete?.(member.id)}
                      className="bg-[#8a0204] hover:bg-[#7a0204] text-white"
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
