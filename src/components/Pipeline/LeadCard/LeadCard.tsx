
import { Lead } from "@/types";
import { LeadCardAlert } from "./LeadCardAlert";
import { LeadCardBadge } from "./LeadCardBadge";
import { LeadCardFollowUp } from "./LeadCardFollowUp";
import { LeadCardActions } from "./LeadCardActions";

interface LeadCardProps {
  lead: Lead;
  onDragStart: (e: React.DragEvent, lead: Lead) => void;
  onStageUpdate?: (leadId: string, newStageId: string) => void;
}

export function LeadCard({ lead, onDragStart, onStageUpdate }: LeadCardProps) {
  function formatValue(value?: number): string {
    if (!value) return "Não informado";
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }

  // Function to handle auto-stage progression based on message keywords
  const handleMessageSent = (message: string) => {
    const progressionKeywords = {
      "proposta": "3", // Move to proposal stage
      "contrato": "4", // Move to negotiation stage
      "pagamento": "5", // Move to closed stage
      "orçamento": "2", // Move to qualified stage
    };
    
    // Check if message contains any keywords that should trigger stage progression
    for (const [keyword, stageId] of Object.entries(progressionKeywords)) {
      if (message.toLowerCase().includes(keyword.toLowerCase()) && lead.stage.id !== stageId) {
        if (onStageUpdate) {
          onStageUpdate(lead.id, stageId);
          break;
        }
      }
    }
  };

  // Get source display name
  const getCampaignSource = () => {
    // This would come from actual lead data in a real app
    // For demo, we'll randomly assign sources
    const sources = ['Google Ads', 'Facebook Ads', 'Instagram', 'Direto', 'Email'];
    const sourceIndex = parseInt(lead.id) % sources.length;
    return sources[sourceIndex];
  };

  return (
    <div 
      className="bg-white border rounded-md shadow-sm p-3 cursor-move hover:shadow-md transition-shadow"
      draggable
      onDragStart={(e) => onDragStart(e, lead)}
    >
      <div className="flex justify-between items-start mb-1">
        <h4 className="font-medium flex items-center gap-1">
          {lead.name}
          <LeadCardAlert lead={lead} />
        </h4>
        {lead.value && (
          <span className="text-sm text-doIt-primary font-medium">
            {formatValue(lead.value)}
          </span>
        )}
      </div>
      
      {lead.company && (
        <p className="text-sm text-gray-600 mb-2">{lead.company}</p>
      )}
      
      {/* Campaign source badge */}
      <div className="mb-2">
        <LeadCardBadge campaignSource={getCampaignSource()} />
      </div>
      
      {/* Show next follow up date if it exists */}
      <LeadCardFollowUp nextFollowUp={lead.nextFollowUp} />
      
      {/* Actions */}
      <LeadCardActions 
        lead={lead} 
        onMessageSent={handleMessageSent} 
      />
    </div>
  );
}
