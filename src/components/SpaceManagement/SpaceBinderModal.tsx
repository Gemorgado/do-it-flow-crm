
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useClients, useClientContracts } from "@/hooks/useClients";
import { useSpaceBindings, useBindSpace, useUnbindSpace } from "@/hooks/useSpaceBindings";
import { Location, SpaceBinding } from "@/types";
import { SpaceBinderClient } from "./SpaceBinderClient";
import { SpaceBinderContract } from "./SpaceBinderContract";
import { SpaceBinderContractDetails } from "./SpaceBinderContractDetails";
import { SpaceBinderActions } from "./SpaceBinderActions";
import { SpaceInfo } from "./SpaceInfo";
import { toast } from "sonner";

interface SpaceBinderModalProps {
  isOpen: boolean;
  onClose: () => void;
  space: Location | null;
}

export function SpaceBinderModal({ isOpen, onClose, space }: SpaceBinderModalProps) {
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [selectedContractId, setSelectedContractId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Contract details state
  const [unitPrice, setUnitPrice] = useState<number | null>(null);
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);
  
  const { data: bindings = [] } = useSpaceBindings();
  const { data: clientsList = [] } = useClients();
  const { data: contracts = [], isLoading: isLoadingContracts } = useClientContracts(selectedClientId);
  
  const bindSpace = useBindSpace();
  const unbindSpace = useUnbindSpace();
  
  // Check if this space is already bound
  const existingBinding = space ? bindings.find(b => b.spaceId === space.id) : null;
  
  // Reset form when modal opens/closes or space changes
  useEffect(() => {
    if (existingBinding) {
      setSelectedClientId(existingBinding.clientId);
      setSelectedContractId(existingBinding.contractId);
      setUnitPrice(existingBinding.unitPrice || null);
      setStartDate(existingBinding.startDate || null);
      setEndDate(existingBinding.endDate || null);
      console.log("Loading existing binding:", existingBinding);
    } else {
      // Only reset if modal is open (prevents unnecessary resets during initialization)
      if (isOpen) {
        console.log("Resetting form - no existing binding");
        setSelectedClientId(null);
        setSelectedContractId(null);
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
  
  // Update contract details when contract is selected
  useEffect(() => {
    if (!selectedContractId) {
      setUnitPrice(null);
      setStartDate(null);
      setEndDate(null);
      return;
    }
    
    const selectedContract = contracts.find(c => c.id === selectedContractId);
    if (selectedContract) {
      console.log("Selected contract:", selectedContract);
      setUnitPrice(selectedContract.value);
      setStartDate(selectedContract.contractStart);
      setEndDate(selectedContract.contractEnd);
    } else {
      console.warn("Contract ID selected but not found in contracts list:", selectedContractId);
    }
  }, [selectedContractId, contracts]);
  
  // Log important state changes for debugging purposes
  useEffect(() => {
    console.log("Client ID:", selectedClientId);
    console.log("Available contracts:", contracts);
    console.log("Selected contract ID:", selectedContractId);
  }, [selectedClientId, contracts, selectedContractId]);
  
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
    
    if (!selectedContractId) {
      toast.error("Dados incompletos", {
        description: "Selecione um contrato para vincular o espaço"
      });
      return;
    }
    
    const binding: SpaceBinding = {
      spaceId: space.id,
      clientId: selectedClientId,
      contractId: selectedContractId,
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
  
  // Reset selected contract when client changes
  useEffect(() => {
    if (selectedClientId && selectedContractId) {
      // Only reset if we're not loading existing binding data
      const isFromExistingBinding = existingBinding && 
                                   existingBinding.clientId === selectedClientId && 
                                   existingBinding.contractId === selectedContractId;
      
      if (!isFromExistingBinding) {
        console.log("Client changed - resetting selected contract");
        setSelectedContractId(null);
      }
    }
  }, [selectedClientId, existingBinding, selectedContractId]);

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
              setSelectedContractId={setSelectedContractId}
            />
            
            <SpaceBinderContract
              selectedClientId={selectedClientId}
              selectedContractId={selectedContractId}
              setSelectedContractId={setSelectedContractId}
              contracts={contracts}
              isLoading={isLoadingContracts}
            />
            
            <SpaceBinderContractDetails
              selectedContractId={selectedContractId}
              unitPrice={unitPrice}
              startDate={startDate}
              endDate={endDate}
            />
          </div>
        )}
        
        <SpaceBinderActions
          existingBinding={existingBinding}
          onClose={onClose}
          handleSave={handleSave}
          handleUnbind={handleUnbind}
          bindSpace={bindSpace}
          unbindSpace={unbindSpace}
          canSave={!!selectedClientId && !!selectedContractId}
        />
      </DialogContent>
    </Dialog>
  );
}
