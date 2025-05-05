
import React from "react";
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
import { ServiceType } from '@/domain/models/Client';
import { useLeadToClientConversion } from '@/presentation/hooks/useLeadToClientConversion';
import { useLeadConversionStore } from '@/presentation/state/leadConversionStore';

const SERVICE_DISPLAY_LABELS: Record<ServiceType, string> = {
  fiscal_address: 'Endereço Fiscal',
  flex_desk: 'Estação Flex',
  fixed_desk: 'Estação Fixa',
  private_office: 'Sala Privativa',
  meeting_room: 'Sala de Reunião',
  auditorium: 'Auditório',
};

const SERVICE_VALUES = [
  'fiscal_address',
  'flex_desk',
  'fixed_desk',
  'private_office',
  'meeting_room',
  'auditorium',
] as const;

export function LeadConversionModal() {
  const { 
    isOpen,
    selectedLead,
    selectedServiceType, 
    contractValue,
    setIsOpen,
    setSelectedServiceType,
    setContractValue,
    reset
  } = useLeadConversionStore();
  
  const { convertLeadToClient, isConverting } = useLeadToClientConversion();
  
  const handleConvert = async () => {
    if (!selectedLead) return;
    
    // Convert contract value to number
    const value = contractValue ? parseFloat(contractValue) : undefined;
    
    // Convert lead to client
    await convertLeadToClient(
      selectedLead, 
      selectedServiceType as ServiceType || undefined, 
      value
    );
    
    // Reset form and close modal
    reset();
  };
  
  const handleClose = () => {
    setIsOpen(false);
  };
  
  if (!selectedLead) return null;
  
  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
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
                <p>{selectedLead.name}</p>
              </div>
              <div>
                <Label className="text-sm text-gray-500">Empresa</Label>
                <p>{selectedLead.company || "-"}</p>
              </div>
              <div>
                <Label className="text-sm text-gray-500">Email</Label>
                <p>{selectedLead.email}</p>
              </div>
              <div>
                <Label className="text-sm text-gray-500">Telefone</Label>
                <p>{selectedLead.phone}</p>
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
                    value={selectedServiceType} 
                    onValueChange={(value) => setSelectedServiceType(value as ServiceType | '')}
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
          <Button variant="outline" onClick={handleClose}>Cancelar</Button>
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
