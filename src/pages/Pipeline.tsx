
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
  FileText
} from "lucide-react";
import { leads, pipelineStages } from "@/data/mockData";
import { Lead, PipelineStage } from "@/types";

export default function Pipeline() {
  const [filteredLeads, setFilteredLeads] = useState<Lead[]>(leads);
  
  // Group leads by pipeline stage
  const leadsByStage: Record<string, Lead[]> = {};
  
  pipelineStages.forEach(stage => {
    leadsByStage[stage.id] = filteredLeads.filter(
      lead => lead.stage.id === stage.id
    );
  });

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
            />
          </div>
          
          <Button variant="outline" className="gap-2">
            <Filter className="h-4 w-4" /> Filtros
          </Button>
        </div>
        
        <div className="flex gap-3">
          <Select defaultValue="atribuido">
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
}

function PipelineColumn({ stage, leads }: PipelineColumnProps) {
  return (
    <div className="flex-1 min-w-[300px] max-w-[320px]">
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
      
      <div className="space-y-3">
        {leads.map((lead) => (
          <LeadCard key={lead.id} lead={lead} />
        ))}
        
        {leads.length === 0 && (
          <div className="border border-dashed border-gray-200 rounded-md p-4 text-center text-gray-400 text-sm">
            Nenhum lead neste estágio
          </div>
        )}
        
        <button className="w-full border border-dashed border-gray-200 rounded-md p-3 text-gray-500 flex items-center justify-center hover:bg-gray-50 transition-colors">
          <Plus className="h-4 w-4 mr-1" /> Adicionar Lead
        </button>
      </div>
    </div>
  );
}

interface LeadCardProps {
  lead: Lead;
}

function LeadCard({ lead }: LeadCardProps) {
  function formatValue(value?: number): string {
    if (!value) return "Não informado";
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }

  return (
    <div className="bg-white border rounded-md shadow-sm p-3 cursor-pointer hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-1">
        <h4 className="font-medium">{lead.name}</h4>
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
