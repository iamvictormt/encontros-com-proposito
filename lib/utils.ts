import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export function formatName(name: string | null | undefined) {
  if (!name) return "";
  const parts = name.trim().split(/\s+/);
  if (parts.length <= 1) return name;
  
  const firstName = parts[0];
  // Pega no máximo os próximos 2 nomes para abreviar
  const surnames = parts.slice(1, 3).map(part => {
    // Se já for uma abreviação como "M.", retorna como está
    if (part.length <= 2 && part.endsWith('.')) return part;
    // Caso contrário, pega a primeira letra e adiciona um ponto
    return `${part.charAt(0).toUpperCase()}.`;
  });
  
  return `${firstName} ${surnames.join(' ')}`;
}
