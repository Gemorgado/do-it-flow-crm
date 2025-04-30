
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ContactFormValues, contactFormSchema } from "@/schemas/contactFormSchemas";
import { toast } from "@/hooks/use-toast";

const defaultValues: Partial<ContactFormValues> = {
  name: "",
  company: "",
  email: "",
  phone: "",
  status: "novo",
  source: "site_organico",
};

export const useContactForm = (type: "lead" | "client", onSuccess?: () => void) => {
  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues,
    mode: "onBlur", // Validate fields when they lose focus for better UX
  });
  
  const isLead = type === "lead";
  
  // Format phone number as user types
  const formatPhoneNumber = (value: string) => {
    // Remove non-numeric characters
    const numericValue = value.replace(/\D/g, '');
    
    // Format as (XX) XXXXX-XXXX
    if (numericValue.length <= 11) {
      let formattedValue = numericValue;
      
      if (numericValue.length > 2) {
        formattedValue = `(${numericValue.slice(0, 2)}) ${numericValue.slice(2)}`;
      }
      
      if (numericValue.length > 7) {
        formattedValue = `(${numericValue.slice(0, 2)}) ${numericValue.slice(2, 7)}-${numericValue.slice(7)}`;
      }
      
      return formattedValue;
    }
    
    return value;
  };
  
  const handleSubmit = (data: ContactFormValues) => {
    try {
      // In a real application, this would make an API call
      console.log("Form submitted:", data);
      
      // Show success message
      toast({
        title: `${isLead ? 'Lead' : 'Cliente'} criado com sucesso!`,
        description: `${data.name} foi adicionado à sua lista de ${isLead ? 'leads' : 'clientes'}.`,
      });
      
      // Reset form and close modal
      form.reset();
      if (onSuccess) onSuccess();
    } catch (error) {
      toast({
        title: "Erro ao criar contato",
        description: "Ocorreu um erro ao processar sua solicitação.",
        variant: "destructive",
      });
    }
  };
  
  return { form, handleSubmit, isLead, formatPhoneNumber };
};
