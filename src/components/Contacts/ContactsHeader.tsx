
import React from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useContactModal } from "@/components/CRM/hooks/useModalContext";

interface ContactsHeaderProps {
  onNewContact?: () => void;
}

export function ContactsHeader({ onNewContact }: ContactsHeaderProps) {
  const { open } = useContactModal();
  
  const handleNewContact = () => {
    open();
    if (onNewContact) onNewContact();
  };

  return (
    <div className="flex flex-col md:flex-row justify-between gap-4">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Leads e Clientes</h1>
        <p className="text-gray-500">Gerencie todos os seus contatos em um só lugar</p>
      </div>
      <Button className="bg-doIt-primary hover:bg-doIt-dark" onClick={handleNewContact}>
        <Plus className="mr-2 h-4 w-4" /> Novo Contato
      </Button>
    </div>
  );
}
