
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
  // Limpa absolutamente TODAS as chaves de localStorage
  // para garantir total remoção de dados
  try {
    localStorage.clear();
    console.log("✓ TODO localStorage limpo");
  } catch (e) {
    console.warn("× Erro ao limpar todo localStorage:", e);
  }
  
  // Limpa também session storage para completude
  sessionStorage.clear();
  console.log("✓ Session storage limpo");

  /* 3. Cache React-Query: limpa tudo ------------------------- */
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
