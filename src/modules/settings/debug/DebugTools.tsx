
import { resetDemoData } from '@/utils/resetDemoData';
import { resetPipelineDemo } from '@/utils/resetPipelineDemo';
import { resetAllDemoData } from '@/utils/resetAllDemoData';
import { toast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/modules/auth/AuthProvider';
import { useState } from 'react';
import { Trash2, AlertTriangle } from 'lucide-react';

export const DebugTools = () => {
  const { user } = useAuth();
  const [isResetting, setIsResetting] = useState(false);
  const [isResettingPipeline, setIsResettingPipeline] = useState(false);
  const [isResettingAll, setIsResettingAll] = useState(false);
  
  // Only show to admins
  if (!user?.viewAllProposals) return null;

  const handleReset = async () => {
    if (confirm('Remover TODOS os dados fictícios? Esta ação não pode ser desfeita.')) {
      setIsResetting(true);
      try {
        await resetDemoData();
        toast({
          title: 'Base zerada 🗑️',
          description: 'Todos os dados fictícios foram removidos'
        });
        // Force a hard reload to ensure all components rerender with fresh data
        window.location.href = window.location.origin;
      } catch (error) {
        console.error("Erro ao zerar dados:", error);
        toast({
          title: "Erro ao zerar dados",
          description: "Não foi possível zerar os dados. Tente novamente.",
          variant: "destructive",
        });
      } finally {
        setIsResetting(false);
      }
    }
  };

  const handleResetPipeline = async () => {
    if (confirm('Apagar TODOS os cards fictícios do Pipeline?')) {
      setIsResettingPipeline(true);
      try {
        await resetPipelineDemo();
        toast({
          title: 'Pipeline limpo 🧹',
          description: 'Todos os cards fictícios do pipeline foram removidos'
        });
        // No need for full page reload, just for pipeline
      } catch (error) {
        console.error("Erro ao zerar pipeline:", error);
        toast({
          title: "Erro ao zerar pipeline",
          description: "Não foi possível zerar os dados do pipeline. Tente novamente.",
          variant: "destructive",
        });
      } finally {
        setIsResettingPipeline(false);
      }
    }
  };

  const handleResetAllDemoData = async () => {
    if (confirm('⚠️ ZERAR COMPLETAMENTE TODOS os dados fictícios da plataforma? Esta ação é irreversível.')) {
      setIsResettingAll(true);
      try {
        await resetAllDemoData();
        toast({
          title: 'Plataforma zerada 🗑️',
          description: 'Todos os dados fictícios foram removidos de todas as abas'
        });
        // Force a hard reload to ensure all components rerender with fresh data
        window.location.href = window.location.origin;
      } catch (error) {
        console.error("Erro ao zerar todos os dados:", error);
        toast({
          title: "Erro ao zerar plataforma",
          description: "Ocorreu um erro ao tentar limpar todos os dados fictícios.",
          variant: "destructive",
        });
      } finally {
        setIsResettingAll(false);
      }
    }
  };

  return (
    <div className="mt-6 pt-6 border-t">
      <h3 className="text-lg font-medium mb-4">Ferramentas de Administração</h3>
      
      <div className="flex flex-col gap-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            variant="destructive"
            className="flex items-center gap-2"
            onClick={handleReset}
            disabled={isResetting}
          >
            <Trash2 className="h-4 w-4" />
            {isResetting ? "Zerando..." : "Zerar dados fictícios"}
          </Button>
          
          <Button
            variant="destructive"
            className="flex items-center gap-2"
            onClick={handleResetPipeline}
            disabled={isResettingPipeline}
          >
            <Trash2 className="h-4 w-4" />
            {isResettingPipeline ? "Zerando..." : "Zerar Pipeline (demo)"}
          </Button>
        </div>
        
        <Button
          variant="destructive"
          className="flex items-center gap-2 bg-red-700 hover:bg-red-800 mt-2"
          onClick={handleResetAllDemoData}
          disabled={isResettingAll}
        >
          <AlertTriangle className="h-4 w-4" />
          {isResettingAll ? "Zerando completamente..." : "ZERAR TODA PLATAFORMA"}
        </Button>
      </div>
    </div>
  );
};
