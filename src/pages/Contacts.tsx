
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { leads, clients } from "@/data/mockData";
import { ContactsHeader } from "@/components/Contacts/ContactsHeader";
import { ContactsSearch } from "@/components/Contacts/ContactsSearch";
import { LeadsTable } from "@/components/Contacts/LeadsTable";
import { ClientsTable } from "@/components/Contacts/ClientsTable";

export default function Contacts() {
  const [searchTerm, setSearchTerm] = useState("");
  
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
    // Handle new contact creation
    console.log("Creating new contact");
  };

  return (
    <div className="animate-fade-in space-y-6">
      <ContactsHeader onNewContact={handleNewContact} />
      <ContactsSearch 
        searchTerm={searchTerm} 
        onSearchChange={setSearchTerm} 
      />

      <Tabs defaultValue="leads" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="leads">Leads ({filteredLeads.length})</TabsTrigger>
          <TabsTrigger value="clients">Clientes ({filteredClients.length})</TabsTrigger>
        </TabsList>
        
        <TabsContent value="leads" className="mt-0">
          <LeadsTable leads={filteredLeads} />
        </TabsContent>
        
        <TabsContent value="clients" className="mt-0">
          <ClientsTable clients={filteredClients} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
