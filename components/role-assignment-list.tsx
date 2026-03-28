import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Image from 'next/image';

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
    <div className="bg-white rounded-xl shadow-sm overflow-hidden border-none p-2">
      <Table>
        <TableHeader className="bg-gray-50/50">
          <TableRow>
            <TableHead className="text-muted-foreground">Usuário</TableHead>
            <TableHead className="text-muted-foreground">Cargo</TableHead>
            <TableHead className="text-muted-foreground">Atualização</TableHead>
            <TableHead className="text-center text-muted-foreground">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {team.map((member, i) => (
            <TableRow key={i}>
              <TableCell>
                <div className="flex flex-row items-center gap-3">
                  <div className="relative w-8 h-8 min-w-[32px]">
                    <Image src={member.user.avatar} alt={member.user.name} fill className="object-cover rounded-full" />
                  </div>

                  <span className="text-black whitespace-nowrap">{member.user.name}</span>
                </div>
              </TableCell>
              <TableCell className="text-sm font-bold text-secondary">{member.role}</TableCell>
              <TableCell className="text-sm text-black">{member.updatedAt}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-center gap-2">
                  <Button size="sm" className="bg-accent hover:bg-accent/90 text-white">
                    Editar
                  </Button>
                  <Button size="sm" variant="destructive" className="bg-[#8a0204] hover:bg-[#7a0204] text-white">
                    Remover Cargo
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
