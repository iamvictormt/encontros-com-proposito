'use client';

import { useEffect, useState } from 'react';
import { Facebook, Instagram } from 'lucide-react';

export function SiteFooter() {
  const [year, setYear] = useState('');

  useEffect(() => {
    const currentYear = new Date().getFullYear().toString();
    setYear(currentYear);
  }, []);

  return (
    <footer className="border-t border-border bg-secondary px-4 py-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        <p className="text-sm text-secondary-foreground">
          <span className="text-accent">CheckLove</span> | Copyright © {year}
        </p>
        <div className="flex gap-4">
          <a href="#" className="text-secondary-foreground hover:text-accent">
            <Facebook className="h-5 w-5" />
          </a>
          <a href="#" className="text-secondary-foreground hover:text-accent">
            <Instagram className="h-5 w-5" />
          </a>
        </div>
      </div>
    </footer>
  );
}
