
import { Lead } from "@/types";
import { isLeadStale, needsFollowUp, getLeadAlertMessage } from "@/utils/pipelineAutomation";
import { AlertTriangle } from "lucide-react";

interface LeadCardAlertProps {
  lead: Lead;
}

export function LeadCardAlert({ lead }: LeadCardAlertProps) {
  const alertMessage = getLeadAlertMessage(lead);
  const needsAttention = isLeadStale(lead) || needsFollowUp(lead);

  if (!needsAttention) {
    return null;
  }

  return (
    <span className="text-amber-500 tooltip-trigger">
      <AlertTriangle className="h-4 w-4" />
      <span className="tooltip-text bg-amber-100 text-amber-800 text-xs p-1 rounded absolute mt-8 z-10">
        {alertMessage}
      </span>
    </span>
  );
}
