
import { useState } from "react";
import { ContactsHeader } from "@/components/Contacts/ContactsHeader";
import { ContactsSearch } from "@/components/Contacts/ContactsSearch";
import { useLeadModal, useContactModal } from "@/components/CRM/hooks/useModalContext";
import { ClientModal } from "@/components/Contacts/ClientModal";
import { queryClient } from "@/lib/queryClient";
import { ContactsTabs } from "@/components/Contacts/ContactsTabs";
import { ResetContactsButton } from "@/components/Contacts/ResetContactsButton";
import { useContactsData } from "@/hooks/useContactsData";

export default function Contacts() {
  const {
    searchTerm,
    setSearchTerm,
    activeTab,
    setActiveTab,
    clientModalOpen,
    setClientModalOpen,
    selectedClient,
    setSelectedClient,
    showOnlyActive,
    setShowOnlyActive,
    filteredLeads,
    filteredClients,
    isLoading
  } = useContactsData();
  
  const leadModal = useLeadModal();
  const contactModal = useContactModal();

  const handleNewContact = () => {
    contactModal.open();
  };

  const handleNewClient = () => {
    setSelectedClient(null);
    setClientModalOpen(true);
  };
  
  const handleEditClient = (client) => {
    setSelectedClient(client);
    setClientModalOpen(true);
  };

  const handleCloseClientModal = () => {
    setClientModalOpen(false);
    setSelectedClient(null);
  };
  
  // Function to force a refresh of data
  const refreshData = () => {
    // Fix: Use the correct invalidateQueries syntax with queryKey as an object property
    queryClient.invalidateQueries({ queryKey: ['leads'] });
    queryClient.invalidateQueries({ queryKey: ['clients'] });
  };

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex justify-between items-start">
        <ContactsHeader onNewContact={handleNewContact} />
        <ResetContactsButton />
      </div>
      
      <ContactsSearch 
        searchTerm={searchTerm} 
        onSearchChange={setSearchTerm} 
      />

      <ContactsTabs
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        filteredLeads={filteredLeads}
        filteredClients={filteredClients}
        showOnlyActive={showOnlyActive}
        setShowOnlyActive={setShowOnlyActive}
        onNewClient={handleNewClient}
        onEditClient={handleEditClient}
        isLoading={isLoading}
      />

      <ClientModal 
        isOpen={clientModalOpen}
        onClose={handleCloseClientModal}
        initialData={selectedClient}
      />
    </div>
  );
}
