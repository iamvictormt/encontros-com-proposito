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
    <div className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-8 py-8 border-t border-gray-100 mt-4">
      <div className="flex items-center gap-4">
        <Button 
          variant="ghost" 
          className={`h-10 w-10 p-0 disabled:opacity-30 ${
            currentPage === 1 ? "text-gray-400" : "text-primary hover:text-primary/80 hover:bg-red-50"
          }`}
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <span className="text-sm font-medium text-black">
          Página {currentPage} de {totalPages}
        </span>
        <Button 
          variant="ghost" 
          className={`h-10 w-10 p-0 disabled:opacity-30 ${
            currentPage === totalPages ? "text-gray-400" : "text-primary hover:text-primary/80 hover:bg-red-50"
          }`}
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
        >
          <ChevronRight className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}

