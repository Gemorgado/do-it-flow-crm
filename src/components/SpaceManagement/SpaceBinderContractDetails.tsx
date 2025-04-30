
import React from "react";
import { formatCurrency, formatDate } from "@/utils/formatters";
import { Label } from "@/components/ui/label";

interface SpaceBinderContractDetailsProps {
  selectedContractId: string | null;
  unitPrice: number | null;
  startDate: string | null;
  endDate: string | null;
}

export function SpaceBinderContractDetails({
  selectedContractId,
  unitPrice,
  startDate,
  endDate,
}: SpaceBinderContractDetailsProps) {
  if (!selectedContractId) return null;

  return (
    <div className="bg-gray-50 p-3 border rounded-md">
      <div className="font-medium text-sm mb-2">Detalhes do contrato ativo</div>
      <div className="space-y-2 text-sm">
        <div>
          <Label className="text-xs text-gray-500">Valor Mensal</Label>
          <div className="font-medium">{formatCurrency(unitPrice)}</div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <Label className="text-xs text-gray-500">Início</Label>
            <div>{formatDate(startDate)}</div>
          </div>
          <div>
            <Label className="text-xs text-gray-500">Término</Label>
            <div>{formatDate(endDate)}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
