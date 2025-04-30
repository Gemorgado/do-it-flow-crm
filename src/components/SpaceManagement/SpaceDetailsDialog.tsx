
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Location, ClientService } from "@/types";
import { useSpaceBindings } from "@/hooks/useSpaceBindings";
import { useClients } from "@/hooks/useClients";

interface SpaceDetailsDialogProps {
  space: Location;
  isOpen: boolean;
  onClose: () => void;
  clientServices: ClientService[];
  onAssignSpace?: () => void;
}

export function SpaceDetailsDialog({ 
  space, 
  isOpen, 
  onClose, 
  clientServices,
  onAssignSpace
}: SpaceDetailsDialogProps) {
  const { data: bindings = [] } = useSpaceBindings();
  const { data: clients = [] } = useClients();
  
  // Check if this space is bound to a client
  const binding = bindings.find(b => b.spaceId === space.id);
  const client = binding ? clients.find(c => c.id === binding.clientId) : null;
  
  // Map service types to human-readable names
  const serviceTypeLabels = {
    sala_privativa: "Sala Privativa",
    estacao: "Estação de Trabalho",
    sala_reuniao: "Sala de Reunião",
    endereco_fiscal: "Endereço Fiscal"
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Detalhes do Espaço</span>
            <Badge variant={space.available ? "outline" : "secondary"}>
              {space.available ? "Disponível" : "Indisponível"}
            </Badge>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-x-4 gap-y-2">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Identificador</h3>
              <p>{space.identifier}</p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-500">Tipo</h3>
              <p>{serviceTypeLabels[space.type as keyof typeof serviceTypeLabels] || space.type}</p>
            </div>
            
            {space.area && (
              <div>
                <h3 className="text-sm font-medium text-gray-500">Área</h3>
                <p>{space.area} m²</p>
              </div>
            )}
            
            {space.capacity && (
              <div>
                <h3 className="text-sm font-medium text-gray-500">Capacidade</h3>
                <p>{space.capacity} pessoa{space.capacity > 1 ? 's' : ''}</p>
              </div>
            )}
          </div>
          
          {client && binding && (
            <div className="border-t pt-4">
              <h3 className="text-sm font-medium mb-2">Cliente Vinculado</h3>
              <div className="bg-green-50 border border-green-200 rounded-md p-3">
                <div className="font-medium">{client.name}</div>
                {client.company && <div className="text-sm text-gray-600">{client.company}</div>}
                <div className="mt-2 text-xs text-gray-500">
                  Vinculado em {new Date(binding.boundAt).toLocaleDateString()}
                </div>
              </div>
            </div>
          )}
          
          {clientServices.length > 0 && (
            <div className="border-t pt-4">
              <h3 className="text-sm font-medium mb-2">Serviços Associados</h3>
              <div className="space-y-2">
                {clientServices.map(service => (
                  <div key={service.id} className="border rounded-md p-3">
                    <div className="font-medium">{service.description}</div>
                    <div className="text-sm">
                      <span className="text-gray-600">Valor:</span> R$ {service.value.toFixed(2)}
                    </div>
                    <div className="text-sm">
                      <span className="text-gray-600">Período:</span> {new Date(service.contractStart).toLocaleDateString()} a {new Date(service.contractEnd).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {space.available && onAssignSpace && (
            <div className="pt-2 flex justify-end">
              <Button onClick={onAssignSpace}>
                Vincular a Cliente
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
