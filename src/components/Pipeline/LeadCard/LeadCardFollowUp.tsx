
import { Calendar } from "lucide-react";

interface LeadCardFollowUpProps {
  date?: string;
  nextFollowUp?: string;
}

export function LeadCardFollowUp({ date, nextFollowUp }: LeadCardFollowUpProps) {
  // Use date parameter first, fallback to nextFollowUp
  const followUpDate = date || nextFollowUp;
  
  if (!followUpDate) {
    return null;
  }

  return (
    <div className="mb-2 text-xs flex items-center gap-1 text-gray-500">
      <Calendar className="h-3 w-3" /> 
      Follow-up: {new Date(followUpDate).toLocaleDateString('pt-BR')}
    </div>
  );
}
