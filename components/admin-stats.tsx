
interface StatCardProps {
  label: string;
  value: string | number;
  isValue?: boolean;
}

export function StatCard({ label, value, isValue }: StatCardProps) {
  return (
    <div className="flex-1 bg-white/40 backdrop-blur-sm border border-brand-green/5 p-8 rounded-[2rem] premium-card">
      <p className="text-[10px] font-black text-brand-black/40 uppercase tracking-[0.2em] mb-4">{label}</p>
      <p className="text-4xl font-black text-brand-green tracking-tighter">
        {isValue && <span className="text-lg font-black text-brand-orange">R$ </span>}
        {value}
      </p>
    </div>
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
