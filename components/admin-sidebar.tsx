'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Calendar,
  MapPin,
  Tag,
  ShoppingBag,
  BarChart2,
  Users,
  Settings
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Logo } from '@/components/logo';

const menuItems = [
  { icon: LayoutDashboard, label: 'Visão Geral', href: '/admin' },
  { icon: Calendar, label: 'Eventos', href: '/admin/events' },
  { icon: MapPin, label: 'Locais & Empresas', href: '/admin/venues' },
  { icon: Tag, label: 'Conteúdo das Marcas', href: '/admin/brands' },
  { icon: ShoppingBag, label: 'Loja & Produtos', href: '/admin/products' },
  { icon: BarChart2, label: 'Relatórios', href: '/admin/reports' },
  { icon: Users, label: 'Equipe & Cargos', href: '/admin/team' },
  { icon: Settings, label: 'Configurações', href: '/admin/settings' },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 border-r bg-white flex flex-col h-screen sticky top-0">
      <div className="p-6 border-b">
        <Logo href="/admin" />
      </div>

      <nav className="flex-1 overflow-y-auto p-4 space-y-2">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-colors",
                isActive
                  ? "bg-secondary/10 text-secondary"
                  : "text-muted-foreground hover:bg-gray-100 hover:text-foreground"
              )}
            >
              <item.icon className={cn("w-5 h-5", isActive ? "text-secondary" : "text-muted-foreground")} />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
