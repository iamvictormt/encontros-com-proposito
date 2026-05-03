"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "default" | "destructive" | "secondary";
}

export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  variant = "default",
}: ConfirmModalProps) {
  
  const getVariantClass = () => {
    switch (variant) {
      case "destructive":
        return "bg-brand-red hover:bg-brand-red/90 text-white shadow-lg shadow-brand-red/20";
      case "secondary":
        return "bg-brand-green hover:bg-brand-green/90 text-white shadow-lg shadow-brand-green/20";
      default:
        return "bg-brand-orange hover:bg-brand-orange/90 text-white shadow-lg shadow-brand-orange/20";
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="glass border-brand-green/10 rounded-[2rem] p-6 lg:p-8 shadow-2xl">
        <AlertDialogHeader className="space-y-4">
          <div className="flex items-center gap-3 mb-2">
            <div className={cn(
              "h-1 w-6 rounded-full",
              variant === "destructive" ? "bg-brand-red" : variant === "secondary" ? "bg-brand-green" : "bg-brand-orange"
            )} />
            <span className="text-[10px] font-bold text-brand-black/40 uppercase tracking-[0.2em]">
              Confirmação
            </span>
          </div>
          <AlertDialogTitle className="text-2xl font-bold tracking-tight text-brand-black">
            {title}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-brand-black/60 font-medium text-sm leading-relaxed">
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="mt-8 flex flex-col sm:flex-row gap-3">
          <AlertDialogCancel 
            onClick={onClose}
            className="h-12 border-brand-green/10 bg-white/50 text-brand-black/60 hover:bg-brand-green/5 font-bold text-xs px-8 rounded-xl flex-1 sm:flex-none"
          >
            {cancelText}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className={cn(
              "h-12 font-bold text-xs px-10 rounded-xl transition-all active:scale-95 flex-1 sm:flex-none",
              getVariantClass()
            )}
          >
            {confirmText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
