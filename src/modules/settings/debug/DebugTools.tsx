
import { resetDemoData } from '@/utils/resetDemoData';
import { toast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/modules/auth/AuthProvider';

export const DebugTools = () => {
  const { user } = useAuth();
  
  // Only show to admins
  if (!user?.viewAllProposals) return null;

  return (
    <div className="mt-6 pt-6 border-t">
      <h3 className="text-lg font-medium mb-4">Ferramentas de Administração</h3>
      
      <Button
        variant="destructive"
        onClick={async () => {
          if (confirm('Remover TODOS os dados fictícios? Esta ação não pode ser desfeita.')) {
            await resetDemoData();
            toast({
              title: 'Base zerada 🗑️',
              description: 'Todos os dados fictícios foram removidos'
            });
            // Force a hard reload to ensure all components rerender with fresh data
            window.location.href = window.location.origin;
          }
        }}
      >
        Zerar dados fictícios
      </Button>
    </div>
  );
};
