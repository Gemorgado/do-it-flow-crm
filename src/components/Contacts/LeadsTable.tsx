
import React from "react";
import { Lead } from "@/types";
import { LeadRow } from "./LeadRow";

interface LeadsTableProps {
  leads: Lead[];
}

export function LeadsTable({ leads }: LeadsTableProps) {
  return (
    <div className="bg-white rounded-md border shadow">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b bg-gray-50">
              <th className="p-3 text-left font-medium text-gray-500 text-sm">Nome</th>
              <th className="p-3 text-left font-medium text-gray-500 text-sm">Empresa</th>
              <th className="p-3 text-left font-medium text-gray-500 text-sm">Contato</th>
              <th className="p-3 text-left font-medium text-gray-500 text-sm">Status</th>
              <th className="p-3 text-left font-medium text-gray-500 text-sm">Fonte</th>
              <th className="p-3 text-left font-medium text-gray-500 text-sm">Valor</th>
              <th className="p-3 text-center font-medium text-gray-500 text-sm">Ações</th>
            </tr>
          </thead>
          <tbody>
            {leads.map((lead) => (
              <LeadRow key={lead.id} lead={lead} />
            ))}
          </tbody>
        </table>
      </div>
      
      {leads.length === 0 && (
        <div className="p-8 text-center">
          <p className="text-gray-500">Nenhum lead encontrado</p>
        </div>
      )}
    </div>
  );
}
