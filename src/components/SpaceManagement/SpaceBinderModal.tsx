
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useClients, useClientActiveContract } from "@/hooks/useClients";
import { useSpaceBindings, useBindSpace, useUnbindSpace } from "@/hooks/useSpaceBindings";
import { Location, SpaceBinding } from "@/types";
import { SpaceBinderClient } from "./SpaceBinderClient";
import { SpaceBinderContractDetails } from "./SpaceBinderContractDetails";
import { SpaceBinderActions } from "./SpaceBinderActions";
import { SpaceInfo } from "./SpaceInfo";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface SpaceBinderModalProps {
  isOpen: boolean;
  onClose: () => void;
  space: Location | null;
}

export function SpaceBinderModal({ isOpen, onClose, space }: SpaceBinderModalProps) {
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Contract details state
  const [unitPrice, setUnitPrice] = useState<number | null>(null);
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);
  const [contractId, setContractId] = useState<string | null>(null);
  
  const { data: bindings = [] } = useSpaceBindings();
  const { data: clientsList = [] } = useClients();
  const { data: activeContract = null, isLoading: isLoadingContract } = useClientActiveContract(selectedClientId);
  
  const bindSpace = useBindSpace();
  const unbindSpace = useUnbindSpace();
  
  // Check if this space is already bound
  const existingBinding = space ? bindings.find(b => b.spaceId === space.id) : null;
  
  // Reset form when modal opens/closes or space changes
  useEffect(() => {
    if (existingBinding) {
      setSelectedClientId(existingBinding.clientId);
      setContractId(existingBinding.contractId);
      setUnitPrice(existingBinding.unitPrice || null);
      setStartDate(existingBinding.startDate || null);
      setEndDate(existingBinding.endDate || null);
      console.log("Loading existing binding:", existingBinding);
    } else {
      // Only reset if modal is open (prevents unnecessary resets during initialization)
      if (isOpen) {
        console.log("Resetting form - no existing binding");
        setSelectedClientId(null);
        setContractId(null);
        setUnitPrice(null);
        setStartDate(null);
        setEndDate(null);
      }
    }
  }, [existingBinding, isOpen, space]);
  
  // Filter clients by search query
  const filteredClients = clientsList.filter(client => 
    client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (client.company && client.company.toLowerCase().includes(searchQuery.toLowerCase()))
  );
  
  // Update contract details when active contract changes
  useEffect(() => {
    if (!activeContract) {
      setContractId(null);
      setUnitPrice(null);
      setStartDate(null);
      setEndDate(null);
      return;
    }
    
    console.log("Setting contract details from active contract:", activeContract);
    setContractId(activeContract.id);
    setUnitPrice(activeContract.value);
    setStartDate(activeContract.contractStart);
    setEndDate(activeContract.contractEnd);
  }, [activeContract]);
  
  // Log important state changes for debugging purposes
  useEffect(() => {
    console.log("Client ID:", selectedClientId);
    console.log("Active contract:", activeContract);
  }, [selectedClientId, activeContract]);
  
  // Handle binding the space
  const handleSave = () => {
    if (!space) {
      toast.error("Erro", {
        description: "Nenhum espaço selecionado"
      });
      return;
    }
    
    if (!selectedClientId) {
      toast.error("Dados incompletos", {
        description: "Selecione um cliente para vincular o espaço"
      });
      return;
    }
    
    if (!contractId) {
      toast.error("Dados incompletos", {
        description: "Cliente não possui contrato ativo"
      });
      return;
    }
    
    const binding: SpaceBinding = {
      spaceId: space.id,
      clientId: selectedClientId,
      contractId: contractId,
      boundAt: new Date().toISOString(),
      unitPrice,
      startDate,
      endDate
    };
    
    console.log("Saving binding:", binding);
    bindSpace.mutate(binding);
    onClose();
  };
  
  // Handle unbinding the space
  const handleUnbind = () => {
    if (!space) return;
    unbindSpace.mutate(space.id);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {existingBinding ? "Editar Vinculação" : "Atribuir Espaço"}
          </DialogTitle>
          <DialogDescription>
            {existingBinding ? "Edite os detalhes da vinculação" : "Atribua este espaço a um cliente"}
          </DialogDescription>
        </DialogHeader>
        
        {space && (
          <div className="space-y-4">
            <SpaceInfo space={space} />
            
            <SpaceBinderClient
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              filteredClients={filteredClients}
              selectedClientId={selectedClientId}
              setSelectedClientId={setSelectedClientId}
            />
            
            {isLoadingContract && selectedClientId && (
              <div className="flex items-center justify-center p-4">
                <Loader2 className="h-6 w-6 mr-2 animate-spin" />
                <span>Carregando contrato...</span>
              </div>
            )}
            
            {selectedClientId && !isLoadingContract && !activeContract && (
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md text-yellow-800">
                <p className="text-sm font-medium">Cliente não possui contrato ativo</p>
                <p className="text-xs">Cadastre um contrato ativo para este cliente primeiro</p>
              </div>
            )}
            
            {activeContract && (
              <SpaceBinderContractDetails
                selectedContractId={contractId}
                unitPrice={unitPrice}
                startDate={startDate}
                endDate={endDate}
              />
            )}
          </div>
        )}
        
        <SpaceBinderActions
          existingBinding={existingBinding}
          onClose={onClose}
          handleSave={handleSave}
          handleUnbind={handleUnbind}
          bindSpace={bindSpace}
          unbindSpace={unbindSpace}
          canSave={!!selectedClientId && !!contractId && !isLoadingContract}
        />
      </DialogContent>
    </Dialog>
  );
}
