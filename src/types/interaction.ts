
export interface WhatsAppMessage {
  id: string;
  leadId: string;
  text: string;
  sender: "agent" | "client";
  timestamp: Date;
  read: boolean;
  archived?: boolean;
}

