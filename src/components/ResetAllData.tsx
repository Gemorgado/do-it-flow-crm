
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Trash2, AlertTriangle } from "lucide-react";
import { resetAllDemoData } from "@/utils/resetAllDemoData";
import { toast } from "@/hooks/use-toast";

export function ResetAllData() {
  const [isResetting, setIsResetting] = useState(false);
  
  const handleResetAllData = async () => {
    if (confirm("⚠️ ATENÇÃO: Esta ação irá apagar TODOS os dados fictícios da plataforma. Esta ação é irreversível. Deseja continuar?")) {
      setIsResetting(true);
      try {
        await resetAllDemoData();
        toast({
          title: "Dados limpos",
          description: "Todos os dados fictícios foram removidos da plataforma com sucesso",
        });
        // Força um refresh completo da página para garantir que todos os componentes sejam recarregados
        window.location.reload();
      } catch (error) {
        console.error("Erro ao limpar dados:", error);
        toast({
          title: "Erro ao limpar dados",
          description: "Não foi possível limpar os dados fictícios. Tente novamente.",
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
      onClick={handleResetAllData}
      disabled={isResetting}
      className="flex items-center gap-2"
    >
      {isResetting ? (
        <>
          <AlertTriangle className="h-4 w-4" />
          Limpando...
        </>
      ) : (
        <>
          <Trash2 className="h-4 w-4" />
          Limpar Todos os Dados
        </>
      )}
    </Button>
  );
}
