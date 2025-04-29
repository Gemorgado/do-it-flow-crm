
import React, { createContext, useContext, useState, ReactNode } from "react";

interface ModalContextType {
  isLeadModalOpen: boolean;
  isContactModalOpen: boolean;
  openLeadModal: () => void;
  closeLeadModal: () => void;
  openContactModal: () => void;
  closeContactModal: () => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

/**
 * Provider para gerenciar o estado dos modais de Lead e Contato
 */
export function ModalProvider({ children }: { children: ReactNode }) {
  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  const openLeadModal = () => setIsLeadModalOpen(true);
  const closeLeadModal = () => setIsLeadModalOpen(false);
  const openContactModal = () => setIsContactModalOpen(true);
  const closeContactModal = () => setIsContactModalOpen(false);

  return (
    <ModalContext.Provider
      value={{
        isLeadModalOpen,
        isContactModalOpen,
        openLeadModal,
        closeLeadModal,
        openContactModal,
        closeContactModal,
      }}
    >
      {children}
    </ModalContext.Provider>
  );
}

/**
 * Hook para acessar o contexto de modais
 * @returns Objeto com estados e métodos para controlar os modais
 */
export function useModalContext() {
  const context = useContext(ModalContext);
  if (context === undefined) {
    throw new Error("useModalContext deve ser usado dentro de um ModalProvider");
  }
  return context;
}

/**
 * Hook para controlar o modal de Lead
 */
export function useLeadModal() {
  const { isLeadModalOpen, openLeadModal, closeLeadModal } = useModalContext();
  return {
    isOpen: isLeadModalOpen,
    open: openLeadModal,
    close: closeLeadModal,
  };
}

/**
 * Hook para controlar o modal de Contato
 */
export function useContactModal() {
  const { isContactModalOpen, openContactModal, closeContactModal } = useModalContext();
  return {
    isOpen: isContactModalOpen,
    open: openContactModal,
    close: closeContactModal,
  };
}
