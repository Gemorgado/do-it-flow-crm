
import { queryClient } from "@/lib/queryClient";
import { toast } from "sonner";

export async function resetPipelineDemo() {
  /* Para MockAdapter / LocalStorage --------------------------- */
  localStorage.removeItem("leads");        // cards do pipeline
  localStorage.removeItem("proposals");    // se pipeline usa propostas
  localStorage.removeItem("pipeline_stages"); // se existir
  
  // Outros potenciais dados relacionados ao pipeline
  localStorage.removeItem("mockLeads");
  localStorage.removeItem("pipeline_data");

  /* Para backend real (Supabase / Prisma) --------------------- */
  // await api.delete("/admin/pipeline-demo-data");

  /* Invalida cache React Query para refletir imediatamente ---- */
  queryClient.invalidateQueries({ queryKey: ["pipeline"] });
  queryClient.invalidateQueries({ queryKey: ["pipeline", "leads"] });
  queryClient.invalidateQueries({ queryKey: ["leads"] });
  queryClient.invalidateQueries({ queryKey: ["proposals"] });
  
  console.log('Pipeline demo data has been cleared successfully');
}
