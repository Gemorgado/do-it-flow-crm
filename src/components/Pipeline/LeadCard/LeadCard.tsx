
import { useState } from "react";
import { Lead } from "@/types";
import { LeadCardBadge } from "./LeadCardBadge";
import { LeadCardAlert } from "./LeadCardAlert";
import { LeadCardFollowUp } from "./LeadCardFollowUp";
import { LeadCardActions } from "./LeadCardActions";
import { LeadConversionModal } from "@/components/CRM/LeadConversionModal";
import { useLeadModal } from "@/components/CRM/hooks/useModalContext";
import { ArrowRight, Calendar, Phone } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { getLeadAlertMessage } from "@/utils/pipelineAutomation";

interface LeadCardProps {
  lead: Lead;
  onDragStart: (e: React.DragEvent, lead: Lead) => void;
  onStageUpdate?: (leadId: string, newStageId: string) => void;
}

export function LeadCard({ lead, onDragStart, onStageUpdate }: LeadCardProps) {
  const [showActions, setShowActions] = useState(false);
  const [showConversionModal, setShowConversionModal] = useState(false);
  const leadModal = useLeadModal();
  
  // Generate alert message for leads that need attention
  const alertMessage = getLeadAlertMessage(lead);
  
  // Format the time since last update
  const timeSinceUpdate = formatDistanceToNow(new Date(lead.updatedAt), { 
    addSuffix: true,
    locale: ptBR
  });
  
  const handleEdit = () => {
    leadModal.open({ leadToEdit: lead });
  };

  return (
    <>
      <div 
        className="bg-white p-3 rounded-md border shadow-sm cursor-grab hover:shadow-md transition-all"
        draggable
        onDragStart={(e) => onDragStart(e, lead)}
        onMouseEnter={() => setShowActions(true)}
        onMouseLeave={() => setShowActions(false)}
      >
        <div className="flex justify-between items-start">
          <h4 className="font-medium text-sm">{lead.name}</h4>
          {showActions && (
            <LeadCardActions 
              lead={lead}
              onConvert={() => setShowConversionModal(true)}
              onEdit={handleEdit}
            />
          )}
        </div>
        
        <div className="mt-1 text-xs text-gray-500 flex items-center gap-1">
          <span>{lead.company || "Sem empresa"}</span>
          {lead.value && (
            <>
              <span>•</span>
              <span className="font-medium">
                R$ {lead.value.toLocaleString('pt-BR')}
              </span>
            </>
          )}
        </div>
        
        {/* Alert for leads that need attention */}
        {alertMessage && (
          <LeadCardAlert message={alertMessage} />
        )}
        
        {/* Source and status badges */}
        <div className="mt-2 flex flex-wrap gap-1">
          <LeadCardBadge type="source">{lead.source}</LeadCardBadge>
          <LeadCardBadge type="status">{lead.status}</LeadCardBadge>
          
          {lead.meetingScheduled && (
            <LeadCardBadge type="meeting">
              <Calendar className="h-3 w-3 mr-1" />
              Agendado
            </LeadCardBadge>
          )}
        </div>
        
        {/* Follow-up info if available */}
        {lead.nextFollowUp && (
          <LeadCardFollowUp date={lead.nextFollowUp} />
        )}
        
        <div className="mt-2 pt-2 border-t border-gray-100 flex justify-between text-xs text-gray-400">
          <div className="flex items-center gap-1">
            <Phone className="h-3 w-3" />
            <span>
              {lead.lastContact ? formatDistanceToNow(new Date(lead.lastContact), { 
                addSuffix: true, 
                locale: ptBR 
              }) : "Nenhum contato"}
            </span>
          </div>
          <span>{timeSinceUpdate}</span>
        </div>
        
        {/* Possible next stage indicator */}
        {onStageUpdate && (
          <div 
            className="mt-2 pt-2 border-t border-gray-100 flex items-center justify-end text-xs text-blue-500 hover:text-blue-700 cursor-pointer transition-colors"
            onClick={() => onStageUpdate(lead.id, (parseInt(lead.stage.id) + 1).toString())}
          >
            <span>Avançar</span>
            <ArrowRight className="ml-1 h-3 w-3" />
          </div>
        )}
      </div>
      
      <LeadConversionModal 
        lead={lead}
        isOpen={showConversionModal}
        onClose={() => setShowConversionModal(false)}
      />
    </>
  );
}
