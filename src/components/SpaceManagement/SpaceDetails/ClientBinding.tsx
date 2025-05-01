
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Client, SpaceBinding } from "@/types";

interface ClientBindingProps {
  client: Client | null;
  binding: SpaceBinding | null;
  isEditing: boolean;
  unitPrice: string;
  setUnitPrice: (value: string) => void;
  startDate: string;
  setStartDate: (value: string) => void;
  endDate: string;
  setEndDate: (value: string) => void;
}

export function ClientBinding({ 
  client, 
  binding, 
  isEditing, 
  unitPrice, 
  setUnitPrice,
  startDate,
  setStartDate,
  endDate,
  setEndDate
}: ClientBindingProps) {
  
  // Format date for display
  const formatLocalDate = (dateString?: string) => {
    if (!dateString) return "";
    try {
      return new Date(dateString).toLocaleDateString();
    } catch (e) {
      return dateString;
    }
  };
  
  if (!client || !binding) return null;
  
  return (
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
  );
}
