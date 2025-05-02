
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { ContactModalValues, contactModalSchema } from "@/schemas/contactFormSchemas";
import { toast } from "sonner";
import { contactPersistence } from "@/integrations/persistence/contactPersistence";

interface UseContactFormProps {
  onSuccess?: () => void;
}

export function useContactForm({ onSuccess }: UseContactFormProps = {}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Initialize the form with React Hook Form
  const form = useForm<ContactModalValues>({
    resolver: zodResolver(contactModalSchema),
    defaultValues: {
      contactName: "",
      email: "",
      phone: "",
      companyOrPerson: "",
      idNumber: "",
      entryDate: format(new Date(), "yyyy-MM-dd"),
      interestService: "",
      sourceCategory: "outro",
      sourceDetail: "",
    },
    mode: "onBlur", // Validate fields when they lose focus
  });

  // Phone formatting function
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Format phone number as (00) 00000-0000
    const value = e.target.value.replace(/\D/g, '');
    const formattedValue = value
      .replace(/^(\d{2})(\d)/g, '($1) $2')
      .replace(/(\d)(\d{4})$/, '$1-$2');
    
    form.setValue("phone", formattedValue);
  };

  // Document formatting function for CNPJ/CPF
  const handleIdNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    let formattedValue = value;
    
    // Format as CPF (000.000.000-00)
    if (value.length <= 11) {
      formattedValue = value
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    } 
    // Format as CNPJ (00.000.000/0000-00)
    else {
      formattedValue = value
        .replace(/^(\d{2})(\d)/, '$1.$2')
        .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
        .replace(/\.(\d{3})(\d)/, '.$1/$2')
        .replace(/(\d{4})(\d)/, '$1-$2');
    }
    
    form.setValue("idNumber", formattedValue);
  };

  // Form submission handler
  const handleSubmit = async (data: ContactModalValues) => {
    console.log("Submitting form data:", data);
    
    try {
      setIsSubmitting(true);
      // Use the local persistence system
      await contactPersistence.createContact(data);
      
      toast.success("Contact created successfully", {
        description: "The contact has been added to the system"
      });
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Error in onSubmit:", error);
      toast.error("Error creating contact", {
        description: "An error occurred while processing your request."
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    form,
    isSubmitting,
    handleSubmit: form.handleSubmit(handleSubmit),
    handlePhoneChange,
    handleIdNumberChange,
  };
}
