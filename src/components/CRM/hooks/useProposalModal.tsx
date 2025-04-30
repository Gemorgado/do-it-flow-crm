
import React, { createContext, useContext, useState, ReactNode } from "react";
import { ProposalModal } from "@/components/CRM/ProposalModal";

interface ProposalModalContextType {
  isOpen: boolean;
  open: () => void;
  close: () => void;
}

const ProposalModalContext = createContext<ProposalModalContextType | undefined>(undefined);

export function ProposalModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);

  return (
    <ProposalModalContext.Provider value={{ isOpen, open, close }}>
      {children}
      <ProposalModal isOpen={isOpen} onClose={close} />
    </ProposalModalContext.Provider>
  );
}

export function useProposalModal() {
  const context = useContext(ProposalModalContext);
  if (context === undefined) {
    throw new Error("useProposalModal must be used within a ProposalModalProvider");
  }
  return context;
}
