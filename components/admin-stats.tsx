import { Card, CardContent } from "@/components/ui/card"

interface StatCardProps {
  label: string;
  value: string | number;
}

export function StatCard({ label, value }: StatCardProps) {
  return (
    <Card className="flex-1 bg-white border-none shadow-sm">
      <CardContent className="p-6">
        <p className="text-sm font-medium text-muted-foreground mb-1">{label}</p>
        <p className="text-3xl font-bold text-secondary">{value}</p>
      </CardContent>
    </Card>
  )
}

export function AdminStats() {
  const stats = [
    { label: "Total Eventos Ativos", value: "12" },
    { label: "Empresas Pendentes", value: "5" },
    { label: "Produtos na Loja", value: "37" },
    { label: "Vendas no Mês", value: "R$ 14.250" },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, i) => (
        <StatCard key={i} {...stat} />
      ))}
    </div>
  )
}
