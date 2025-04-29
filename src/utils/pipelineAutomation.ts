
import { Lead } from "@/types";
import { toast } from "@/hooks/use-toast";

// Time thresholds for triggering alerts (in milliseconds)
export const STALE_LEAD_THRESHOLD = 7 * 24 * 60 * 60 * 1000; // 7 days
export const FOLLOW_UP_REMINDER = 3 * 24 * 60 * 60 * 1000; // 3 days

// Automation triggers based on pipeline stage
export const automationTriggers = {
  "1": { // New leads
    action: "followUpReminder",
    days: 1,
    message: "Lembrete: Entre em contato com o novo lead"
  },
  "2": { // Qualified
    action: "sendProposal",
    days: 2,
    message: "Envie uma proposta para o lead qualificado"
  },
  "3": { // Proposal
    action: "followUpProposal",
    days: 3,
    message: "Lembrete: Faça follow-up da proposta enviada"
  },
  "4": { // Negotiation
    action: "scheduleCall",
    days: 2,
    message: "Agende uma reunião para negociação final"
  },
  "5": { // Closed
    action: "sendSatisfactionSurvey",
    days: 7,
    message: "Envie pesquisa de satisfação para o novo cliente"
  }
};

// Calculate time in stage for a lead
export function getTimeInCurrentStage(lead: Lead): number {
  const lastUpdate = new Date(lead.updatedAt).getTime();
  const now = new Date().getTime();
  return now - lastUpdate;
}

// Check if lead is stale based on configuration
export function isLeadStale(lead: Lead): boolean {
  return getTimeInCurrentStage(lead) > STALE_LEAD_THRESHOLD;
}

// Check if lead needs a follow-up based on next follow up date
export function needsFollowUp(lead: Lead): boolean {
  if (!lead.nextFollowUp) return false;
  
  const followUpDate = new Date(lead.nextFollowUp).getTime();
  const now = new Date().getTime();
  return followUpDate <= now;
}

// Trigger automation based on lead stage
export function triggerAutomation(lead: Lead): void {
  const stageConfig = automationTriggers[lead.stage.id as keyof typeof automationTriggers];
  
  if (!stageConfig) return;
  
  const timeInStage = getTimeInCurrentStage(lead);
  const triggerThreshold = stageConfig.days * 24 * 60 * 60 * 1000;
  
  if (timeInStage >= triggerThreshold) {
    // In a production app, this would call an API or trigger a workflow
    console.log(`Triggering automation: ${stageConfig.action} for lead ${lead.id}`);
    
    toast({
      title: "Automação ativada",
      description: stageConfig.message,
      duration: 5000,
    });
    
    // Reset the trigger by updating the lead's updatedAt (mock)
    // In a real app, we'd call an API to update the lead
    return;
  }
}

// Get all leads that need attention (stale or need follow-up)
export function getLeadsNeedingAttention(leads: Lead[]): Lead[] {
  return leads.filter(lead => isLeadStale(lead) || needsFollowUp(lead));
}

// Get contextual alert message for a lead
export function getLeadAlertMessage(lead: Lead): string | null {
  if (isLeadStale(lead)) {
    const days = Math.floor(getTimeInCurrentStage(lead) / (24 * 60 * 60 * 1000));
    return `Lead parado há ${days} dias`;
  }
  
  if (needsFollowUp(lead)) {
    return "Follow-up pendente";
  }
  
  return null;
}
