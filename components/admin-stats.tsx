import { Card, CardContent } from "@/components/ui/card";

interface StatCardProps {
  label: string;
  value: string | number;
  isValue?: boolean;
}

export function StatCard({ label, value, isValue }: StatCardProps) {
  return (
    <Card className="flex-1 bg-white border-none shadow-xl rounded-[2rem] overflow-hidden relative group transition-all hover:scale-[1.02]">
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 transition-all group-hover:scale-150" />
      <CardContent className="p-8 relative z-10">
        <p className="text-[10px] font-black uppercase italic tracking-widest text-muted-foreground mb-2">
          {label}
        </p>
        <p className="text-5xl font-black uppercase italic text-primary leading-none">
          {isValue && <span className="text-xl align-top mr-1">R$</span>}
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
