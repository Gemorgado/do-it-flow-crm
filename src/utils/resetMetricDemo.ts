
import { queryClient } from "@/lib/queryClient";
import { toast } from "@/hooks/use-toast";

/**
 * Reset all dashboard, growth and report metrics.
 * Clears localStorage keys and react-query cache.
 */
export function resetMetricDemo() {
  // 1. Chaves de LocalStorage / IndexedDB relacionadas a métricas
  const metricsStoragesToRemove = [
    // Dashboard metrics
    "dashboard_metrics", "dashboard_stats", "charts_data", "reports_data",
    // Growth metrics
    "growth_metrics", "growth_data", "marketing_data", "leads_time_data", 
    "campaigns", "campaign_metrics",
    // Report metrics
    "report_metrics", "occupancy_metrics", "contract_metrics", "revenue_metrics"
  ];

  // Remove todos os itens de storage relacionados a métricas
  metricsStoragesToRemove.forEach(key => {
    try {
      localStorage.removeItem(key);
      console.log(`✓ Métrica removida do storage: ${key}`);
    } catch (e) {
      console.warn(`× Erro ao remover métrica do storage: ${key}`, e);
    }
  });

  // 2. Invalida todos os caches React-Query relacionados a métricas
  queryClient.invalidateQueries({ queryKey: ["dashboard_metrics"] });
  queryClient.invalidateQueries({ queryKey: ["growth_metrics"] });
  queryClient.invalidateQueries({ queryKey: ["reports"] });
  queryClient.invalidateQueries({ queryKey: ["charts"] });
  
  // Para garantir, limpa todo o cache
  queryClient.clear();
  
  console.log("✓ Métricas e indicadores zerados");

  // Retorna true para confirmar sucesso
  return true;
}
