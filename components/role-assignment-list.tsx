import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

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
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <Table>
        <TableHeader className="bg-gray-50/50">
          <TableRow>
            <TableHead className="font-bold">Usuário</TableHead>
            <TableHead className="font-bold">Cargo</TableHead>
            <TableHead className="font-bold">Atualização</TableHead>
            <TableHead className="text-right font-bold">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {team.map((member, i) => (
            <TableRow key={i}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={member.user.avatar} />
                    <AvatarFallback>{member.user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <span className="text-sm text-muted-foreground">{member.user.name}</span>
                </div>
              </TableCell>
              <TableCell className="text-sm font-bold text-secondary">{member.role}</TableCell>
              <TableCell className="text-sm text-muted-foreground">{member.updatedAt}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button size="sm" className="bg-accent hover:bg-accent/90 text-white">Editar</Button>
                  <Button size="sm" variant="destructive" className="bg-[#8a0204] hover:bg-[#7a0204] text-white">Remover Cargo</Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
