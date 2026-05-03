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
        return "bg-primary hover:bg-primary/90 text-white";
      case "secondary":
        return "bg-secondary hover:bg-secondary/90 text-white";
      default:
        return "bg-accent hover:bg-accent/90 text-white";
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="bg-white rounded-[2.5rem] border-none shadow-2xl p-8 sm:p-12 max-w-md">
        <AlertDialogHeader className="space-y-3 mb-8">
          <AlertDialogTitle className="text-3xl font-black uppercase tracking-tighter text-brand-black leading-tight">
            {title}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-gray-500 font-medium text-sm">
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="gap-3">
          <AlertDialogCancel onClick={onClose} className="h-14 rounded-2xl font-black uppercase tracking-widest text-[10px] text-gray-400 hover:text-brand-black border-none bg-transparent">
            {cancelText}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className={cn(
              "h-14 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl flex-1 px-8",
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
