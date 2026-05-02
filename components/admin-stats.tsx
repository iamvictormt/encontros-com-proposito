import { Card, CardContent } from "@/components/ui/card";

interface StatCardProps {
  label: string;
  value: string | number;
  isValue?: boolean;
}

export function StatCard({ label, value, isValue }: StatCardProps) {
  return (
    <Card className="flex-1 bg-white border border-gray-100 rounded-[2.5rem] shadow-xl overflow-hidden transition-all hover:scale-[1.02]">
      <CardContent className="p-10">
        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-4">{label}</p>
        <p className="text-5xl font-black text-black italic tracking-tighter leading-none">
          {isValue && <span className="text-xl font-black text-primary">R$ </span>}
          {value}
        </p>
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
