
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ClientFormValues, clientFormSchema, defaultValues } from "./schemas";
import { useClientFormEnhancements } from "@/hooks/useClientFormEnhancements";
import { persistence } from "@/integrations/persistence";
import { ServiceType } from "@/constants/serviceOptions";
import { Location } from "@/types";
import { toast } from "@/hooks/use-toast";
import { v4 as uuidv4 } from "uuid";
import { format } from "date-fns";

interface UseClientFormProps {
  onSuccess?: () => void;
  initialData?: any;
}

export function useClientForm({ onSuccess, initialData }: UseClientFormProps) {
  const { planOptions, getAvailableSpaces } = useClientFormEnhancements();
  const [availableSpaces, setAvailableSpaces] = useState<Location[]>([]);

  const form = useForm<ClientFormValues>({
    resolver: zodResolver(clientFormSchema),
    defaultValues: initialData || defaultValues,
  });

  const watchPlan = form.watch("plan");
  
  // Update available spaces when plan changes
  useEffect(() => {
    if (watchPlan === 'sala_privativa' || watchPlan === 'estacao_fixa') {
      const spaces = getAvailableSpaces(watchPlan as ServiceType);
      setAvailableSpaces(spaces);
    } else {
      setAvailableSpaces([]);
    }
  }, [watchPlan, getAvailableSpaces]);

  const handleSubmit = async (data: ClientFormValues) => {
    try {
      // Process the billingEmails string to array
      const billingEmailsArray = data.billingEmails 
        ? data.billingEmails.split(';').map(email => email.trim()).filter(Boolean)
        : [];

      // Format dates as strings
      const formattedData = {
        ...data,
        id: data.id || uuidv4(),
        billingEmails: billingEmailsArray,
        contractStart: data.contractStart ? format(data.contractStart, 'yyyy-MM-dd') : undefined,
        contractEnd: data.contractEnd ? format(data.contractEnd, 'yyyy-MM-dd') : undefined,
        lastReadjustDate: data.lastReadjustDate ? format(data.lastReadjustDate, 'yyyy-MM-dd') : undefined,
        createdBy: initialData?.createdBy || "current-user", // In a real app, this would be the current user
        createdAt: initialData?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        status: data.isActive ? "ativo" : "inativo",
        services: initialData?.services || []
      };

      // Handle space binding if a space was selected
      if (data.selectedSpaceId && (data.plan === 'sala_privativa' || data.plan === 'estacao_fixa')) {
        try {
          // Create a binding between client and space
          await persistence.bindSpace({
            spaceId: data.selectedSpaceId,
            clientId: formattedData.id,
            contractId: uuidv4(),
            boundAt: new Date().toISOString(),
            unitPrice: data.contractValue || null,
            startDate: data.contractStart ? format(data.contractStart, 'yyyy-MM-dd') : null,
            endDate: data.contractEnd ? format(data.contractEnd, 'yyyy-MM-dd') : null,
            notes: `Bound via client creation form on ${new Date().toLocaleDateString()}`
          });
          
          console.log("Space binding created successfully");
        } catch (error) {
          console.error("Error binding space to client:", error);
          // Continue with client creation even if binding fails
        }
      }

      // In a real application, this would make an API call to save the client
      console.log("Client form submitted:", formattedData);
      
      // Show success message
      toast({
        title: `Cliente ${initialData ? 'atualizado' : 'criado'} com sucesso!`,
        description: `${data.name} foi ${initialData ? 'atualizado' : 'adicionado'} à sua lista de clientes.`,
      });
      
      // Reset form and close modal
      if (!initialData) form.reset();
      if (onSuccess) onSuccess();
    } catch (error) {
      toast({
        title: "Erro ao salvar cliente",
        description: "Ocorreu um erro ao processar sua solicitação.",
        variant: "destructive",
      });
    }
  };

  return {
    form,
    planOptions,
    availableSpaces,
    handleSubmit,
    watchPlan
  };
}
