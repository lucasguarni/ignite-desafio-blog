import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export function formatDate(dateString: string): string {
  const date = format(new Date(dateString), 'dd MMM yyyy' ,{ locale: ptBR });

  return date;
}