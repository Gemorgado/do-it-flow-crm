
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  Filter, 
  Search, 
  FileText, 
  MoreHorizontal,
  Calendar,
  User
} from "lucide-react";
import { Proposal, Lead } from "@/types";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useProposalModal } from "@/components/CRM/hooks/useProposalModal";
import { TooltipProvider, Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
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
  const { open: openProposalModal } = useProposalModal();
  
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

  // Função para formatar valor em reais
  function formatCurrency(value: number): string {
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  }

  // Função para formatar datas
  function formatDate(dateString: string): string {
    try {
      const date = new Date(dateString);
      return format(date, "dd/MM/yyyy", { locale: ptBR });
    } catch (error) {
      return "Data inválida";
    }
  }

  // Função para obter cor do status
  function getStatusColor(status: Proposal["status"]): string {
    switch (status) {
      case "enviada":
        return "bg-blue-100 text-blue-800";
      case "visualizada":
        return "bg-purple-100 text-purple-800";
      case "aceita":
        return "bg-green-100 text-green-800";
      case "rejeitada":
        return "bg-red-100 text-red-800";
      case "expirada":
        return "bg-gray-100 text-gray-800";
      case "em_negociacao":
        return "bg-amber-100 text-amber-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  }

  // Função para obter label do status
  function getStatusLabel(status: Proposal["status"]): string {
    switch (status) {
      case "enviada":
        return "Enviada";
      case "visualizada":
        return "Visualizada";
      case "aceita":
        return "Aceita";
      case "rejeitada":
        return "Rejeitada";
      case "expirada":
        return "Expirada";
      case "em_negociacao":
        return "Em Negociação";
      default:
        return "Desconhecido";
    }
  }

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gestão de Propostas</h1>
          <p className="text-gray-500">Crie, gerencie e acompanhe propostas comerciais</p>
        </div>
        <Button className="bg-doIt-primary hover:bg-doIt-dark" onClick={openProposalModal}>
          <Plus className="mr-2 h-4 w-4" /> Nova Proposta
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="flex flex-1 gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Buscar propostas..."
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <select
            className="px-3 py-2 rounded-md border border-input bg-background"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="todas">Todos os status</option>
            <option value="enviada">Enviadas</option>
            <option value="visualizada">Visualizadas</option>
            <option value="aceita">Aceitas</option>
            <option value="rejeitada">Rejeitadas</option>
            <option value="expirada">Expiradas</option>
            <option value="em_negociacao">Em Negociação</option>
          </select>
          
          <Button variant="outline" className="gap-2">
            <Filter className="h-4 w-4" /> Filtros Avançados
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-md border shadow overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="font-medium">Proposta</TableHead>
                <TableHead className="font-medium">Cliente</TableHead>
                <TableHead className="font-medium">Data</TableHead>
                <TableHead className="font-medium">Validade</TableHead>
                <TableHead className="font-medium">Valor</TableHead>
                <TableHead className="font-medium">Status</TableHead>
                <TableHead className="font-medium text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProposals.length > 0 ? (
                filteredProposals.map((proposal) => (
                  <TableRow key={proposal.id} className="hover:bg-gray-50">
                    <TableCell>
                      <div className="font-medium">{proposal.title}</div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-gray-400" />
                        {clientNames[proposal.leadId] || "Cliente não encontrado"}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        {formatDate(proposal.createdAt)}
                      </div>
                    </TableCell>
                    <TableCell>{formatDate(proposal.expiresAt)}</TableCell>
                    <TableCell>
                      <div className="font-medium">{formatCurrency(proposal.value)}</div>
                    </TableCell>
                    <TableCell>
                      <Badge className={`${getStatusColor(proposal.status)}`}>
                        {getStatusLabel(proposal.status)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="h-8 w-8"
                                onClick={() => handleView(proposal.id)}
                              >
                                <FileText className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Visualizar</TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                        
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="h-8 w-8"
                                onClick={() => handleEdit(proposal.id)}
                              >
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Editar</TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">
                    Nenhuma proposta encontrada.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

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
