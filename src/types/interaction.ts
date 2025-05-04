
export interface Interaction {
  id: string;
  contactId: string;
  type: "email" | "call" | "meeting" | "whatsapp" | "visit" | "other";
  date: string;
  notes: string;
  createdBy: string;
  followUpNeeded: boolean;
  followUpDate?: string;
}

export interface WhatsAppMessage {
  id: string;
  leadId: string;
  text: string;
  sender: "agent" | "client";
  timestamp: Date;
  read: boolean;
  archived?: boolean;
}
