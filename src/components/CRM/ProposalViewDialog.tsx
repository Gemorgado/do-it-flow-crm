
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Proposal } from "@/types";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useGetProposal } from "@/api/proposal";
import { Badge } from "../ui/badge";

interface ProposalViewDialogProps {
  open: boolean;
  id: string | null;
  onClose: () => void;
}

export function ProposalViewDialog({ open, id, onClose }: ProposalViewDialogProps) {
  const { data: proposal, isLoading } = useGetProposal(id);

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

  // Função para obter o label do status
  function getStatusLabel(status: Proposal["status"]): string {
    switch (status) {
      case "enviada": return "Enviada";
      case "visualizada": return "Visualizada";
      case "aceita": return "Aceita";
      case "rejeitada": return "Rejeitada";
      case "expirada": return "Expirada";
      case "em_negociacao": return "Em Negociação";
      default: return "Desconhecido";
    }
  }

  // Função para obter cor do status
  function getStatusColor(status: Proposal["status"]): string {
    switch (status) {
      case "enviada": return "bg-blue-100 text-blue-800";
      case "visualizada": return "bg-purple-100 text-purple-800";
      case "aceita": return "bg-green-100 text-green-800";
      case "rejeitada": return "bg-red-100 text-red-800";
      case "expirada": return "bg-gray-100 text-gray-800";
      case "em_negociacao": return "bg-amber-100 text-amber-800";
      default: return "bg-gray-100 text-gray-800";
    }
  }

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Proposta · {proposal?.title ?? "..."}</DialogTitle>
        </DialogHeader>
        
        {isLoading ? (
          <div className="flex justify-center py-8">Carregando...</div>
        ) : proposal ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium text-gray-500">Cliente</h4>
                <p className="text-base">{proposal.leadId}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500">Valor</h4>
                <p className="text-base font-medium">{formatCurrency(proposal.value)}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500">Data de criação</h4>
                <p className="text-base">{formatDate(proposal.createdAt)}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500">Validade</h4>
                <p className="text-base">{formatDate(proposal.expiresAt)}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500">Status</h4>
                <Badge className={`${getStatusColor(proposal.status)}`}>
                  {getStatusLabel(proposal.status)}
                </Badge>
              </div>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-2">Produtos/Serviços</h4>
              <div className="border rounded-md overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="py-2 px-4 text-left font-medium">Descrição</th>
                      <th className="py-2 px-4 text-center font-medium">Qtd</th>
                      <th className="py-2 px-4 text-right font-medium">Valor Unit.</th>
                      <th className="py-2 px-4 text-right font-medium">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {proposal.products.map((product) => (
                      <tr key={product.id} className="border-t">
                        <td className="py-2 px-4">{product.name}</td>
                        <td className="py-2 px-4 text-center">{product.quantity}</td>
                        <td className="py-2 px-4 text-right">
                          {formatCurrency(product.unitPrice)}
                        </td>
                        <td className="py-2 px-4 text-right font-medium">
                          {formatCurrency(product.total)}
                        </td>
                      </tr>
                    ))}
                    <tr className="border-t bg-gray-50">
                      <td className="py-2 px-4 font-medium" colSpan={3}>Total</td>
                      <td className="py-2 px-4 text-right font-medium">
                        {formatCurrency(proposal.value)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ) : (
          <div className="py-4 text-center text-gray-500">Proposta não encontrada</div>
        )}
      </DialogContent>
    </Dialog>
  );
}
