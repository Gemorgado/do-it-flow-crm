
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LeadsTable } from "@/components/Contacts/LeadsTable";
import { ClientsTable } from "@/components/Contacts/ClientsTable";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Client } from "@/types/client";

interface ContactsTabsProps {
  activeTab: string;
  setActiveTab: (value: string) => void;
  filteredLeads: any[];
  filteredClients: Client[];
  showOnlyActive: boolean;
  setShowOnlyActive: (value: boolean) => void;
  onNewClient: () => void;
  onEditClient: (client: Client) => void;
  isLoading?: boolean;
}

export function ContactsTabs({
  activeTab,
  setActiveTab,
  filteredLeads,
  filteredClients,
  showOnlyActive,
  setShowOnlyActive,
  onNewClient,
  onEditClient,
  isLoading = false
}: ContactsTabsProps) {
  return (
    <Tabs 
      defaultValue="leads" 
      className="w-full"
      value={activeTab}
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
              onClick={onNewClient}
            >
              <Plus className="mr-2 h-4 w-4" /> Novo Cliente
            </Button>
          </div>
        )}
      </div>
      
      <TabsContent value="leads" className="mt-0">
        <LeadsTable leads={filteredLeads} isLoading={isLoading} />
      </TabsContent>
      
      <TabsContent value="clients" className="mt-0">
        <ClientsTable 
          clients={filteredClients} 
          onEditClient={onEditClient} 
        />
      </TabsContent>
    </Tabs>
  );
}
