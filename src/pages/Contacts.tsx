
import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ContactsHeader } from "@/components/Contacts/ContactsHeader";
import { ContactsSearch } from "@/components/Contacts/ContactsSearch";
import { LeadsTable } from "@/components/Contacts/LeadsTable";
import { ClientsTable } from "@/components/Contacts/ClientsTable";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import { useLeadModal, useContactModal } from "@/components/CRM/hooks/useModalContext";
import { useCustomers } from "@/hooks/conexaData";
import { Client } from "@/types/client";
import { ClientModal } from "@/components/Contacts/ClientModal";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { queryClient } from "@/lib/queryClient";
import { resetDemoData } from "@/utils/resetDemoData";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/modules/auth/AuthProvider";

export default function Contacts() {
  
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("leads");
  const [clientModalOpen, setClientModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [showOnlyActive, setShowOnlyActive] = useState(true);
  const [leads, setLeads] = useState([]);
  const [isResetting, setIsResetting] = useState(false);
  const { user } = useAuth();
  
  const leadModal = useLeadModal();
  const contactModal = useContactModal();
  
  // Get imported customers from Conexa snapshot
  const conexaCustomers = useCustomers();
  
  // Load leads from localStorage or fallback to empty array
  useEffect(() => {
    // Try to get leads from localStorage
    const storedLeads = localStorage.getItem('leads');
    
    if (storedLeads) {
      try {
        setLeads(JSON.parse(storedLeads));
      } catch (e) {
        console.error("Failed to parse leads from localStorage:", e);
        setLeads([]);
      }
    } else {
      // If leads are not in localStorage, set empty array
      setLeads([]);
    }
  }, []);
  
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
    lead.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
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
  
  const handleResetContacts = async () => {
    if (confirm('Tem certeza que deseja zerar todos os dados de Contatos? Esta ação não pode ser desfeita.')) {
      setIsResetting(true);
      try {
        await resetDemoData();
        toast({
          title: "Contatos zerados",
          description: "Todos os dados de contatos foram removidos com sucesso",
        });
        // Forçar refresh da página para garantir que todos os componentes sejam recarregados
        window.location.reload();
      } catch (error) {
        console.error("Erro ao zerar contatos:", error);
        toast({
          title: "Erro ao zerar contatos",
          description: "Não foi possível zerar os dados. Tente novamente.",
          variant: "destructive",
        });
      } finally {
        setIsResetting(false);
      }
    }
  };

  // Function to force a refresh of data
  const refreshData = () => {
    // Fix: Use the correct invalidateQueries syntax with queryKey as an object property
    queryClient.invalidateQueries({ queryKey: ['leads'] });
    queryClient.invalidateQueries({ queryKey: ['clients'] });
    
    // Re-fetch leads from localStorage
    const storedLeads = localStorage.getItem('leads');
    if (storedLeads) {
      try {
        setLeads(JSON.parse(storedLeads));
      } catch (e) {
        console.error("Failed to parse leads from localStorage:", e);
        setLeads([]);
      }
    } else {
      setLeads([]);
    }
  };

  // Add effect to listen for storage events (in case data is cleared in another tab)
  useEffect(() => {
    const handleStorageChange = () => {
      refreshData();
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex justify-between items-start">
        <ContactsHeader onNewContact={handleNewContact} />
        
        {user?.viewAllProposals && (
          <Button 
            variant="destructive" 
            size="sm"
            onClick={handleResetContacts}
            disabled={isResetting}
            className="flex items-center gap-2"
          >
            <Trash2 className="h-4 w-4" />
            {isResetting ? "Zerando..." : "Zerar Contatos"}
          </Button>
        )}
      </div>
      
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
