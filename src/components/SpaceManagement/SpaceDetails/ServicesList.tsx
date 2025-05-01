
import React from "react";
import { ClientService } from "@/types";

interface ServicesListProps {
  clientServices: ClientService[];
}

export function ServicesList({ clientServices }: ServicesListProps) {
  if (clientServices.length === 0) return null;
  
  return (
    <div className="border-t pt-4">
      <h3 className="text-sm font-medium mb-2">Serviços Associados</h3>
      <div className="space-y-2">
        {clientServices.map(service => (
          <div key={service.id} className="border rounded-md p-3">
            <div className="font-medium">{service.description}</div>
            <div className="text-sm">
              <span className="text-gray-600">Valor:</span> R$ {service.value.toFixed(2)}
            </div>
            <div className="text-sm">
              <span className="text-gray-600">Período:</span> {new Date(service.contractStart).toLocaleDateString()} a {new Date(service.contractEnd).toLocaleDateString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
