
import { useState, useEffect } from "react";
import { Client } from "@/types/client";
import { useCustomers } from "@/hooks/conexaData";

export function useContactsData() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("leads");
  const [clientModalOpen, setClientModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [showOnlyActive, setShowOnlyActive] = useState(true);
  const [leads, setLeads] = useState([]);
  const [isResetting, setIsResetting] = useState(false);
  
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
    filteredLeads,
    filteredClients
  };
}
