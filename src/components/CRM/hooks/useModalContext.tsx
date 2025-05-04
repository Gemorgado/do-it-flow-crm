
import React, { createContext, useContext, useState, ReactNode } from "react";
import { Lead, PipelineStage } from "@/types";
import { ContactFormValues } from "@/types/crm";

// Lead Modal Context
interface LeadModalState {
  isOpen: boolean;
  options?: {
    presetStage?: PipelineStage;
    leadToEdit?: Lead;
  };
}

interface LeadModalContextType {
  isOpen: boolean;
  options?: LeadModalState["options"];
  open: (options?: LeadModalState["options"]) => void;
  close: () => void;
}

const LeadModalContext = createContext<LeadModalContextType | undefined>(undefined);

export const LeadModalProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<LeadModalState>({ isOpen: false });

  const open = (options?: LeadModalState["options"]) => {
    setState({ isOpen: true, options });
  };

  const close = () => {
    setState({ isOpen: false });
  };

  return (
    <LeadModalContext.Provider value={{ isOpen: state.isOpen, options: state.options, open, close }}>
      {children}
    </LeadModalContext.Provider>
  );
};

export const useLeadModal = () => {
  const context = useContext(LeadModalContext);
  if (!context) {
    throw new Error("useLeadModal must be used within a LeadModalProvider");
  }
  return context;
};

// Contact Modal Context
interface ContactModalState {
  isOpen: boolean;
}

interface ContactModalContextType {
  isOpen: boolean;
  open: () => void;
  close: () => void;
}

const ContactModalContext = createContext<ContactModalContextType | undefined>(undefined);

export const ContactModalProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<ContactModalState>({ isOpen: false });

  const open = () => {
    setState({ isOpen: true });
  };

  const close = () => {
    setState({ isOpen: false });
  };

  return (
    <ContactModalContext.Provider value={{ isOpen: state.isOpen, open, close }}>
      {children}
    </ContactModalContext.Provider>
  );
};

export const useContactModal = () => {
  const context = useContext(ContactModalContext);
  if (!context) {
    throw new Error("useContactModal must be used within a ContactModalProvider");
  }
  return context;
};
