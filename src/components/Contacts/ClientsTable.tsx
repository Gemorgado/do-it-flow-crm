
import React from "react";
import { Client } from "@/types/client";
import { ClientRow } from "./ClientRow";

interface ClientsTableProps {
  clients: Client[];
  onEditClient: (client: Client) => void;
}

export function ClientsTable({ clients, onEditClient }: ClientsTableProps) {
  return (
    <div className="bg-white rounded-md border shadow">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b bg-gray-50">
              <th className="p-3 text-left font-medium text-gray-500 text-sm">Nome</th>
              <th className="p-3 text-left font-medium text-gray-500 text-sm">Empresa</th>
              <th className="p-3 text-left font-medium text-gray-500 text-sm">Plano</th>
              <th className="p-3 text-left font-medium text-gray-500 text-sm">Contato</th>
              <th className="p-3 text-left font-medium text-gray-500 text-sm">Status</th>
              <th className="p-3 text-left font-medium text-gray-500 text-sm">Valor</th>
              <th className="p-3 text-center font-medium text-gray-500 text-sm">Ações</th>
            </tr>
          </thead>
          <tbody>
            {clients.map((client) => (
              <ClientRow 
                key={client.id} 
                client={client} 
                onEdit={() => onEditClient(client)}
              />
            ))}
          </tbody>
        </table>
      </div>
      
      {clients.length === 0 && (
        <div className="p-8 text-center">
          <p className="text-gray-500">Nenhum cliente encontrado</p>
        </div>
      )}
    </div>
  );
}
