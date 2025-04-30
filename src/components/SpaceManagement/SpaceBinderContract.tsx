
import React from "react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ClientService } from "@/types";
import { formatCurrency } from "@/utils/formatters";

interface SpaceBinderContractProps {
  selectedClientId: string | null;
  selectedContractId: string | null;
  setSelectedContractId: (id: string | null) => void;
  contracts: ClientService[];
}

export function SpaceBinderContract({
  selectedClientId,
  selectedContractId,
  setSelectedContractId,
  contracts
}: SpaceBinderContractProps) {
  if (!selectedClientId) return null;
  
  return (
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
                {contract.description} - {formatCurrency(contract.value)}
              </SelectItem>
            ))
          )}
        </SelectContent>
      </Select>
    </div>
  );
}
