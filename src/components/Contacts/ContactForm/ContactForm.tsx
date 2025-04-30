
import React from "react";
import { useContactForm } from "./useContactForm";
import { ContactFormFields } from "./ContactFormFields";
import { ContactFormFooter } from "./ContactFormFooter";
import { Form } from "@/components/ui/form";

interface ContactFormProps {
  type: "lead" | "client";
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function ContactForm({ type, onSuccess, onCancel }: ContactFormProps) {
  const { form, handleSubmit } = useContactForm(type, onSuccess);
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <ContactFormFields type={type} form={form} />
        <ContactFormFooter type={type} onCancel={onCancel} />
      </form>
    </Form>
  );
}
