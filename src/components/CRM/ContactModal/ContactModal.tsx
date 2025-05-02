
import React, { useState } from "react";
import { useContactModal } from "../hooks/useModalContext";
import { ContactModalValues } from "@/schemas/contactFormSchemas";
import { ModalWrapper } from "./ModalWrapper";
import { ContactForm } from "./ContactForm";

/**
 * Modal for creating new contacts
 */
export function ContactModal() {
  const { isOpen, close } = useContactModal();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data: ContactModalValues) => {
    setIsSubmitting(true);
    try {
      // The actual submission logic has been moved to the useContactForm hook
      // We're just calling the form's submit handler here, which in turn calls the hook's submit handler
      await new Promise(resolve => setTimeout(resolve, 500)); // Adding a small delay for UX
      close();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ModalWrapper isOpen={isOpen} onClose={close} title="New Contact">
      <ContactForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
    </ModalWrapper>
  );
}
