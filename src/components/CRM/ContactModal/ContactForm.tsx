
import React from "react";
import { DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { BasicInfoFields } from "./fields/BasicInfoFields";
import { CompanyFields } from "./fields/CompanyFields";
import { DateAndServiceFields } from "./fields/DateAndServiceFields";
import { SourceFields } from "./fields/SourceFields";
import { FormErrorSummary } from "./FormErrorSummary";
import { useContactForm } from "./hooks";
import { ContactModalValues } from "@/schemas/contactFormSchemas";
import { Loader } from "lucide-react";

interface ContactFormProps {
  onSubmit: (data: ContactModalValues) => Promise<void>;
  isSubmitting: boolean;
}

export function ContactForm({ onSubmit, isSubmitting }: ContactFormProps) {
  const { 
    form, 
    handlePhoneChange, 
    handleIdNumberChange 
  } = useContactForm({ 
    onSuccess: () => {} // We'll use the parent's onSubmit instead
  });

  // Use the form from the hook but the submission handler from props
  // to ensure data is saved correctly
  const handleFormSubmit = form.handleSubmit(async (data) => {
    console.log("ContactForm - Form submitted with data:", data);
    await onSubmit(data);
  });
  
  return (
    <Form {...form}>
      <form onSubmit={handleFormSubmit} className="space-y-4">
        <BasicInfoFields 
          form={form} 
          onPhoneChange={handlePhoneChange} 
        />
        <CompanyFields 
          form={form}
          onIdNumberChange={handleIdNumberChange}
        />
        <DateAndServiceFields form={form} />
        <SourceFields form={form} />
        
        <FormErrorSummary />
        
        <DialogFooter>
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => form.reset()}
            disabled={isSubmitting}
          >
            Cancelar
          </Button>
          <Button 
            type="submit" 
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader className="mr-2 h-4 w-4 animate-spin" />
                Salvando...
              </>
            ) : "Salvar"}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}
