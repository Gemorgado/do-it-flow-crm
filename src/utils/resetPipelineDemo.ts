
import { queryClient } from "@/lib/queryClient";
import { toast } from "@/hooks/use-toast";

export async function resetPipelineDemo() {
  /* Para MockAdapter / LocalStorage --------------------------- */
  try {
    // Principais chaves relacionadas ao pipeline
    localStorage.removeItem("leads");        // cards do pipeline
    localStorage.removeItem("proposals");    // se pipeline usa propostas
    localStorage.removeItem("pipeline_stages"); // se existir
    
    // Outros potenciais dados relacionados ao pipeline
    localStorage.removeItem("mockLeads");
    localStorage.removeItem("pipeline_data");
    localStorage.removeItem("leads_data");
    localStorage.removeItem("pipeline_config");
    localStorage.removeItem("pipeline_history");

    console.log("Pipeline demo data cleared from localStorage");
  } catch (error) {
    console.error("Error clearing pipeline demo data:", error);
    throw error;
  }

  /* Para backend real (Supabase / Prisma) --------------------- */
  // await api.delete("/admin/pipeline-demo-data");

  /* Invalida cache React Query para refletir imediatamente ---- */
  try {
    queryClient.invalidateQueries({ queryKey: ["pipeline"] });
    queryClient.invalidateQueries({ queryKey: ["pipeline", "leads"] });
    queryClient.invalidateQueries({ queryKey: ["leads"] });
    queryClient.invalidateQueries({ queryKey: ["proposals"] });
    
    console.log('Pipeline query cache invalidated successfully');
  } catch (error) {
    console.error("Error invalidating query cache:", error);
    throw error;
  }
  
  console.log('Pipeline demo data has been cleared successfully');
  return true;
}
