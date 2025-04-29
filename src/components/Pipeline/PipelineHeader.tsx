
import { Button } from "@/components/ui/button";
import { Plus, AlertTriangle } from "lucide-react";
import { Lead } from "@/types";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useState } from "react";
import { trackLeadEvent } from "@/utils/trackingUtils";
import { useLeadModal } from "@/components/CRM/hooks/useModalContext";

interface PipelineHeaderProps {
  leadsNeedingAttention: Lead[];
}

export function PipelineHeader({ leadsNeedingAttention }: PipelineHeaderProps) {
  const { open } = useLeadModal();

  const handleNewLead = () => {
    trackLeadEvent('new_lead_button_click', {});
    open();
  };

  return (
    <>
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Pipeline de Vendas</h1>
          <p className="text-gray-500">Gerencie seu funil de vendas de forma visual e eficiente</p>
        </div>
        <Button 
          className="bg-doIt-primary hover:bg-doIt-dark"
          onClick={handleNewLead}
        >
          <Plus className="mr-2 h-4 w-4" /> Novo Lead
        </Button>
      </div>

      {leadsNeedingAttention.length > 0 && (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Atenção necessária</AlertTitle>
          <AlertDescription>
            {leadsNeedingAttention.length} leads precisam da sua atenção.
            {leadsNeedingAttention.length <= 3 && (
              <ul className="mt-1 list-disc list-inside">
                {leadsNeedingAttention.slice(0, 3).map(lead => (
                  <li key={lead.id} className="text-sm">{lead.name} - {lead.company}</li>
                ))}
              </ul>
            )}
          </AlertDescription>
        </Alert>
      )}
    </>
  );
}
