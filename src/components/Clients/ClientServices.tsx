
import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, FileText, Edit, Trash2, AlertCircle } from "lucide-react";
import { ClientService, ServiceType, ServiceStatus } from "@/types";

interface ClientServicesProps {
  services: ClientService[];
  onAddService?: () => void;
  onEditService?: (service: ClientService) => void;
  onDeleteService?: (serviceId: string) => void;
}

export function ClientServices({ 
  services, 
  onAddService, 
  onEditService, 
  onDeleteService 
}: ClientServicesProps) {
  const [expandedServiceId, setExpandedServiceId] = useState<string | null>(null);

  const getServiceTypeName = (type: ServiceType): string => {
    switch (type) {
      case "sala_privativa": return "Sala Privativa";
      case "estacao": return "Estação";
      case "endereco_fiscal": return "Endereço Fiscal";
      case "sala_reuniao": return "Sala de Reunião";
      default: return "Desconhecido";
    }
  };

  const getStatusBadge = (status: ServiceStatus) => {
    switch (status) {
      case "ativo":
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Ativo</Badge>;
      case "em_renovacao":
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Em Renovação</Badge>;
      case "cancelado":
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Cancelado</Badge>;
      default:
        return <Badge variant="outline">Desconhecido</Badge>;
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { 
      style: 'currency', 
      currency: 'BRL' 
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR').format(date);
  };

  const toggleExpandService = (serviceId: string) => {
    setExpandedServiceId(expandedServiceId === serviceId ? null : serviceId);
  };

  // Check if any service is close to expiration (within 30 days)
  const isCloseToExpiration = (endDate: string) => {
    const end = new Date(endDate);
    const today = new Date();
    const daysRemaining = Math.ceil((end.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return daysRemaining <= 30 && daysRemaining >= 0;
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Serviços Contratados</h3>
        {onAddService && (
          <Button size="sm" onClick={onAddService}>
            <Plus className="h-4 w-4 mr-1" /> Adicionar Serviço
          </Button>
        )}
      </div>

      {services.length > 0 ? (
        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tipo</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead>Localização</TableHead>
                <TableHead>Período</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {services.map((service) => (
                <TableRow 
                  key={service.id}
                  className={expandedServiceId === service.id ? "bg-gray-50" : ""}
                >
                  <TableCell>{getServiceTypeName(service.type)}</TableCell>
                  <TableCell>{service.description}</TableCell>
                  <TableCell>{service.locationId}</TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="text-xs text-gray-500">Início: {formatDate(service.contractStart)}</span>
                      <div className="flex items-center">
                        <span className="text-xs text-gray-500">Fim: {formatDate(service.contractEnd)}</span>
                        {isCloseToExpiration(service.contractEnd) && (
                          <AlertCircle className="h-4 w-4 ml-1 text-amber-500" />
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span>{formatCurrency(service.value)}</span>
                      <span className="text-xs text-gray-500">
                        {service.billingCycle === "mensal" ? "Mensal" : "Anual"}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(service.status)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => toggleExpandService(service.id)}>
                        <FileText className="h-4 w-4" />
                      </Button>
                      {onEditService && (
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onEditService(service)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                      )}
                      {onDeleteService && (
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onDeleteService(service.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="text-center p-8 border rounded-md bg-gray-50">
          <p className="text-gray-500">Nenhum serviço contratado</p>
          {onAddService && (
            <Button variant="outline" className="mt-4" onClick={onAddService}>
              <Plus className="h-4 w-4 mr-2" /> Adicionar Serviço
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
