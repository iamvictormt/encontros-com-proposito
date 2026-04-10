"use client";

import { useEffect, useState } from "react";
import { Facebook, Instagram } from "lucide-react";

export function SiteFooter() {
  const [year, setYear] = useState("");

  useEffect(() => {
    const currentYear = new Date().getFullYear().toString();
    setYear(currentYear);
  }, []);

  return (
    <footer className="bg-[#2B4B42] px-4 py-8 lg:px-8 mt-12">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        <p className="text-sm text-gray-200">
          <span className="text-[#F28D35] font-medium">CheckLove</span> | Copyright © {year}
        </p>
        <div className="flex gap-4">
          <a href="#" className="text-gray-200 hover:text-white transition-colors">
            <Facebook className="h-5 w-5" />
          </a>
          <a href="#" className="text-gray-200 hover:text-white transition-colors">
            <Instagram className="h-5 w-5" />
          </a>
        </div>
      </div>
    </footer>
  );
}
