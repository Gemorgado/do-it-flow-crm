
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "@/hooks/use-toast";

// Schema definition
const contactFormSchema = z.object({
  name: z.string().min(2, {
    message: "O nome precisa ter pelo menos 2 caracteres.",
  }),
  company: z.string().optional(),
  email: z.string().email({
    message: "Por favor insira um e-mail válido.",
  }),
  phone: z.string().min(8, {
    message: "Insira um número de telefone válido.",
  }),
  status: z.string(),
  source: z.string(),
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

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
  });
  
  const isLead = type === "lead";
  
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
  
  return { form, handleSubmit, isLead };
};
