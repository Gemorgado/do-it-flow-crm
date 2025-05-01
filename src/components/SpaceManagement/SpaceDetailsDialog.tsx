
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Location, ClientService, SpaceBinding } from "@/types";
import { useSpaceBindings } from "@/hooks/useSpaceBindings";
import { useClients } from "@/hooks/useClients";
import { useUpdateSpace } from "@/hooks/useSpaceManagement";
import { toast } from "sonner";
import { format } from "date-fns";

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
  const updateSpace = useUpdateSpace();
  
  // State for editable fields
  const [area, setArea] = useState<string>(space.area ? String(space.area) : "");
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [unitPrice, setUnitPrice] = useState<string>("");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  // Check if this space is bound to a client
  const binding = bindings.find(b => b.spaceId === space.id);
  const client = binding ? clients.find(c => c.id === binding.clientId) : null;
  
  // Reset state when dialog opens with new space
  useEffect(() => {
    if (space) {
      setArea(space.area ? String(space.area) : "");
      setIsEditing(false);
      
      if (binding) {
        // Initialize binding-related fields if they exist
        setUnitPrice(binding.unitPrice ? String(binding.unitPrice) : "");
        setStartDate(binding.startDate || "");
        setEndDate(binding.endDate || "");
      } else {
        setUnitPrice("");
        setStartDate("");
        setEndDate("");
      }
    }
  }, [space, binding]);
  
  // Map service types to human-readable names
  const serviceTypeLabels = {
    sala_privativa: "Sala Privativa",
    estacao: "Estação de Trabalho",
    sala_reuniao: "Sala de Reunião",
    endereco_fiscal: "Endereço Fiscal"
  };
  
  const handleSaveChanges = () => {
    const updatedSpace = {
      ...space,
      area: area ? parseFloat(area) : undefined
    };
    
    const updatedBinding = binding ? {
      ...binding,
      unitPrice: unitPrice ? parseFloat(unitPrice) : binding.unitPrice,
      startDate: startDate || binding.startDate,
      endDate: endDate || binding.endDate
    } : null;

    updateSpace.mutate(
      { space: updatedSpace, binding: updatedBinding },
      {
        onSuccess: () => {
          setIsEditing(false);
        }
      }
    );
  };

  // Format date for display
  const formatLocalDate = (dateString?: string) => {
    if (!dateString) return "";
    try {
      return new Date(dateString).toLocaleDateString();
    } catch (e) {
      return dateString;
    }
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
            
            <div>
              <Label htmlFor="area" className="text-sm font-medium text-gray-500">Área (m²)</Label>
              {isEditing ? (
                <Input
                  id="area"
                  type="number"
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  className="mt-1"
                  min="0"
                  step="0.01"
                />
              ) : (
                <p>{space.area ? `${space.area} m²` : "Não definida"}</p>
              )}
            </div>
            
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
                
                <div className="mt-2">
                  <Label htmlFor="unitPrice" className="text-xs font-medium text-gray-500">Valor Mensal (R$)</Label>
                  {isEditing ? (
                    <Input
                      id="unitPrice"
                      type="number"
                      value={unitPrice}
                      onChange={(e) => setUnitPrice(e.target.value)}
                      className="mt-1 text-sm"
                      min="0"
                      step="0.01"
                      placeholder="Valor mensal"
                    />
                  ) : (
                    <p className="text-sm">
                      {binding.unitPrice 
                        ? new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(binding.unitPrice)
                        : "Valor não definido"}
                    </p>
                  )}
                </div>
                
                {isEditing ? (
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <div>
                      <Label htmlFor="startDate" className="text-xs font-medium text-gray-500">Data Início</Label>
                      <Input
                        id="startDate"
                        type="date"
                        value={startDate ? startDate.substring(0, 10) : ""}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="mt-1 text-sm"
                      />
                    </div>
                    <div>
                      <Label htmlFor="endDate" className="text-xs font-medium text-gray-500">Data Fim</Label>
                      <Input
                        id="endDate"
                        type="date"
                        value={endDate ? endDate.substring(0, 10) : ""}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="mt-1 text-sm"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="text-xs text-gray-500 mt-2">
                    {binding.startDate && <p>Início: {formatLocalDate(binding.startDate)}</p>}
                    {binding.endDate && <p>Término: {formatLocalDate(binding.endDate)}</p>}
                    <p>Vinculado em {formatLocalDate(binding.boundAt)}</p>
                  </div>
                )}
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
          
          <div className="pt-2 flex justify-end space-x-2">
            {isEditing ? (
              <>
                <Button variant="outline" onClick={() => setIsEditing(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleSaveChanges} disabled={updateSpace.isPending}>
                  Salvar Alterações
                </Button>
              </>
            ) : (
              <>
                <Button onClick={() => setIsEditing(true)}>
                  Editar Informações
                </Button>
                {space.available && onAssignSpace && (
                  <Button onClick={onAssignSpace}>
                    Vincular a Cliente
                  </Button>
                )}
              </>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
