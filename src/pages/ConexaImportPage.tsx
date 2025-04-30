
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';

export default function ConexaImportPage() {
  const navigate = useNavigate();
  
  // Redirect to the new importer page
  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/importador');
    }, 3000); // Redirect after 3 seconds
    
    return () => clearTimeout(timer);
  }, [navigate]);
  
  return (
    <div className="container py-10 animate-fade-in">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Importação de Dados Conexa</h1>
        <p className="text-muted-foreground mb-6">
          Esta página foi substituída pelo novo sistema de importação.
        </p>
        
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-amber-700">
              <AlertCircle className="h-5 w-5" />
              Redirecionando...
            </CardTitle>
            <CardDescription>
              Você está sendo redirecionado para o novo importador de dados.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>
              O novo importador oferece recursos avançados:
            </p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Detecção automática de colunas</li>
              <li>Templates de importação personalizáveis</li>
              <li>Validação avançada de dados</li>
              <li>Relatórios detalhados de erros</li>
            </ul>
          </CardContent>
          <CardFooter>
            <Button onClick={() => navigate('/importador')}>
              Ir para o Novo Importador
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
