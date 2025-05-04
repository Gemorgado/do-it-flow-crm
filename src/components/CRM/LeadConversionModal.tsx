
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Lead, ServiceType } from "@/types";
import { useLeadToClientConversion } from "@/hooks/useLeadToClientConversion";
import { SERVICE_VALUES, SERVICE_DISPLAY_LABELS } from "@/types/service";

interface LeadConversionModalProps {
  lead: Lead | null;
  isOpen: boolean;
  onClose: () => void;
}

export function LeadConversionModal({ lead, isOpen, onClose }: LeadConversionModalProps) {
  const [selectedService, setSelectedService] = useState<ServiceType | "">("");
  const [contractValue, setContractValue] = useState<string>("");
  
  const { convertLeadToClient, isConverting } = useLeadToClientConversion();
  
  const handleConvert = async () => {
    if (!lead) return;
    
    // Convert contract value to number
    const value = contractValue ? parseFloat(contractValue) : undefined;
    
    // Convert lead to client
    await convertLeadToClient(
      lead, 
      selectedService as ServiceType || undefined, 
      value
    );
    
    // Reset form and close modal
    setSelectedService("");
    setContractValue("");
    onClose();
  };
  
  if (!lead) return null;
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Converter Lead em Cliente</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <h3 className="font-medium">Informações do Lead</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm text-gray-500">Nome</Label>
                <p>{lead.name}</p>
              </div>
              <div>
                <Label className="text-sm text-gray-500">Empresa</Label>
                <p>{lead.company || "-"}</p>
              </div>
              <div>
                <Label className="text-sm text-gray-500">Email</Label>
                <p>{lead.email}</p>
              </div>
              <div>
                <Label className="text-sm text-gray-500">Telefone</Label>
                <p>{lead.phone}</p>
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <h3 className="font-medium">Serviço Contratado</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="service-type">Tipo de Serviço</Label>
                  <Select 
                    value={selectedService} 
                    onValueChange={(value) => setSelectedService(value as ServiceType)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o serviço" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Sem serviço</SelectItem>
                      {SERVICE_VALUES.map((service) => (
                        <SelectItem key={service} value={service}>
                          {SERVICE_DISPLAY_LABELS[service]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="contract-value">Valor do Contrato (R$)</Label>
                  <Input
                    id="contract-value"
                    type="number"
                    value={contractValue}
                    onChange={(e) => setContractValue(e.target.value)}
                    placeholder="0,00"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancelar</Button>
          <Button 
            onClick={handleConvert}
            disabled={isConverting}
          >
            {isConverting ? "Convertendo..." : "Converter em Cliente"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
