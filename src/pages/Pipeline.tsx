
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Plus, 
  Filter, 
  Search, 
  UserPlus, 
  Calendar,
  MessageSquare,
  FileText,
  Move
} from "lucide-react";
import { leads, pipelineStages } from "@/data/mockData";
import { Lead, PipelineStage } from "@/types";
import { toast } from "@/hooks/use-toast";

export default function Pipeline() {
  const [filteredLeads, setFilteredLeads] = useState<Lead[]>(leads);
  const [draggedLead, setDraggedLead] = useState<Lead | null>(null);
  
  // Group leads by pipeline stage
  const leadsByStage: Record<string, Lead[]> = {};
  
  pipelineStages.forEach(stage => {
    leadsByStage[stage.id] = filteredLeads.filter(
      lead => lead.stage.id === stage.id
    );
  });

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

    // Find the target stage
    const targetStage = pipelineStages.find(stage => stage.id === targetStageId);
    if (!targetStage) return;

    // Update the lead's stage
    const updatedLeads = filteredLeads.map(lead => 
      lead.id === draggedLead.id 
        ? { ...lead, stage: targetStage }
        : lead
    );

    // Update state
    setFilteredLeads(updatedLeads);
    setDraggedLead(null);
    
    // Show a success toast
    toast({
      title: "Lead movido com sucesso",
      description: `${draggedLead.name} foi movido para ${targetStage.name}`,
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
        <Button className="bg-doIt-primary hover:bg-doIt-dark">
          <Plus className="mr-2 h-4 w-4" /> Novo Lead
        </Button>
      </div>

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
            />
          ))}
        </div>
      </div>
    </div>
  );
}

interface PipelineColumnProps {
  stage: PipelineStage;
  leads: Lead[];
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
  onDragStart: (e: React.DragEvent, lead: Lead) => void;
}

function PipelineColumn({ stage, leads, onDragOver, onDrop, onDragStart }: PipelineColumnProps) {
  return (
    <div 
      className="flex-1 min-w-[300px] max-w-[320px]"
      onDragOver={onDragOver}
      onDrop={onDrop}
    >
      <div className="flex items-center justify-between mb-3 px-2">
        <h3 className="font-medium flex items-center gap-2">
          <div 
            className="w-3 h-3 rounded-full" 
            style={{ backgroundColor: stage.color }} 
          />
          {stage.name}
          <span className="ml-1 text-sm text-gray-500">({leads.length})</span>
        </h3>
      </div>
      
      <div className="space-y-3 min-h-[300px] p-2 rounded-md border-2 border-dashed border-gray-200 bg-gray-50">
        {leads.map((lead) => (
          <LeadCard 
            key={lead.id} 
            lead={lead}
            onDragStart={onDragStart}
          />
        ))}
        
        {leads.length === 0 && (
          <div className="border border-dashed border-gray-200 rounded-md p-4 text-center text-gray-400 text-sm h-24 flex items-center justify-center">
            Arraste leads para esta coluna
          </div>
        )}
        
        <button className="w-full border border-dashed border-gray-200 rounded-md p-3 text-gray-500 flex items-center justify-center hover:bg-gray-50 transition-colors bg-white">
          <Plus className="h-4 w-4 mr-1" /> Adicionar Lead
        </button>
      </div>
    </div>
  );
}

interface LeadCardProps {
  lead: Lead;
  onDragStart: (e: React.DragEvent, lead: Lead) => void;
}

function LeadCard({ lead, onDragStart }: LeadCardProps) {
  function formatValue(value?: number): string {
    if (!value) return "Não informado";
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }

  return (
    <div 
      className="bg-white border rounded-md shadow-sm p-3 cursor-move hover:shadow-md transition-shadow"
      draggable
      onDragStart={(e) => onDragStart(e, lead)}
    >
      <div className="flex justify-between items-start mb-1">
        <h4 className="font-medium flex items-center gap-1">
          <Move className="h-3 w-3 text-gray-400" />
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
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <MessageSquare className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <FileText className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
