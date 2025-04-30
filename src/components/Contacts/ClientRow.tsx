
import React from "react";
import { Button } from "@/components/ui/button";
import { Client, ServiceType } from "@/types/client";
import { FileText, MessageSquare, MoreHorizontal, Mail, Phone, Building, Briefcase, MapPin, Calendar, Edit } from "lucide-react";

interface ClientRowProps {
  client: Client;
  onEdit: () => void;
}

export function ClientRow({ client, onEdit }: ClientRowProps) {
  function getStatusColor(status: Client["status"]): string {
    switch (status) {
      case "ativo": return "bg-green-100 text-green-800";
      case "inativo": return "bg-gray-100 text-gray-800";
      case "inadimplente": return "bg-red-100 text-red-800";
      case "cancelado": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  }

  function formatValue(value?: number): string {
    if (value === undefined) return "-";
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }

  function formatDate(dateString?: string): string {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR').format(date);
  }

  const getServiceTypeName = (type?: ServiceType): string => {
    if (!type) return "-";
    switch (type) {
      case "sala_privativa": return "Sala Privativa";
      case "estacao": return "Estação";
      case "endereco_fiscal": return "Endereço Fiscal";
      case "sala_reuniao": return "Sala de Reunião";
      default: return "-";
    }
  };

  const activeStatus = client.isActive === false ? "inativo" : client.status;

  return (
    <tr className="border-b hover:bg-gray-50">
      <td className="p-3">
        <div className="font-medium">{client.name}</div>
      </td>
      <td className="p-3">
        <div className="text-sm text-gray-700">{client.company || "-"}</div>
      </td>
      <td className="p-3">
        <div className="text-sm text-gray-700">{getServiceTypeName(client.plan)}</div>
      </td>
      <td className="p-3">
        <div className="flex flex-col gap-1">
          <div className="text-sm text-gray-700 flex items-center gap-1">
            <Mail className="h-3 w-3" /> {client.email || "-"}
          </div>
          <div className="text-sm text-gray-700 flex items-center gap-1">
            <Phone className="h-3 w-3" /> {client.phone || "-"}
          </div>
        </div>
      </td>
      <td className="p-3">
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(activeStatus)}`}>
          {client.isActive === false ? "Inativo" : activeStatus.charAt(0).toUpperCase() + activeStatus.slice(1)}
        </span>
      </td>
      <td className="p-3">
        <div className="text-sm font-medium">{formatValue(client.contractValue)}</div>
        <div className="text-xs text-gray-500">
          {client.contractStart && client.contractEnd ? 
            `${formatDate(client.contractStart)} - ${formatDate(client.contractEnd)}` : "-"}
        </div>
      </td>
      <td className="p-3">
        <div className="flex justify-center space-x-1">
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onEdit}>
            <Edit className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <FileText className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <MessageSquare className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </td>
    </tr>
  );
}
