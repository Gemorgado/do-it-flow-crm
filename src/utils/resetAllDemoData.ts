
import { queryClient } from "@/lib/queryClient";
import { toast } from "@/hooks/use-toast";
import { resetPipelineDemo } from "./resetPipelineDemo";

/**
 * Remove dados de demonstração do storage local e, se houver,
 * chama endpoint backend para limpar coleção/DB.
 */
export async function resetAllDemoData() {
  /* 1. Pipeline demo data - chama função específica ---------- */
  // Usa a função já existente para manter compatibilidade
  await resetPipelineDemo();

  /* 2. Chaves conhecidas no LocalStorage / IndexedDB --------- */
  const storagesToRemove = [
    // CRM e Pipeline
    "leads", "clients", "contracts", "proposals", "pipeline_stages", 
    // Mockups e variações de nomes
    "mockClients", "mockContacts", "mockProposals", "mockLeads",
    "customers", "clients_data", "crm_data", "contracts_data",
    // Espaços e integrações
    "conexa_snapshot", "spaceBindings", "space_bindings", "import_templates",
    // Growth e dados de marketing
    "growth_data", "campaigns", "marketing_data", 
    // Usuários e preferências
    "users", "user_preferences", "preferences"
  ];

  // Remove todos os itens de storage
  storagesToRemove.forEach(key => {
    try {
      localStorage.removeItem(key);
      console.log(`✓ Storage removido: ${key}`);
    } catch (e) {
      console.warn(`× Erro ao remover storage: ${key}`, e);
    }
  });
  
  // Limpa também session storage para completude
  sessionStorage.clear();
  console.log("✓ Session storage limpo");

  /* 3. Backend (opcional) ----------------------------------- */
  // await api.delete("/admin/demo-data");   // habilite quando existir

  /* 4. Cache React-Query: limpa tudo ------------------------- */
  queryClient.clear();
  console.log("✓ Cache React Query limpo");
  
  // Útil para debugging
  console.log("resetAllDemoData concluído com sucesso");
  
  return true; // Sinaliza sucesso
}
