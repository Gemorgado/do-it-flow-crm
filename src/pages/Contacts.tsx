
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { leads, clients } from "@/data/mockData";
import { ContactsHeader } from "@/components/Contacts/ContactsHeader";
import { ContactsSearch } from "@/components/Contacts/ContactsSearch";
import { LeadsTable } from "@/components/Contacts/LeadsTable";
import { ClientsTable } from "@/components/Contacts/ClientsTable";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { NewContactDrawer } from "@/components/Contacts/NewContactDrawer";

export default function Contacts() {
  const [searchTerm, setSearchTerm] = useState("");
  const [showNewContact, setShowNewContact] = useState(false);
  const [contactType, setContactType] = useState<"lead" | "client">("lead");
  const [activeTab, setActiveTab] = useState("leads");
  
  // Simple filtering by name, email, or company
  const filteredLeads = leads.filter(lead => 
    lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (lead.company && lead.company.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  
  const filteredClients = clients.filter(client => 
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.company.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleNewContact = () => {
    setContactType("lead");
    setShowNewContact(true);
  };

  const handleNewClient = () => {
    setContactType("client");
    setShowNewContact(true);
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
            <Button 
              size="sm" 
              className="bg-doIt-primary hover:bg-doIt-dark"
              onClick={handleNewClient}
            >
              <Plus className="mr-2 h-4 w-4" /> Novo Cliente
            </Button>
          )}
        </div>
        
        <TabsContent value="leads" className="mt-0">
          <LeadsTable leads={filteredLeads} />
        </TabsContent>
        
        <TabsContent value="clients" className="mt-0">
          <ClientsTable clients={filteredClients} />
        </TabsContent>
      </Tabs>

      <NewContactDrawer 
        isOpen={showNewContact}
        onClose={() => setShowNewContact(false)}
        type={contactType}
      />
    </div>
  );
}
