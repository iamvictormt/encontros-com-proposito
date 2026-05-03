"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface AdminPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalItems?: number;
  itemsPerPage?: number;
  itemName?: string;
}

export function AdminPagination({
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
  itemsPerPage,
  itemName = "itens",
}: AdminPaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex flex-col sm:flex-row justify-center items-center gap-6 py-12 border-t border-brand-green/5 mt-8">
      <div className="flex items-center gap-6">
        <Button 
          variant="outline" 
          className="h-12 w-12 rounded-2xl border-brand-green/10 bg-white text-brand-black hover:bg-brand-green hover:text-white transition-all shadow-sm disabled:opacity-20"
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
        
        <div className="flex items-center gap-2 font-black text-xs uppercase tracking-widest text-brand-green/60">
          <span className="text-brand-black text-base">{currentPage}</span>
          <span className="h-px w-8 bg-brand-green/20" />
          <span>{totalPages}</span>
        </div>

        <Button 
          variant="outline" 
          className="h-12 w-12 rounded-2xl border-brand-green/10 bg-white text-brand-black hover:bg-brand-green hover:text-white transition-all shadow-sm disabled:opacity-20"
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
        >
          <ChevronRight className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}

