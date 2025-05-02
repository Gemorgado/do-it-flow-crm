
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Integration } from "@/types/integration";
import { connectIntegration, disconnectIntegration } from "@/hooks/useIntegrations";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { toast } from "@/hooks/use-toast";
import { Settings, Plug } from "lucide-react";

interface IntegrationCardProps {
  data: Integration;
}

export function IntegrationCard({ data }: IntegrationCardProps) {
  const isConnected = data.status === 'connected';
  
  const handleConnect = () => {
    // This would typically trigger an OAuth flow or another connection method
    // For demo purposes, we'll just update the status directly
    toast({
      title: "Conectando...",
      description: `Iniciando conexão com ${data.name}`,
    });
    
    // Simulate async connection
    setTimeout(() => {
      connectIntegration(data.id);
      toast({
        title: "Integração Conectada",
        description: `${data.name} foi conectado com sucesso.`,
      });
    }, 1500);
  };
  
  const handleConfigure = () => {
    toast({
      title: "Configuração",
      description: `Abrindo configurações de ${data.name}`,
    });
    // This would open a configuration modal or redirect to settings
  };

  const handleDisconnect = () => {
    if (confirm(`Deseja realmente desconectar ${data.name}?`)) {
      disconnectIntegration(data.id);
      toast({
        title: "Integração Desconectada",
        description: `${data.name} foi desconectado com sucesso.`,
      });
    }
  };
  
  return (
    <div className={`border rounded-lg p-5 ${isConnected ? 'bg-doIt-light' : ''}`}>
      <div className="flex items-center gap-3 mb-3">
        <div className={`w-10 h-10 ${getIconBgColor(data.category)} rounded-md flex items-center justify-center text-white`}>
          {/* Ideally this would be an actual icon from the path in data.logo */}
          <IconForCategory category={data.category} />
        </div>
        <h4 className="font-medium text-lg">{data.name}</h4>
      </div>
      
      <Badge 
        variant="outline" 
        className={isConnected
          ? "bg-green-100 text-green-800 border-green-200 mb-3"
          : "bg-amber-100 text-amber-800 border-amber-200 mb-3"
        }
      >
        {isConnected ? 'Conectado' : 'Disponível'}
      </Badge>
      
      <p className="text-sm text-gray-600 mb-4">{data.description}</p>
      
      <div className="flex justify-between items-center text-sm">
        {isConnected ? (
          <>
            <span className="text-gray-500">
              Conectado em: {data.connectedAt ? formatDate(data.connectedAt) : 'N/A'}
            </span>
            <div className="space-x-2">
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-xs"
                onClick={handleConfigure}
              >
                <Settings className="h-3 w-3 mr-1" />
                Configurar
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="text-xs text-red-600 hover:text-red-700 hover:bg-red-50"
                onClick={handleDisconnect}
              >
                Desconectar
              </Button>
            </div>
          </>
        ) : (
          <Button 
            size="sm" 
            className="w-full"
            onClick={handleConnect}
          >
            <Plug className="h-4 w-4 mr-2" />
            Conectar
          </Button>
        )}
      </div>
    </div>
  );
}

function formatDate(dateString: string): string {
  try {
    return format(new Date(dateString), "dd/MM/yyyy", { locale: ptBR });
  } catch (e) {
    return "Data inválida";
  }
}

function getIconBgColor(category: Integration['category']): string {
  switch (category) {
    case 'marketing': return 'bg-blue-500';
    case 'pixel': return 'bg-purple-500';
    case 'erp': return 'bg-indigo-500';
    case 'webhook': return 'bg-green-500';
    default: return 'bg-gray-500';
  }
}

function IconForCategory({ category }: { category: Integration['category'] }) {
  // Simplistic approach - in a real app you'd use proper icons for each integration
  switch (category) {
    case 'marketing':
      return <span className="text-sm">M</span>;
    case 'pixel':
      return <span className="text-sm">P</span>;
    case 'erp':
      return <span className="text-sm">E</span>;
    case 'webhook':
      return <span className="text-sm">W</span>;
    default:
      return <span className="text-sm">?</span>;
  }
}
