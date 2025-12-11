'use client';

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Logo } from './logo';
import { useAuth } from '@/hooks/use-auth';

export function SiteHeader() {
  const { isLoggedIn, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <header className="bg-white px-4 py-4 lg:px-20 mb-4">
      <div className="mx-auto flex items-center justify-between">
        <Logo href="/events" />

        <nav className="hidden items-center gap-6 lg:flex">
          <Link href="/events" className="font-medium text-black hover:text-black/80">
            Home
          </Link>
          <Link href="/products" className="font-medium text-black hover:text-black/80">
            Produtos Autorais
          </Link>
          <Link href="/portfolio" className="font-medium text-black hover:text-black/80">
            Portfólio
          </Link>
          <Link href="/partners" className="font-medium text-black hover:text-black/80">
            Empresas e Parcerias
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          {isLoggedIn ? (
            <>
              <Button
                variant="ghost"
                asChild
                className="hidden sm:inline-flex bg-transparent text-black hover:bg-gray-50 hover:text-black"
              >
                <Link href="/account">Minha Conta</Link>
              </Button>
              <Button onClick={handleLogout} className="bg-secondary hover:bg-secondary/90">
                Sair
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="ghost"
                asChild
                className="hidden sm:inline-flex bg-transparent text-black hover:bg-gray-50 hover:text-black"
              >
                <Link href="/login">Entrar</Link>
              </Button>
              <Button asChild className="bg-secondary hover:bg-secondary/90">
                <Link href="/signup">Cadastrar</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
