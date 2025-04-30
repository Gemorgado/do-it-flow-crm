
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { leads } from "@/data/mockData";
import { ContactsHeader } from "@/components/Contacts/ContactsHeader";
import { ContactsSearch } from "@/components/Contacts/ContactsSearch";
import { LeadsTable } from "@/components/Contacts/LeadsTable";
import { ClientsTable } from "@/components/Contacts/ClientsTable";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useLeadModal, useContactModal } from "@/components/CRM/hooks/useModalContext";
import { useCustomers } from "@/hooks/conexaData";
import { Client } from "@/types/client";
import { ClientModal } from "@/components/Contacts/ClientModal";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export default function Contacts() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("leads");
  const [clientModalOpen, setClientModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [showOnlyActive, setShowOnlyActive] = useState(true);
  
  const leadModal = useLeadModal();
  const contactModal = useContactModal();
  
  // Get imported customers from Conexa snapshot
  const conexaCustomers = useCustomers();
  
  // Convert Conexa customers to Client type for display
  const clients: Client[] = conexaCustomers.map(customer => ({
    id: customer.id,
    name: customer.name,
    company: customer.docNumber || "", // Using docNumber as company for now
    email: customer.email || "",
    phone: customer.phone || "",
    services: [],
    status: "ativo", // Default status
    createdAt: customer.updatedAt,
    updatedAt: customer.updatedAt,
    createdBy: "system", // Default created by
    isActive: true // Default active status
  }));
  
  // Simple filtering by name, email, or company
  const filteredLeads = leads.filter(lead => 
    lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (lead.company && lead.company.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  
  // Filter clients by search term and active status if showOnlyActive is true
  const filteredClients = clients.filter(client => 
    (client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.company.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (!showOnlyActive || client.isActive !== false)
  );

  const handleNewContact = () => {
    contactModal.open();
  };

  const handleNewClient = () => {
    setSelectedClient(null);
    setClientModalOpen(true);
  };
  
  const handleEditClient = (client: Client) => {
    setSelectedClient(client);
    setClientModalOpen(true);
  };

  const handleCloseClientModal = () => {
    setClientModalOpen(false);
    setSelectedClient(null);
  };

  return (
    <div className="animate-fade-in space-y-6">
      <ContactsHeader onNewContact={handleNewContact} />
      <ContactsSearch 
        searchTerm={searchTerm} 
        onSearchChange={setSearchTerm} 
      />

      <Tabs 
        defaultValue="leads" 
        className="w-full"
        onValueChange={(value) => setActiveTab(value)}
      >
        <div className="flex justify-between items-center mb-2">
          <TabsList className="mb-2">
            <TabsTrigger value="leads">Leads ({filteredLeads.length})</TabsTrigger>
            <TabsTrigger value="clients">Clientes ({filteredClients.length})</TabsTrigger>
          </TabsList>

          {activeTab === "clients" && (
            <div className="flex items-center gap-4">
              <div className="flex items-center space-x-2">
                <Switch 
                  id="show-active" 
                  checked={showOnlyActive} 
                  onCheckedChange={setShowOnlyActive} 
                />
                <Label htmlFor="show-active">Somente ativos</Label>
              </div>
              <Button 
                size="sm" 
                className="bg-doIt-primary hover:bg-doIt-dark"
                onClick={handleNewClient}
              >
                <Plus className="mr-2 h-4 w-4" /> Novo Cliente
              </Button>
            </div>
          )}
        </div>
        
        <TabsContent value="leads" className="mt-0">
          <LeadsTable leads={filteredLeads} />
        </TabsContent>
        
        <TabsContent value="clients" className="mt-0">
          <ClientsTable 
            clients={filteredClients} 
            onEditClient={handleEditClient} 
          />
        </TabsContent>
      </Tabs>

      <ClientModal 
        isOpen={clientModalOpen}
        onClose={handleCloseClientModal}
        initialData={selectedClient}
      />
    </div>
  );
}
