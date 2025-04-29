
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Location, ClientService, Client } from "@/types";
import { format } from "date-fns";
import { clients } from "@/data/mockData";

interface SpaceDetailsDialogProps {
  space: Location;
  clientServices: ClientService[];
  isOpen: boolean;
  onClose: () => void;
}

export function SpaceDetailsDialog({ space, clientServices, isOpen, onClose }: SpaceDetailsDialogProps) {
  const spaceTypeLabel = {
    sala_privativa: "Sala Privativa",
    estacao: "Estação",
    sala_reuniao: "Sala de Reunião",
    endereco_fiscal: "Endereço Fiscal"
  };

  // Find client information
  const getClientInfo = (clientId: string): Client | undefined => {
    return clients.find(client => client.id === clientId);
  };

  const currentService = clientServices.length > 0 ? clientServices[0] : null;
  const client = currentService ? getClientInfo(currentService.clientId) : null;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {spaceTypeLabel[space.type as keyof typeof spaceTypeLabel]} {space.identifier}
          </DialogTitle>
        </DialogHeader>
        <div className="py-4">
          {space.available ? (
            <div className="text-center py-8">
              <p className="text-green-600 font-semibold mb-2">Disponível</p>
              <p className="text-gray-500">Este espaço está disponível para contratação.</p>
            </div>
          ) : client && currentService ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Cliente</p>
                  <p className="font-medium">{client.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Empresa</p>
                  <p className="font-medium">{client.company}</p>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-500">Plano Contratado</p>
                <p className="font-medium">{currentService.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Início do Contrato</p>
                  <p className="font-medium">
                    {format(new Date(currentService.contractStart), 'dd/MM/yyyy')}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Fim do Contrato</p>
                  <p className="font-medium">
                    {format(new Date(currentService.contractEnd), 'dd/MM/yyyy')}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Valor</p>
                  <p className="font-bold text-lg">{formatCurrency(currentService.value)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Faturamento</p>
                  <p className="font-medium capitalize">{currentService.billingCycle}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-amber-600 font-semibold mb-2">Ocupado</p>
              <p className="text-gray-500">Informações do cliente não disponíveis.</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
