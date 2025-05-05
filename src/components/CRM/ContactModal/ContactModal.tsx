
import React, { useState } from "react";
import { useContactModal } from "../hooks/useModalContext";
import { ContactModalValues } from "@/schemas/contactFormSchemas";
import { ModalWrapper } from "./ModalWrapper";
import { ContactForm } from "./ContactForm";
import { toast } from "sonner";
import { contactPersistence } from "@/integrations/persistence/contactPersistence";
import { persistence } from "@/integrations/persistence";
import { v4 as uuidv4 } from "uuid";
import { pipelineStages } from "@/data/leadsData";
import { Lead } from "@/types";

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
      
      // First, persist the contact data
      const contactData = await contactPersistence.createContact(data);
      
      // Create a lead from the contact data
      const newLead: Lead = {
        id: uuidv4(),
        name: data.contactName,
        company: data.companyOrPerson || "",
        email: data.email,
        phone: data.phone || "",
        status: "novo",
        source: mapSourceCategoryToLeadSource(data.sourceCategory),
        sourceDetail: data.sourceDetail || "",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        stage: pipelineStages[0], // Add to first stage
        notes: data.interestService || ""
      };
      
      // Also create a lead in the pipeline
      await persistence.createLead(newLead);
      
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
  
  // Helper function to map source category to lead source
  function mapSourceCategoryToLeadSource(sourceCategory: "indicacao" | "rede_social" | "outro") {
    switch (sourceCategory) {
      case "indicacao":
        return "indicacao";
      case "rede_social":
        return "instagram"; 
      case "outro":
      default:
        return "outros";
    }
  }

  return (
    <ModalWrapper isOpen={isOpen} onClose={close} title="Novo Contato">
      <ContactForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
    </ModalWrapper>
  );
}
