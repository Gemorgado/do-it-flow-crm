
import React from "react";
import { Button } from "@/components/ui/button";
import { Client, ServiceType } from "@/types";
import { FileText, MessageSquare, MoreHorizontal, Mail, Phone, Building, Briefcase, MapPin, Calendar } from "lucide-react";

interface ClientRowProps {
  client: Client;
}

export function ClientRow({ client }: ClientRowProps) {
  function getStatusColor(status: Client["status"]): string {
    switch (status) {
      case "ativo": return "bg-green-100 text-green-800";
      case "inativo": return "bg-gray-100 text-gray-800";
      case "inadimplente": return "bg-red-100 text-red-800";
      case "cancelado": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  }

  function formatValue(value: number): string {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }

  function formatDate(dateString?: string): string {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR').format(date);
  }

  const getServiceTypeName = (type: ServiceType): string => {
    switch (type) {
      case "sala_privativa": return "Sala Privativa";
      case "estacao": return "Estação";
      case "endereco_fiscal": return "Endereço Fiscal";
      case "sala_reuniao": return "Sala de Reunião";
      default: return "Desconhecido";
    }
  };

  // Calculate total contract value from all services
  const calculateTotalValue = (client: Client): number => {
    if (!client.services || client.services.length === 0) return 0;
    return client.services.reduce((total, service) => {
      return total + service.value;
    }, 0);
  };

  // Count active services
  const activeServicesCount = client.services ? 
    client.services.filter(service => service.status === "ativo").length : 0;

  return (
    <tr className="border-b hover:bg-gray-50">
      <td className="p-3">
        <div className="font-medium">{client.name}</div>
      </td>
      <td className="p-3">
        <div className="text-sm text-gray-700">{client.company}</div>
      </td>
      <td className="p-3">
        <div className="flex flex-col gap-1">
          <div className="text-sm text-gray-700 flex items-center gap-1">
            <Mail className="h-3 w-3" /> {client.email}
          </div>
          <div className="text-sm text-gray-700 flex items-center gap-1">
            <Phone className="h-3 w-3" /> {client.phone}
          </div>
        </div>
      </td>
      <td className="p-3">
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(client.status)}`}>
          {client.status.charAt(0).toUpperCase() + client.status.slice(1)}
        </span>
      </td>
      <td className="p-3">
        {client.services && client.services.length > 0 ? (
          <div className="flex flex-col gap-1">
            <div className="text-sm font-medium">{activeServicesCount} serviço(s) ativo(s)</div>
            {client.services.slice(0, 2).map((service, index) => (
              <div key={index} className="text-xs text-gray-500 flex items-center gap-1">
                {service.type === "sala_privativa" && <Building className="h-3 w-3" />}
                {service.type === "estacao" && <Briefcase className="h-3 w-3" />}
                {service.type === "endereco_fiscal" && <MapPin className="h-3 w-3" />}
                {service.type === "sala_reuniao" && <Calendar className="h-3 w-3" />}
                {service.description} ({formatDate(service.contractEnd)})
              </div>
            ))}
            {client.services.length > 2 && (
              <div className="text-xs text-gray-500">+ {client.services.length - 2} serviços</div>
            )}
          </div>
        ) : (
          <div className="text-sm text-gray-500">Nenhum serviço</div>
        )}
      </td>
      <td className="p-3">
        <div className="text-sm font-medium">{formatValue(calculateTotalValue(client))}</div>
        <div className="text-xs text-gray-500">
          {client.services && client.services.length > 0 && client.services[0].billingCycle === "mensal" ? "Mensal" : "Anual"}
        </div>
      </td>
      <td className="p-3">
        <div className="flex justify-center space-x-1">
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
