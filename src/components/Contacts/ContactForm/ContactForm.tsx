
import React, { useState } from "react";
import { useContactForm } from "./useContactForm";
import { ContactFormFields } from "./ContactFormFields";
import { ContactFormFooter } from "./ContactFormFooter";
import { Form } from "@/components/ui/form";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface ContactFormProps {
  type: "lead" | "client";
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function ContactForm({ type, onSuccess, onCancel }: ContactFormProps) {
  const { form, handleSubmit } = useContactForm(type, onSuccess);
  const [showErrors, setShowErrors] = useState(false);
  
  const onSubmit = (e: React.FormEvent) => {
    setShowErrors(true);
    return form.handleSubmit(handleSubmit)(e);
  };
  
  // Get all errors from the form
  const formErrors = Object.keys(form.formState.errors);
  const hasErrors = formErrors.length > 0;
  
  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className="space-y-4">
        <ContactFormFields type={type} form={form} />
        
        {showErrors && hasErrors && (
          <Alert variant="destructive" className="mt-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <p className="font-medium">Por favor corrija os seguintes erros:</p>
              <ul className="list-disc pl-5 mt-2 space-y-1 text-sm">
                {formErrors.map((fieldName) => (
                  <li key={fieldName}>
                    {form.formState.errors[fieldName]?.message?.toString()}
                  </li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        )}
        
        <ContactFormFooter type={type} onCancel={onCancel} />
      </form>
    </Form>
  );
}
