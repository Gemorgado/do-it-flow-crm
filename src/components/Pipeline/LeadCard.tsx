
import { Lead } from "@/types";
import { Button } from "@/components/ui/button";
import { MessageSquare, UserPlus, Calendar, FileText, WhatsApp } from "lucide-react";
import { useState } from "react";
import { WhatsAppDialog } from "./WhatsAppDialog";
import { toast } from "@/hooks/use-toast";

interface LeadCardProps {
  lead: Lead;
  onDragStart: (e: React.DragEvent, lead: Lead) => void;
  onStageUpdate?: (leadId: string, newStageId: string) => void;
}

export function LeadCard({ lead, onDragStart, onStageUpdate }: LeadCardProps) {
  const [openWhatsApp, setOpenWhatsApp] = useState(false);
  
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
          
          // Show toast notification about auto-progression
          toast({
            title: "Estágio do lead atualizado automaticamente",
            description: `O lead foi movido para um novo estágio com base na mensagem enviada.`,
            duration: 3000,
          });
          break;
        }
      }
    }
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
      
      <div className="flex flex-wrap gap-2 mt-3">
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <UserPlus className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <Calendar className="h-4 w-4" />
        </Button>
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-8 w-8 text-green-500 hover:text-green-600 hover:bg-green-50"
          onClick={() => setOpenWhatsApp(true)}
        >
          <WhatsApp className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <MessageSquare className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <FileText className="h-4 w-4" />
        </Button>
      </div>

      <WhatsAppDialog 
        open={openWhatsApp} 
        onOpenChange={setOpenWhatsApp}
        lead={lead}
        onMessageSent={handleMessageSent}
      />
    </div>
  );
}
