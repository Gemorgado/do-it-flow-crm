
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Plus, 
  Filter, 
  Search, 
  UserPlus,
  AlertTriangle
} from "lucide-react";
import { leads, pipelineStages } from "@/data/mockData";
import { Lead, PipelineStage } from "@/types";
import { toast } from "@/hooks/use-toast";
import { PipelineColumn } from "@/components/Pipeline/PipelineColumn";
import { 
  getLeadsNeedingAttention, 
  triggerAutomation, 
  trackStageChange 
} from "@/utils/pipelineAutomation";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { trackLeadEvent } from "@/utils/trackingUtils";

export default function Pipeline() {
  const [filteredLeads, setFilteredLeads] = useState<Lead[]>(leads);
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
      setFilteredLeads(leads);
      return;
    }
    
    const filtered = leads.filter(lead => 
      lead.name.toLowerCase().includes(searchTerm) || 
      (lead.company && lead.company.toLowerCase().includes(searchTerm)) ||
      lead.email.toLowerCase().includes(searchTerm)
    );
    
    setFilteredLeads(filtered);
  };

  const handleFilterByUser = (userId: string) => {
    if (userId === "atribuido") {
      setFilteredLeads(leads);
      return;
    }
    
    const filtered = leads.filter(lead => lead.assignedTo === userId);
    setFilteredLeads(filtered);
  };

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Pipeline de Vendas</h1>
          <p className="text-gray-500">Gerencie seu funil de vendas de forma visual e eficiente</p>
        </div>
        <Button 
          className="bg-doIt-primary hover:bg-doIt-dark"
          onClick={() => trackLeadEvent('new_lead_button_click', {})}
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

      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="flex flex-1 gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Buscar leads..."
              className="pl-9"
              onChange={handleSearchLeads}
            />
          </div>
          
          <Button variant="outline" className="gap-2">
            <Filter className="h-4 w-4" /> Filtros
          </Button>
        </div>
        
        <div className="flex gap-3">
          <Select 
            defaultValue="atribuido" 
            onValueChange={handleFilterByUser}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Atribuído a" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="atribuido">Todos</SelectItem>
              <SelectItem value="1">Amanda Silva</SelectItem>
              <SelectItem value="2">Ricardo Barros</SelectItem>
              <SelectItem value="3">Camila Costa</SelectItem>
            </SelectContent>
          </Select>
          
          <Select defaultValue="criacao">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Ordenar por" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="criacao">Data de criação</SelectItem>
              <SelectItem value="atualizacao">Última atualização</SelectItem>
              <SelectItem value="valor">Valor da proposta</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="overflow-x-auto pb-6">
        <div className="flex gap-4" style={{ minWidth: pipelineStages.length * 320 + 'px' }}>
          {pipelineStages.map((stage) => (
            <PipelineColumn 
              key={stage.id} 
              stage={stage} 
              leads={leadsByStage[stage.id] || []} 
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, stage.id)}
              onDragStart={handleDragStart}
              onStageUpdate={updateLeadStage}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
