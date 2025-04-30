
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { resetDemoData } from "@/utils/resetDemoData";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/modules/auth/AuthProvider";

export function ResetContactsButton() {
  const [isResetting, setIsResetting] = useState(false);
  const { user } = useAuth();
  
  if (!user?.viewAllProposals) return null;
  
  const handleResetContacts = async () => {
    if (confirm('Tem certeza que deseja zerar todos os dados de Contatos? Esta ação não pode ser desfeita.')) {
      setIsResetting(true);
      try {
        await resetDemoData();
        toast({
          title: "Contatos zerados",
          description: "Todos os dados de contatos foram removidos com sucesso",
        });
        // Forçar refresh da página para garantir que todos os componentes sejam recarregados
        window.location.reload();
      } catch (error) {
        console.error("Erro ao zerar contatos:", error);
        toast({
          title: "Erro ao zerar contatos",
          description: "Não foi possível zerar os dados. Tente novamente.",
          variant: "destructive",
        });
      } finally {
        setIsResetting(false);
      }
    }
  };
  
  return (
    <Button 
      variant="destructive" 
      size="sm"
      onClick={handleResetContacts}
      disabled={isResetting}
      className="flex items-center gap-2"
    >
      <Trash2 className="h-4 w-4" />
      {isResetting ? "Zerando..." : "Zerar Contatos"}
    </Button>
  );
}
