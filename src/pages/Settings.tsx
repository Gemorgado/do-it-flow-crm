
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function Settings() {
  return (
    <div className="container mx-auto py-6 animate-fade-in">
      <h1 className="text-2xl font-bold mb-6">Configurações</h1>
      
      <Tabs defaultValue="perfil" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="perfil">Perfil</TabsTrigger>
          <TabsTrigger value="empresa">Empresa</TabsTrigger>
          <TabsTrigger value="notificacoes">Notificações</TabsTrigger>
          <TabsTrigger value="integracao">Integrações</TabsTrigger>
        </TabsList>
        
        <TabsContent value="perfil">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Informações do Perfil</h2>
            <Separator className="mb-4" />
            
            <div className="space-y-4 max-w-2xl">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nome">Nome</Label>
                  <Input id="nome" defaultValue="João Silva" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" defaultValue="joao.silva@email.com" />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="telefone">Telefone</Label>
                  <Input id="telefone" defaultValue="(11) 98765-4321" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cargo">Cargo</Label>
                  <Input id="cargo" defaultValue="Gerente de Vendas" />
                </div>
              </div>
              
              <div className="pt-4">
                <Button>Salvar Alterações</Button>
              </div>
            </div>
          </Card>
        </TabsContent>
        
        <TabsContent value="empresa">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Informações da Empresa</h2>
            <Separator className="mb-4" />
            
            <div className="space-y-4 max-w-2xl">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="empresa">Nome da Empresa</Label>
                  <Input id="empresa" defaultValue="Do It Flow Ltda." />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cnpj">CNPJ</Label>
                  <Input id="cnpj" defaultValue="12.345.678/0001-90" />
                </div>
              </div>
              
              <div className="pt-4">
                <Button>Salvar Alterações</Button>
              </div>
            </div>
          </Card>
        </TabsContent>
        
        <TabsContent value="notificacoes">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Preferências de Notificação</h2>
            <Separator className="mb-4" />
            
            <div className="space-y-2">
              <p>Configurações de notificação em desenvolvimento.</p>
            </div>
          </Card>
        </TabsContent>
        
        <TabsContent value="integracao">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Integrações</h2>
            <Separator className="mb-4" />
            
            <div className="space-y-2">
              <p>Configurações de integração em desenvolvimento.</p>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
