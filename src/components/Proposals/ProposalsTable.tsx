
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TooltipProvider, Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { FileText, MoreHorizontal, Calendar, User } from "lucide-react";
import { Proposal } from "@/types";
import { formatCurrency, formatDate } from "@/utils/formatters";

interface ProposalsTableProps {
  proposals: Proposal[];
  clientNames: Record<string, string>;
  onView: (id: string) => void;
  onEdit: (id: string) => void;
}

export function ProposalsTable({ 
  proposals, 
  clientNames, 
  onView,
  onEdit
}: ProposalsTableProps) {
  // Function to get status color
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

  // Function to get status label
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
            {proposals.length > 0 ? (
              proposals.map((proposal) => (
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
                              onClick={() => onView(proposal.id)}
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
                              onClick={() => onEdit(proposal.id)}
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
  );
}
