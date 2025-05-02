
import { queryClient } from "@/lib/queryClient";
import { toast } from "@/hooks/use-toast";
import { resetPipelineDemo } from "./resetPipelineDemo";
import { resetMetricDemo } from "./resetMetricDemo";
import { store } from "@/integrations/persistence/store";

/**
 * Remove dados de demonstração do storage local e, se houver,
 * chama endpoint backend para limpar coleção/DB.
 */
export async function resetAllDemoData() {
  /* 1. Pipeline demo data - chama função específica ---------- */
  // Usa a função já existente para manter compatibilidade
  await resetPipelineDemo();

  /* 1.1 Metrics demo data - chama função específica --------- */
  // Limpa todas as métricas
  resetMetricDemo();

  /* 2. Chaves conhecidas no LocalStorage / IndexedDB --------- */
  const storagesToRemove = [
    // CRM e Pipeline
    "leads", "clients", "contracts", "proposals", "pipeline_stages", 
    // Mockups e variações de nomes
    "mockClients", "mockContacts", "mockProposals", "mockLeads",
    "customers", "clients_data", "crm_data", "contracts_data",
    // Espaços e integrações
    "conexa_snapshot", "spaceBindings", "space_bindings", "import_templates",
    // Integrations
    "integrations",
    // Growth e dados de marketing
    "growth_data", "campaigns", "marketing_data", "leads_time_data",
    // Dashboard e relatórios
    "dashboard_data", "dashboard_stats", "reports_data", "charts_data",
    // Store do DoitFlow
    "doitflow_leads", "doitflow_clients", "doitflow_tasks", "doitflow_interactions",
    "doitflow_locations", "doitflow_bindings", "doitflow_snapshots",
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
  // Limpa o cache do React Query incluindo queries específicas
  queryClient.clear();
  
  // Invalida explicitamente as queries que podem estar carregando dados de dashboard e relatórios
  queryClient.invalidateQueries({ queryKey: ['dashboardStats'] });
  queryClient.invalidateQueries({ queryKey: ['charts'] });
  queryClient.invalidateQueries({ queryKey: ['reports'] });
  queryClient.invalidateQueries({ queryKey: ['growth'] });
  queryClient.invalidateQueries({ queryKey: ['marketing'] });
  queryClient.invalidateQueries({ queryKey: ['integrations'] });
  
  console.log("✓ Cache React Query limpo");
  
  // Limpa também o store - para garantir que os dados fictícios sejam removidos
  try {
    // Limpa o store importado diretamente
    store.leads = [];
    store.clients = [];
    store.tasks = [];
    store.interactions = [];
    store.locations = [];
    store.bindings = [];
    store.snapshots = [];
    console.log("✓ Store do aplicativo limpo");
  } catch (error) {
    console.warn("× Não foi possível limpar o store do aplicativo", error);
  }
  
  // Útil para debugging
  console.log("resetAllDemoData concluído com sucesso");
  
  return true; // Sinaliza sucesso
}
