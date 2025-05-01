
import React from "react";
import { DialogDescription } from "@/components/ui/dialog";
import { useClients } from "@/hooks/useClients";
import { Location, SpaceBinding } from "@/types";
import { SpaceBinderClient } from "./SpaceBinderClient";
import { SpaceBinderContractDetails } from "./SpaceBinderContractDetails";
import { SpaceBinderActions } from "./SpaceBinderActions";
import { SpaceInfo } from "./SpaceInfo";
import { Loader2 } from "lucide-react";
import { UseMutationResult } from "@tanstack/react-query";

interface SpaceBinderModalContentProps {
  space: Location;
  selectedClientId: string | null;
  setSelectedClientId: (id: string | null) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  contractId: string | null;
  unitPrice: number | null;
  startDate: string | null;
  endDate: string | null;
  existingBinding: SpaceBinding | null;
  isLoadingContract: boolean;
  activeContract: any;
  onClose: () => void;
  handleSave: () => void;
  handleUnbind: () => void;
  bindSpace: UseMutationResult<any, Error, SpaceBinding>;
  unbindSpace: UseMutationResult<any, Error, string>;
  canSave: boolean;
}

export function SpaceBinderModalContent({
  space,
  selectedClientId,
  setSelectedClientId,
  searchQuery,
  setSearchQuery,
  contractId,
  unitPrice,
  startDate,
  endDate,
  existingBinding,
  isLoadingContract,
  activeContract,
  onClose,
  handleSave,
  handleUnbind,
  bindSpace,
  unbindSpace,
  canSave
}: SpaceBinderModalContentProps) {
  const { data: clientsList = [] } = useClients();
  
  // Filter clients by search query
  const filteredClients = clientsList.filter(client => 
    client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (client.company && client.company.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-4">
      <DialogDescription>
        {existingBinding ? "Edite os detalhes da vinculação" : "Atribua este espaço a um cliente"}
      </DialogDescription>
      
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
      
      <SpaceBinderActions
        existingBinding={existingBinding}
        onClose={onClose}
        handleSave={handleSave}
        handleUnbind={handleUnbind}
        bindSpace={bindSpace}
        unbindSpace={unbindSpace}
        canSave={canSave}
      />
    </div>
  );
}
