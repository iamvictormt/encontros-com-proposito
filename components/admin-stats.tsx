import { Card, CardContent } from '@/components/ui/card';

interface StatCardProps {
  label: string;
  value: string | number;
  isValue?: boolean;
}

export function StatCard({ label, value, isValue }: StatCardProps) {
  return (
    <Card className="flex-1 bg-white border-none shadow-sm">
      <CardContent className="p-6">
        <p className="text-sm text-muted-foreground mb-1">{label}</p>
        <p className="text-5xl font-bold text-secondary">
          {isValue && <span className="text-sm font-bold text-muted-foreground">R$ </span>}
          {value}
        </p>
      </CardContent>
    </Card>
  );
}

export function AdminStats() {
  const stats = [
    { label: 'Total Eventos Ativos', value: '12' },
    { label: 'Empresas Pendentes', value: '5' },
    { label: 'Produtos na Loja', value: '37' },
    { label: 'Vendas no Mês', value: '14.250', isValue: true },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, i) => (
        <StatCard key={i} {...stat} />
      ))}
    </div>
  );
}
