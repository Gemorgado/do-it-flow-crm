
import { resetDemoData } from '@/utils/resetDemoData';
import { toast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/modules/auth/AuthProvider';
import { useState } from 'react';
import { Trash2 } from 'lucide-react';

export const DebugTools = () => {
  const { user } = useAuth();
  const [isResetting, setIsResetting] = useState(false);
  
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

  return (
    <div className="mt-6 pt-6 border-t">
      <h3 className="text-lg font-medium mb-4">Ferramentas de Administração</h3>
      
      <Button
        variant="destructive"
        className="flex items-center gap-2"
        onClick={handleReset}
        disabled={isResetting}
      >
        <Trash2 className="h-4 w-4" />
        {isResetting ? "Zerando..." : "Zerar dados fictícios"}
      </Button>
    </div>
  );
};
