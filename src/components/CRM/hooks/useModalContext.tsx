
import React, { createContext, useContext, useState } from "react";
import { PipelineStage } from "@/types";

// Lead Modal Context
interface LeadModalOptions {
  presetStage?: PipelineStage;
}

interface LeadModalContextType {
  isOpen: boolean;
  options?: LeadModalOptions;
  open: (options?: LeadModalOptions) => void;
  close: () => void;
}

const LeadModalContext = createContext<LeadModalContextType | undefined>(undefined);

// Contact Modal Context
interface ContactModalContextType {
  isOpen: boolean;
  open: () => void;
  close: () => void;
}

const ContactModalContext = createContext<ContactModalContextType | undefined>(undefined);

// Provider
export function ModalProvider({ children }: { children: React.ReactNode }) {
  // Lead modal state
  const [leadModalOpen, setLeadModalOpen] = useState(false);
  const [leadModalOptions, setLeadModalOptions] = useState<LeadModalOptions | undefined>(undefined);

  const openLeadModal = (options?: LeadModalOptions) => {
    setLeadModalOptions(options);
    setLeadModalOpen(true);
  };

  const closeLeadModal = () => {
    setLeadModalOpen(false);
    setLeadModalOptions(undefined);
  };

  // Contact modal state
  const [contactModalOpen, setContactModalOpen] = useState(false);

  const openContactModal = () => {
    setContactModalOpen(true);
  };

  const closeContactModal = () => {
    setContactModalOpen(false);
  };

  return (
    <LeadModalContext.Provider value={{ 
      isOpen: leadModalOpen, 
      options: leadModalOptions,
      open: openLeadModal, 
      close: closeLeadModal 
    }}>
      <ContactModalContext.Provider value={{ 
        isOpen: contactModalOpen, 
        open: openContactModal, 
        close: closeContactModal 
      }}>
        {children}
      </ContactModalContext.Provider>
    </LeadModalContext.Provider>
  );
}

// Hooks
export function useLeadModal() {
  const context = useContext(LeadModalContext);
  if (context === undefined) {
    throw new Error("useLeadModal must be used within a ModalProvider");
  }
  return context;
}

export function useContactModal() {
  const context = useContext(ContactModalContext);
  if (context === undefined) {
    throw new Error("useContactModal must be used within a ModalProvider");
  }
  return context;
}
