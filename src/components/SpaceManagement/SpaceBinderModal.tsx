
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useClients, useClientContracts } from "@/hooks/useClients";
import { useSpaceBindings, useBindSpace, useUnbindSpace } from "@/hooks/useSpaceBindings";
import { Client, Location, SpaceBinding } from "@/types";
import { Check, X, Trash } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface SpaceBinderModalProps {
  isOpen: boolean;
  onClose: () => void;
  space: Location | null;
}

export function SpaceBinderModal({ isOpen, onClose, space }: SpaceBinderModalProps) {
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [selectedContractId, setSelectedContractId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  
  const { data: bindings = [] } = useSpaceBindings();
  const { data: clientsList = [] } = useClients();
  const { data: contracts = [] } = useClientContracts(selectedClientId);
  
  const bindSpace = useBindSpace();
  const unbindSpace = useUnbindSpace();
  
  // Check if this space is already bound
  const existingBinding = space ? bindings.find(b => b.spaceId === space.id) : null;
  
  // If space already has binding, select that client and contract
  useEffect(() => {
    if (existingBinding) {
      setSelectedClientId(existingBinding.clientId);
      setSelectedContractId(existingBinding.contractId);
    } else {
      setSelectedClientId(null);
      setSelectedContractId(null);
    }
  }, [existingBinding, space]);
  
  // Filter clients by search query
  const filteredClients = clientsList.filter(client => 
    client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (client.company && client.company.toLowerCase().includes(searchQuery.toLowerCase()))
  );
  
  // Handle binding the space
  const handleSave = () => {
    if (!space || !selectedClientId || !selectedContractId) return;
    
    const binding: SpaceBinding = {
      spaceId: space.id,
      clientId: selectedClientId,
      contractId: selectedContractId,
      boundAt: new Date().toISOString()
    };
    
    bindSpace.mutate(binding);
    onClose();
  };
  
  // Handle unbinding the space
  const handleUnbind = () => {
    if (!space) return;
    unbindSpace.mutate(space.id);
    onClose();
  };
  
  // Get client name by ID
  const getClientName = (id: string): string => {
    const client = clientsList.find(c => c.id === id);
    return client ? client.name : "Cliente desconhecido";
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {existingBinding ? "Editar Vinculação" : "Atribuir Espaço"}
          </DialogTitle>
        </DialogHeader>
        
        {space && (
          <div className="space-y-4">
            <div>
              <Label>Espaço</Label>
              <div className="flex items-center mt-1 p-2 border rounded-md bg-gray-50">
                <span className="text-sm font-medium">{space.name || space.identifier}</span>
                <span className="ml-2 text-xs text-gray-500">({space.type})</span>
              </div>
            </div>
            
            <div>
              <Label htmlFor="clientSearch">Cliente</Label>
              <Input
                id="clientSearch"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar cliente..."
                className="mt-1"
              />
              
              <ScrollArea className="h-40 mt-2 border rounded-md">
                <div className="p-1">
                  {filteredClients.length === 0 ? (
                    <p className="text-sm text-gray-500 p-2">Nenhum cliente encontrado</p>
                  ) : (
                    filteredClients.map(client => (
                      <Button
                        key={client.id}
                        variant={selectedClientId === client.id ? "secondary" : "ghost"}
                        className="w-full justify-start py-2 px-2 h-auto my-1"
                        onClick={() => {
                          setSelectedClientId(client.id);
                          setSelectedContractId(null);
                        }}
                      >
                        <div className="flex items-center">
                          {selectedClientId === client.id && (
                            <Check className="w-4 h-4 mr-2" />
                          )}
                          <div className="text-left">
                            <div>{client.name}</div>
                            {client.company && (
                              <div className="text-xs text-gray-500">{client.company}</div>
                            )}
                          </div>
                        </div>
                      </Button>
                    ))
                  )}
                </div>
              </ScrollArea>
            </div>
            
            {selectedClientId && (
              <div>
                <Label htmlFor="contract">Contrato</Label>
                <Select
                  value={selectedContractId || ""}
                  onValueChange={setSelectedContractId}
                >
                  <SelectTrigger id="contract">
                    <SelectValue placeholder="Selecione o contrato" />
                  </SelectTrigger>
                  <SelectContent>
                    {contracts.length === 0 ? (
                      <SelectItem value="none" disabled>
                        Nenhum contrato ativo disponível
                      </SelectItem>
                    ) : (
                      contracts.map(contract => (
                        <SelectItem key={contract.id} value={contract.id}>
                          {contract.description} - R$ {contract.value.toFixed(2)}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
        )}
        
        <DialogFooter className="flex justify-between sm:justify-between">
          <div className="space-x-2">
            {existingBinding && (
              <Button
                variant="destructive"
                size="sm"
                onClick={handleUnbind}
                disabled={unbindSpace.isPending}
              >
                <Trash className="w-4 h-4 mr-2" />
                Desvincular
              </Button>
            )}
          </div>
          
          <div className="space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onClose}
            >
              <X className="w-4 h-4 mr-2" />
              Cancelar
            </Button>
            
            <Button
              size="sm"
              onClick={handleSave}
              disabled={!selectedClientId || !selectedContractId || bindSpace.isPending}
            >
              <Check className="w-4 h-4 mr-2" />
              Salvar
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
