
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/modules/auth/AuthProvider";
import { ProposalsHeader } from "@/components/Proposals/ProposalsHeader";
import { ProposalsFilters } from "@/components/Proposals/ProposalsFilters";
import { ProposalsTable } from "@/components/Proposals/ProposalsTable";
import { ProposalViewDialog } from "@/components/CRM/ProposalViewDialog";
import { ProposalEditDialog } from "@/components/CRM/ProposalEditDialog";
import { useProposals } from "@/api/proposals";

export default function Proposals() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("todas");
  const { currentUser } = useAuth();
  
  // Estado para controlar os modais de visualização e edição
  const [viewId, setViewId] = useState<string | null>(null);
  const [editId, setEditId] = useState<string | null>(null);

  // Obter propostas filtradas por dono quando necessário
  const { data: proposals = [] } = useProposals();

  // Nomes dos clientes para mock
  const clientNames: Record<string, string> = {
    "lead1": "Empresa ABC Ltda",
    "lead2": "Comércio XYZ S.A.",
    "lead3": "Indústria Exemplo",
    "lead4": "Startup Inovadora",
    "lead5": "Consultoria Técnica"
  };

  // Funções para abrir modais
  const handleView = (id: string) => setViewId(id);
  const handleEdit = (id: string) => setEditId(id);

  // Função para filtrar propostas com base no termo de busca e filtro de status
  const filteredProposals = proposals.filter(proposal => {
    const matchesSearch = 
      proposal.title?.toLowerCase().includes(searchTerm.toLowerCase()) || 
      clientNames[proposal.leadId]?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "todas" || proposal.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex items-center justify-between">
        <ProposalsHeader />
        
        {currentUser && !currentUser.viewAllProposals && (
          <Badge variant="outline" className="ml-2">
            Mostrando apenas minhas propostas
          </Badge>
        )}
      </div>
      
      <ProposalsFilters 
        searchTerm={searchTerm} 
        statusFilter={statusFilter} 
        onSearchChange={setSearchTerm} 
        onStatusChange={setStatusFilter} 
      />
      
      <ProposalsTable 
        proposals={filteredProposals} 
        clientNames={clientNames}
        onView={handleView} 
        onEdit={handleEdit} 
      />

      {/* Modais de visualização e edição */}
      <ProposalViewDialog 
        open={!!viewId} 
        id={viewId} 
        onClose={() => setViewId(null)} 
      />
      
      <ProposalEditDialog 
        open={!!editId} 
        id={editId} 
        onClose={() => setEditId(null)} 
      />
    </div>
  );
}
