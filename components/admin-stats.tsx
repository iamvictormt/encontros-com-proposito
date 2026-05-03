import { Card, CardContent } from "@/components/ui/card";

interface StatCardProps {
  label: string;
  value: string | number;
  isValue?: boolean;
}

export function StatCard({ label, value, isValue }: StatCardProps) {
  return (
    <Card className="flex-1 premium-card bg-white rounded-[2rem] border-none">
      <CardContent className="p-8">
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-black/40 mb-3">{label}</p>
        <div className="flex items-baseline gap-1">
          {isValue && <span className="text-lg font-black text-brand-orange">R$</span>}
          <p className="text-5xl font-black text-brand-black tracking-tighter">
            {value}
          </p>
        </div>
        <div className="h-1 w-12 bg-brand-orange rounded-full mt-6 shadow-[0_0_8px_#FF1D55]" />
      </CardContent>
    </Card>
  );
}

export function AdminStats({ stats }: { stats?: StatCardProps[] }) {
  const defaultStats = [
    { label: "Total Eventos Ativos", value: "12" },
    { label: "Empresas Pendentes", value: "5" },
    { label: "Produtos na Loja", value: "37" },
    { label: "Vendas no Mês", value: "14.250", isValue: true },
  ];

  const displayStats = stats || defaultStats;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
      {displayStats.map((stat, i) => (
        <StatCard key={i} {...stat} />
      ))}
    </div>
  );
}
