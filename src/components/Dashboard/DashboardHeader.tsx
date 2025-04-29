
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { trackCustomMetaPixelEvent } from "@/utils/metaPixelUtils";
import { useLeadModal } from "@/components/CRM/hooks/useModalContext";

export function DashboardHeader() {
  const { open } = useLeadModal();

  const handleNewLeadClick = () => {
    // Rastrear evento de clique no botão "Novo Lead"
    trackCustomMetaPixelEvent("new_lead_button_click", {
      location: "dashboard_header",
      timestamp: new Date().toISOString()
    });
    
    // Abrir o modal de novo lead
    open();
  };

  return (
    <div className="flex flex-col md:flex-row justify-between mb-6 gap-4">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-gray-500">Acompanhe os principais indicadores do seu negócio</p>
      </div>
      <Button 
        size="sm" 
        className="bg-doIt-primary hover:bg-doIt-dark"
        onClick={handleNewLeadClick}
      >
        <Plus className="mr-2 h-4 w-4" /> Novo Lead
      </Button>
    </div>
  );
}
