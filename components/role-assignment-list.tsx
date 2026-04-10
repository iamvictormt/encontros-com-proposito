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

interface RoleAssignmentProps {
  user: {
    name: string;
    avatar: string;
  };
  role: string;
  updatedAt: string;
}

export function RoleAssignmentList({ team }: { team: RoleAssignmentProps[] }) {
  return (
    <div className="space-y-4">
      {/* View de Cards para Mobile */}
      <div className="grid grid-cols-1 gap-4 lg:hidden">
        {team.map((member, i) => (
          <div
            key={i}
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 space-y-4"
          >
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10 min-w-[40px]">
                <Image
                  src={member.user.avatar}
                  alt={member.user.name}
                  fill
                  className="object-cover rounded-full"
                />
              </div>
              <div className="min-w-0">
                <p className="font-bold text-black truncate">{member.user.name}</p>
                <p className="text-sm font-bold text-secondary">{member.role}</p>
              </div>
            </div>

            <div className="flex justify-between items-center py-2 border-t border-b border-gray-50">
              <span className="text-xs text-muted-foreground">Última atualização:</span>
              <span className="text-xs text-black font-medium">{member.updatedAt}</span>
            </div>

            <div className="flex gap-2">
              <Button size="sm" className="bg-accent hover:bg-accent/90 text-white flex-1">
                Editar
              </Button>
              <Button
                size="sm"
                variant="destructive"
                className="bg-[#8a0204] hover:bg-[#7a0204] text-white flex-1"
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
            {team.map((member, i) => (
              <TableRow key={i}>
                <TableCell>
                  <div className="flex flex-row items-center gap-3">
                    <div className="relative w-8 h-8 min-w-[32px]">
                      <Image
                        src={member.user.avatar}
                        alt={member.user.name}
                        fill
                        className="object-cover rounded-full"
                      />
                    </div>
                    <span className="text-black whitespace-nowrap font-medium">
                      {member.user.name}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="text-sm font-bold text-secondary">{member.role}</TableCell>
                <TableCell className="text-sm text-black">{member.updatedAt}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-center gap-2">
                    <Button size="sm" className="bg-accent hover:bg-accent/90 text-white">
                      Editar
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
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
