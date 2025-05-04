
import { useState } from "react";
import { Lead, Client, ServiceType } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { v4 as uuidv4 } from "uuid";
import { toast } from "sonner";
import { leadPersistence } from "@/integrations/persistence/leadPersistence";

export function useLeadToClientConversion() {
  const [isConverting, setIsConverting] = useState(false);
  const queryClient = useQueryClient();
  
  // Mutation para converter lead em cliente
  const convertToClientMutation = useMutation({
    mutationFn: async ({ 
      lead, 
      serviceType, 
      contractValue 
    }: { 
      lead: Lead; 
      serviceType?: ServiceType; 
      contractValue?: number 
    }) => {
      try {
        setIsConverting(true);
        
        // 1. Criar um cliente a partir dos dados do lead
        const newClient: Client = {
          id: uuidv4(),
          name: lead.name,
          company: lead.company || "",
          email: lead.email,
          phone: lead.phone,
          services: [],
          status: "ativo",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          isActive: true
        };
        
        // 2. Se houver um tipo de serviço, criar serviço para o cliente
        if (serviceType) {
          const startDate = new Date();
          const endDate = new Date();
          endDate.setFullYear(endDate.getFullYear() + 1); // Contrato de 1 ano por padrão
          
          newClient.services.push({
            id: uuidv4(),
            clientId: newClient.id,
            type: serviceType,
            description: `${serviceType} - Plano Anual`,
            locationId: "pending-assignment",
            contractStart: startDate.toISOString().split('T')[0],
            contractEnd: endDate.toISOString().split('T')[0],
            value: contractValue || 0,
            billingCycle: "mensal",
            status: "ativo",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          });
          
          // Também podemos atualizar os campos específicos do cliente
          if ("plan" in newClient) newClient.plan = serviceType;
          if ("contractValue" in newClient) newClient.contractValue = contractValue;
          if ("contractStart" in newClient) newClient.contractStart = startDate.toISOString().split('T')[0];
          if ("contractEnd" in newClient) newClient.contractEnd = endDate.toISOString().split('T')[0];
        }
        
        // 3. Salvar o novo cliente na persistence layer
        // Simulando uma API call para criar cliente
        console.log("Salvando novo cliente:", newClient);
        
        // 4. Atualizar o lead para marcá-lo como convertido (ou removê-lo)
        await leadPersistence.updateLead({
          ...lead,
          status: "fechado",
          updatedAt: new Date().toISOString(),
        });
        
        // 5. Opcionalmente, remover o lead
        // await leadPersistence.deleteLead(lead.id);
        
        return newClient;
      } catch (error) {
        console.error("Erro ao converter lead em cliente:", error);
        throw error;
      } finally {
        setIsConverting(false);
      }
    },
    onSuccess: () => {
      // Invalidar queries para recarregar os dados
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      queryClient.invalidateQueries({ queryKey: ['pipeline', 'leads'] });
      
      toast.success("Lead convertido com sucesso", {
        description: "O lead foi convertido em cliente"
      });
    },
    onError: (error) => {
      toast.error("Erro ao converter lead", {
        description: error instanceof Error 
          ? error.message 
          : "Não foi possível converter o lead em cliente"
      });
    }
  });

  // Função para converter um lead em cliente
  const convertLeadToClient = (lead: Lead, serviceType?: ServiceType, contractValue?: number) => {
    convertToClientMutation.mutate({ lead, serviceType, contractValue });
  };

  return {
    convertLeadToClient,
    isConverting: isConverting || convertToClientMutation.isPending,
    error: convertToClientMutation.error
  };
}
