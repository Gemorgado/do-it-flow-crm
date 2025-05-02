
import React, { useState } from "react";
import { useContactModal } from "../hooks/useModalContext";
import { ContactModalValues } from "@/schemas/contactFormSchemas";
import { ModalWrapper } from "./ModalWrapper";
import { ContactForm } from "./ContactForm";
import { toast } from "sonner";
import { contactPersistence } from "@/integrations/persistence/contactPersistence";

/**
 * Modal for creating new contacts
 */
export function ContactModal() {
  const { isOpen, close } = useContactModal();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data: ContactModalValues) => {
    setIsSubmitting(true);
    try {
      console.log("ContactModal - Submitting contact data:", data);
      // Persist the contact data directly from here
      await contactPersistence.createContact(data);
      
      toast.success("Contato criado com sucesso", {
        description: "O contato foi adicionado ao sistema"
      });
      
      close();
    } catch (error) {
      console.error("Erro ao criar contato:", error);
      toast.error("Erro ao criar contato", {
        description: "Ocorreu um erro ao processar sua solicitação."
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ModalWrapper isOpen={isOpen} onClose={close} title="Novo Contato">
      <ContactForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
    </ModalWrapper>
  );
}
