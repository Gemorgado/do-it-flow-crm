
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Calendar } from "lucide-react";
import { formatCurrency, formatDate } from "@/utils/formatters";

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
  endDate
}: SpaceBinderContractDetailsProps) {
  if (!selectedContractId) return null;
  
  return (
    <div className="space-y-3 pt-2">
      <div>
        <Label htmlFor="unitPrice">Valor mensal</Label>
        <Input
          id="unitPrice"
          value={formatCurrency(unitPrice)}
          readOnly
          disabled
          className="bg-gray-50"
        />
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label htmlFor="startDate">Início</Label>
          <div className="relative">
            <Input
              id="startDate"
              value={formatDate(startDate)}
              readOnly
              disabled
              className="bg-gray-50 pr-8"
            />
            <Calendar className="absolute right-2 top-2.5 h-4 w-4 text-gray-400" />
          </div>
        </div>
        <div>
          <Label htmlFor="endDate">Término</Label>
          <div className="relative">
            <Input
              id="endDate"
              value={formatDate(endDate)}
              readOnly
              disabled
              className="bg-gray-50 pr-8"
            />
            <Calendar className="absolute right-2 top-2.5 h-4 w-4 text-gray-400" />
          </div>
        </div>
      </div>
    </div>
  );
}
