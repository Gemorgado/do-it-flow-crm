
import { Calendar } from "lucide-react";

interface LeadCardFollowUpProps {
  nextFollowUp?: string;
}

export function LeadCardFollowUp({ nextFollowUp }: LeadCardFollowUpProps) {
  if (!nextFollowUp) {
    return null;
  }

  return (
    <div className="mb-2 text-xs flex items-center gap-1 text-gray-500">
      <Calendar className="h-3 w-3" /> 
      Follow-up: {new Date(nextFollowUp).toLocaleDateString('pt-BR')}
    </div>
  );
}
