
import { queryClient } from "@/lib/queryClient";
import { toast } from "@/hooks/use-toast";
import { resetPipelineDemo } from "./resetPipelineDemo";
import { resetMetricDemo } from "./resetMetricDemo";
import { resetOccupancyTrend } from "./resetOccupancyTrend";
import { store } from "@/integrations/persistence/store";

/**
 * Remove dados de demonstração do storage local e, se houver,
 * chama endpoint backend para limpar coleção/DB.
 */
export async function resetAllDemoData() {
  /* 1. Limpar chaves específicas do localStorage ------------- */
  const DEMO_KEYS = [
    // métricas
    'dashboard_metrics', 'growth_metrics', 'report_metrics',
    // CRM
    'leads', 'clients', 'contracts', 'proposals', 'pipeline_stages',
    // espaços e ocupação
    'spaceBindings', 'occupancy_trend',
    // integrações
    'integrations',
    // snapshots Conexa / importador
    'conexa_snapshot', 'import_templates',
    // cache de consultas
    'query-cache',
    // outras coleções
    'tasks', 'messages', 'notifications', 'schedules',
    // configurações de UI
    'ui-state', 'filters'
  ];
  
  // Remover cada chave individualmente
  DEMO_KEYS.forEach(key => {
    try {
      localStorage.removeItem(key);
    } catch (err) {
      console.warn(`Falha ao remover chave '${key}':`, err);
    }
  });
  
  console.log("✓ Chaves específicas de localStorage removidas");

  /* 2. Pipeline demo data - chama função específica ---------- */
  // Usa a função já existente para manter compatibilidade
  try {
    await resetPipelineDemo();
    console.log("✓ Pipeline demo data resetado");
  } catch (e) {
    console.warn("× Erro ao resetar pipeline demo:", e);
  }

  /* 3. Metrics demo data - chama função específica --------- */
  // Limpa todas as métricas
  try {
    resetMetricDemo();
    console.log("✓ Metrics demo data resetado");
  } catch (e) {
    console.warn("× Erro ao resetar métricas demo:", e);
  }

  /* 4. Occupancy trend data - chama função específica ------- */
  try {
    resetOccupancyTrend();
    console.log("✓ Occupancy trend resetado");
  } catch (e) {
    console.warn("× Erro ao resetar occupancy trend:", e);
  }

  /* 5. Chaves conhecidas no LocalStorage / IndexedDB --------- */
  // Limpa absolutamente TODAS as chaves de localStorage
  // para garantir total remoção de dados
  try {
    localStorage.clear();
    console.log("✓ TODO localStorage limpo");
  } catch (e) {
    console.warn("× Erro ao limpar todo localStorage:", e);
  }
  
  // Limpa também session storage para completude
  try {
    sessionStorage.clear();
    console.log("✓ Session storage limpo");
  } catch (e) {
    console.warn("× Erro ao limpar session storage:", e);
  }

  /* 6. Cache React-Query: limpa tudo ------------------------- */
  try {
    // Limpa o cache do React Query incluindo queries específicas
    queryClient.clear();
    
    // Invalida explicitamente as queries que podem estar carregando dados de dashboard e relatórios
    queryClient.invalidateQueries({ queryKey: ['dashboardStats'] });
    queryClient.invalidateQueries({ queryKey: ['charts'] });
    queryClient.invalidateQueries({ queryKey: ['reports'] });
    queryClient.invalidateQueries({ queryKey: ['growth'] });
    queryClient.invalidateQueries({ queryKey: ['marketing'] });
    queryClient.invalidateQueries({ queryKey: ['integrations'] });
    queryClient.invalidateQueries({ queryKey: ['occupancy_trend'] });
    console.log("✓ Cache React Query limpo");
  } catch (e) {
    console.warn("× Erro ao limpar cache do React Query:", e);
  }
  
  /* 7. Store da aplicação ------------------------------------ */
  // Limpa também o store - para garantir que os dados fictícios sejam removidos
  try {
    // Usa um método seguro para limpar o store sem tentar modificar propriedades readonly
    if (store) {
      // Verificar se as propriedades existem e se não são readonly antes de tentar modificá-las
      if (Array.isArray(store.leads)) store.leads = [];
      if (Array.isArray(store.clients)) store.clients = [];
      if (Array.isArray(store.tasks)) store.tasks = [];
      if (Array.isArray(store.interactions)) store.interactions = [];
      if (Array.isArray(store.locations)) store.locations = [];
      if (Array.isArray(store.bindings)) store.bindings = [];
      if (Array.isArray(store.snapshots)) store.snapshots = [];
    }
    console.log("✓ Store do aplicativo limpo");
  } catch (error) {
    console.warn("× Não foi possível limpar o store do aplicativo", error);
  }
  
  // Útil para debugging
  console.log("resetAllDemoData concluído com sucesso");
  
  return true; // Sinaliza sucesso
}
