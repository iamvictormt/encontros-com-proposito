import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Image from "next/image"

interface BrandContentProps {
  logo: string;
  brand: string;
  page: string;
  updatedAt: string;
  status: string;
}

export function BrandContentTable({ brands }: { brands: BrandContentProps[] }) {
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <Table>
        <TableHeader className="bg-gray-50/50">
          <TableRow>
            <TableHead className="font-bold">Marca</TableHead>
            <TableHead className="font-bold">Página/Seção</TableHead>
            <TableHead className="font-bold">Atualização</TableHead>
            <TableHead className="font-bold">Status</TableHead>
            <TableHead className="text-right font-bold">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {brands.map((brand, i) => (
            <TableRow key={i}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <Image src={brand.logo} alt={brand.brand} width={40} height={40} className="rounded" />
                  <span className="font-bold hidden lg:inline">{brand.brand}</span>
                </div>
              </TableCell>
              <TableCell>
                <Select defaultValue={brand.page}>
                  <SelectTrigger className="w-40 bg-transparent">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Home">Home</SelectItem>
                    <SelectItem value="Eventos">Eventos</SelectItem>
                  </SelectContent>
                </Select>
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">{brand.updatedAt}</TableCell>
              <TableCell className="text-sm text-secondary font-medium">{brand.status}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button size="sm" className="bg-accent hover:bg-accent/90 text-white">Editar</Button>
                  <Button size="sm" variant="destructive" className="bg-[#8a0204] hover:bg-[#7a0204] text-white">Deletar</Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
