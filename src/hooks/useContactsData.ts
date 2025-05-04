
import { useState, useEffect } from "react";
import { Client } from "@/types/client";
import { useCustomers } from "@/hooks/conexaData";
import { leadPersistence } from "@/integrations/persistence/leadPersistence";
import { Lead } from "@/types";

export function useContactsData() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("leads");
  const [clientModalOpen, setClientModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [showOnlyActive, setShowOnlyActive] = useState(true);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isResetting, setIsResetting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // Get imported customers from Conexa snapshot
  const conexaCustomers = useCustomers();
  
  // Load leads from persistence
  useEffect(() => {
    async function loadLeads() {
      try {
        setIsLoading(true);
        const storedLeads = await leadPersistence.listLeads();
        setLeads(storedLeads);
      } catch (e) {
        console.error("Failed to load leads:", e);
        setLeads([]);
      } finally {
        setIsLoading(false);
      }
    }
    
    loadLeads();
  }, [activeTab]);
  
  // Convert Conexa customers to Client type for display
  const clients: Client[] = conexaCustomers.map(customer => ({
    id: customer.id,
    name: customer.name,
    company: customer.docNumber || "", // Using docNumber as company for now
    email: customer.email || "",
    phone: customer.phone || "",
    services: [],
    status: "active", // Default status
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

  return {
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
    leads,
    setLeads,
    isResetting,
    setIsResetting,
    isLoading,
    filteredLeads,
    filteredClients
  };
}
