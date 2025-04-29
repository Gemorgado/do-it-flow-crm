
import { useState, useEffect } from "react";
import { Lead, PipelineStage } from "@/types";
import { toast } from "@/hooks/use-toast";
import { 
  getLeadsNeedingAttention, 
  triggerAutomation, 
  trackStageChange 
} from "@/utils/pipelineAutomation";
import { trackLeadEvent } from "@/utils/trackingUtils";

export function usePipelineData(initialLeads: Lead[], pipelineStages: PipelineStage[]) {
  const [filteredLeads, setFilteredLeads] = useState<Lead[]>(initialLeads);
  const [draggedLead, setDraggedLead] = useState<Lead | null>(null);
  const [leadsNeedingAttention, setLeadsNeedingAttention] = useState<Lead[]>([]);
  
  // Group leads by pipeline stage
  const leadsByStage: Record<string, Lead[]> = {};
  
  pipelineStages.forEach(stage => {
    leadsByStage[stage.id] = filteredLeads.filter(
      lead => lead.stage.id === stage.id
    );
  });

  // Track page view on component mount
  useEffect(() => {
    // Track page view
    trackLeadEvent('pipeline_view', {
      leads_count: filteredLeads.length,
      page_name: 'Pipeline de Vendas'
    });
    
    // Track leads needing attention
    const needAttention = getLeadsNeedingAttention(filteredLeads);
    setLeadsNeedingAttention(needAttention);
    
    // Check automation triggers for each lead
    filteredLeads.forEach(lead => {
      triggerAutomation(lead);
    });
  }, [filteredLeads]);

  const handleDragStart = (e: React.DragEvent, lead: Lead) => {
    setDraggedLead(lead);
    e.dataTransfer.effectAllowed = "move";
    // Set a semi-transparent drag image
    const dragIcon = document.createElement('div');
    dragIcon.className = "bg-white p-3 rounded-md shadow-md opacity-80";
    dragIcon.textContent = lead.name;
    document.body.appendChild(dragIcon);
    e.dataTransfer.setDragImage(dragIcon, 20, 20);
    
    // Clean up the drag image element after it's no longer needed
    setTimeout(() => {
      document.body.removeChild(dragIcon);
    }, 0);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e: React.DragEvent, targetStageId: string) => {
    e.preventDefault();
    
    // Ensure we have a lead being dragged and it's not already in the target stage
    if (!draggedLead || draggedLead.stage.id === targetStageId) return;

    updateLeadStage(draggedLead.id, targetStageId);
  };

  const updateLeadStage = (leadId: string, targetStageId: string) => {
    // Find the lead and target stage
    const lead = filteredLeads.find(l => l.id === leadId);
    const targetStage = pipelineStages.find(stage => stage.id === targetStageId);
    
    if (!lead || !targetStage) return;

    // Track stage change for analytics
    trackStageChange(lead, targetStageId);

    // Update the lead's stage and updatedAt timestamp
    const now = new Date().toISOString();
    const updatedLeads = filteredLeads.map(l => 
      l.id === leadId 
        ? { ...l, stage: targetStage, updatedAt: now }
        : l
    );

    // Update state
    setFilteredLeads(updatedLeads);
    setDraggedLead(null);
    
    // Show a success toast
    toast({
      title: "Lead movido com sucesso",
      description: `${lead.name} foi movido para ${targetStage.name}`,
      duration: 3000,
    });
  };

  const handleSearchLeads = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchTerm = e.target.value.toLowerCase();
    
    if (!searchTerm.trim()) {
      setFilteredLeads(initialLeads);
      return;
    }
    
    const filtered = initialLeads.filter(lead => 
      lead.name.toLowerCase().includes(searchTerm) || 
      (lead.company && lead.company.toLowerCase().includes(searchTerm)) ||
      lead.email.toLowerCase().includes(searchTerm)
    );
    
    setFilteredLeads(filtered);
  };

  const handleFilterByUser = (userId: string) => {
    if (userId === "atribuido") {
      setFilteredLeads(initialLeads);
      return;
    }
    
    const filtered = initialLeads.filter(lead => lead.assignedTo === userId);
    setFilteredLeads(filtered);
  };

  return {
    filteredLeads,
    leadsByStage,
    leadsNeedingAttention,
    handleDragStart,
    handleDragOver,
    handleDrop,
    handleSearchLeads,
    handleFilterByUser,
    updateLeadStage
  };
}
