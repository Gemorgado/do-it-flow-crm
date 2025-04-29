
import { Button } from "@/components/ui/button";
import { MessageSquare, UserPlus, Calendar, FileText, MessageCircle } from "lucide-react";
import { useState } from "react";
import { Lead } from "@/types";
import { WhatsAppDialog } from "../WhatsAppDialog";

interface LeadCardActionsProps {
  lead: Lead;
  onMessageSent?: (message: string) => void;
}

export function LeadCardActions({ lead, onMessageSent }: LeadCardActionsProps) {
  const [openWhatsApp, setOpenWhatsApp] = useState(false);

  return (
    <>
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
          <MessageCircle className="h-4 w-4" />
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
        onMessageSent={onMessageSent}
      />
    </>
  );
}
