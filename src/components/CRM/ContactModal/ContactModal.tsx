
import React, { useState } from "react";
import { useContactModal } from "../hooks/useModalContext";
import { ContactModalValues } from "@/schemas/contactFormSchemas";
import { toast } from "sonner";
import { contactPersistence } from "@/integrations/persistence/contactPersistence";
import { ModalWrapper } from "./ModalWrapper";
import { ContactForm } from "./ContactForm";

/**
 * Modal for creating new contacts
 */
export function ContactModal() {
  const { isOpen, close } = useContactModal();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data: ContactModalValues) => {
    console.log("Submitting form data:", data);
    
    try {
      setIsSubmitting(true);
      // Use the local persistence system instead of API
      await contactPersistence.createContact(data);
      
      toast.success("Contact created successfully", {
        description: "The contact has been added to the system"
      });
      
      close();
    } catch (error) {
      console.error("Error in onSubmit:", error);
      toast.error("Error creating contact", {
        description: "An error occurred while processing your request."
      });
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
