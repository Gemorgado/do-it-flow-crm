
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useClients, useClientContracts } from "@/hooks/useClients";
import { useSpaceBindings, useBindSpace, useUnbindSpace } from "@/hooks/useSpaceBindings";
import { Location, SpaceBinding } from "@/types";
import { SpaceBinderClient } from "./SpaceBinderClient";
import { SpaceBinderContract } from "./SpaceBinderContract";
import { SpaceBinderContractDetails } from "./SpaceBinderContractDetails";
import { SpaceBinderActions } from "./SpaceBinderActions";
import { SpaceInfo } from "./SpaceInfo";

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
      setUnitPrice(existingBinding.unitPrice || null);
      setStartDate(existingBinding.startDate || null);
      setEndDate(existingBinding.endDate || null);
    } else {
      setSelectedClientId(null);
      setSelectedContractId(null);
      setUnitPrice(null);
      setStartDate(null);
      setEndDate(null);
    }
  }, [existingBinding, space]);
  
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
      setUnitPrice(selectedContract.value);
      setStartDate(selectedContract.contractStart);
      setEndDate(selectedContract.contractEnd);
    }
  }, [selectedContractId, contracts]);
  
  // Handle binding the space
  const handleSave = () => {
    if (!space || !selectedClientId || !selectedContractId) return;
    
    const binding: SpaceBinding = {
      spaceId: space.id,
      clientId: selectedClientId,
      contractId: selectedContractId,
      boundAt: new Date().toISOString(),
      unitPrice,
      startDate,
      endDate
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
