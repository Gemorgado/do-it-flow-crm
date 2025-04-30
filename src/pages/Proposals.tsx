import { useState } from "react";
import { Proposal } from "@/types";
import { ProposalsHeader } from "@/components/Proposals/ProposalsHeader";
import { ProposalsFilters } from "@/components/Proposals/ProposalsFilters";
import { ProposalsTable } from "@/components/Proposals/ProposalsTable";
import { ProposalViewDialog } from "@/components/CRM/ProposalViewDialog";
import { ProposalEditDialog } from "@/components/CRM/ProposalEditDialog";

// Mock data para propostas
const mockProposals: Proposal[] = [
  {
    id: "1",
    leadId: "lead1",
    title: "Proposta para Sistema ERP",
    value: 15000,
    createdAt: "2023-04-10T15:30:00Z",
    expiresAt: "2023-05-10T23:59:59Z",
    status: "enviada",
    products: [
      { id: "p1", name: "Implantação ERP", quantity: 1, unitPrice: 10000, total: 10000 },
      { id: "p2", name: "Treinamento", quantity: 5, unitPrice: 1000, total: 5000 }
    ]
  },
  {
    id: "2",
    leadId: "lead2",
    title: "Consultoria Estratégica",
    value: 8500,
    createdAt: "2023-04-12T10:15:00Z",
    expiresAt: "2023-05-12T23:59:59Z",
    status: "visualizada",
    products: [
      { id: "p3", name: "Diagnóstico Empresarial", quantity: 1, unitPrice: 3500, total: 3500 },
      { id: "p4", name: "Plano de Ação", quantity: 1, unitPrice: 5000, total: 5000 }
    ]
  },
  {
    id: "3",
    leadId: "lead3",
    title: "Desenvolvimento de Website",
    value: 12000,
    createdAt: "2023-04-15T09:00:00Z",
    expiresAt: "2023-05-15T23:59:59Z",
    status: "aceita",
    products: [
      { id: "p5", name: "Design UX/UI", quantity: 1, unitPrice: 4000, total: 4000 },
      { id: "p6", name: "Desenvolvimento Frontend", quantity: 1, unitPrice: 5000, total: 5000 },
      { id: "p7", name: "Integração Backend", quantity: 1, unitPrice: 3000, total: 3000 }
    ]
  },
  {
    id: "4",
    leadId: "lead4",
    title: "Plano de Marketing Digital",
    value: 6500,
    createdAt: "2023-04-18T14:20:00Z",
    expiresAt: "2023-05-18T23:59:59Z",
    status: "rejeitada",
    products: [
      { id: "p8", name: "Análise de Mercado", quantity: 1, unitPrice: 2000, total: 2000 },
      { id: "p9", name: "Estratégia de Conteúdo", quantity: 1, unitPrice: 1500, total: 1500 },
      { id: "p10", name: "Gestão de Mídia", quantity: 3, unitPrice: 1000, total: 3000 }
    ]
  },
  {
    id: "5",
    leadId: "lead5",
    title: "Hospedagem e Suporte Anual",
    value: 9600,
    createdAt: "2023-04-20T11:30:00Z",
    expiresAt: "2023-05-20T23:59:59Z",
    status: "em_negociacao",
    products: [
      { id: "p11", name: "Hospedagem em Cloud", quantity: 12, unitPrice: 500, total: 6000 },
      { id: "p12", name: "Suporte Técnico", quantity: 12, unitPrice: 300, total: 3600 }
    ]
  }
];

// Nomes dos clientes para mock
const clientNames: Record<string, string> = {
  "lead1": "Empresa ABC Ltda",
  "lead2": "Comércio XYZ S.A.",
  "lead3": "Indústria Exemplo",
  "lead4": "Startup Inovadora",
  "lead5": "Consultoria Técnica"
};

export default function Proposals() {
  const [searchTerm, setSearchTerm] = useState("");
  const [proposals, setProposals] = useState<Proposal[]>(mockProposals);
  const [statusFilter, setStatusFilter] = useState<string>("todas");
  
  // Estado para controlar os modais de visualização e edição
  const [viewId, setViewId] = useState<string | null>(null);
  const [editId, setEditId] = useState<string | null>(null);

  // Funções para abrir modais
  const handleView = (id: string) => setViewId(id);
  const handleEdit = (id: string) => setEditId(id);

  // Função para filtrar propostas com base no termo de busca e filtro de status
  const filteredProposals = proposals.filter(proposal => {
    const matchesSearch = 
      proposal.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      clientNames[proposal.leadId]?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "todas" || proposal.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="animate-fade-in space-y-6">
      <ProposalsHeader />
      
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
