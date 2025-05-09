
import React, { useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ClientService } from "@/types";
import { formatCurrency } from "@/utils/formatters";
import { Loader2 } from "lucide-react";

interface SpaceBinderContractProps {
  selectedClientId: string | null;
  selectedContractId: string | null;
  setSelectedContractId: (id: string | null) => void;
  contracts: ClientService[];
  isLoading?: boolean;
}

export function SpaceBinderContract({
  selectedClientId,
  selectedContractId,
  setSelectedContractId,
  contracts,
  isLoading = false
}: SpaceBinderContractProps) {
  if (!selectedClientId) return null;
  
  const handleContractChange = (value: string) => {
    console.log("Contract selected:", value);
    setSelectedContractId(value);
  };

  // Log when contracts change to help debug
  useEffect(() => {
    if (contracts.length > 0) {
      console.log("Available contracts in dropdown:", contracts);
    } else {
      console.log("No contracts available for dropdown");
    }
  }, [contracts]);

  return (
    <div>
      <Label htmlFor="contract">Contrato</Label>
      <Select
        value={selectedContractId || ""}
        onValueChange={handleContractChange}
        disabled={isLoading || contracts.length === 0}
      >
        <SelectTrigger id="contract" className="w-full bg-white">
          {isLoading ? (
            <div className="flex items-center">
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              <span>Carregando contratos...</span>
            </div>
          ) : (
            <SelectValue placeholder="Selecione o contrato" />
          )}
        </SelectTrigger>
        <SelectContent className="max-h-[200px] z-50 bg-white">
          {contracts.length === 0 ? (
            <SelectItem value="no_contracts_available">
              {isLoading ? "Carregando..." : "Nenhum contrato ativo disponível"}
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
