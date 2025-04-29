
import React from "react";
import { ModalProvider } from "./hooks/useModalContext";
import { LeadModal } from "./LeadModal";
import { ContactModal } from "./ContactModal";

/**
 * Provider que contém os modais de CRM e disponibiliza os hooks
 * para uso em qualquer parte da aplicação
 */
export function CRMModalsProvider({ children }: { children: React.ReactNode }) {
  return (
    <ModalProvider>
      {children}
      <LeadModal />
      <ContactModal />
    </ModalProvider>
  );
}
