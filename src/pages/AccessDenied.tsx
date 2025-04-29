
import { Button } from '@/components/ui/button';
import { Shield } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AccessDenied() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 text-center">
      <div className="flex flex-col items-center space-y-4">
        <div className="bg-red-100 p-4 rounded-full">
          <Shield className="h-16 w-16 text-red-500" />
        </div>
        
        <h1 className="text-3xl font-bold tracking-tight">Acesso Negado</h1>
        
        <p className="text-muted-foreground max-w-md">
          Você não tem permissão para acessar esta página. 
          Entre em contato com o administrador para solicitar acesso.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 mt-6">
          <Button asChild>
            <Link to="/dashboard">
              Voltar para Dashboard
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/configuracoes">
              Ir para Configurações
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
