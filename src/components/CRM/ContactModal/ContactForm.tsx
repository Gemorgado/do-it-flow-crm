
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
            style={{ backgroundColor: "white", color: "#333", opacity: 1 }}
          >
            Cancelar
          </Button>
          <Button 
            type="submit" 
            disabled={isSubmitting}
            style={{ backgroundColor: "hsl(var(--primary))", color: "white", opacity: 1 }}
          >
            {isSubmitting ? (
              <>
                <span className="opacity-0">Salvar</span>
                <span className="absolute inset-0 flex items-center justify-center">
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </span>
              </>
            ) : "Salvar"}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}
