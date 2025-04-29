
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { PenLine, Mail, Phone, Calendar, MapPin } from "lucide-react";

export default function Profile() {
  return (
    <div className="container mx-auto py-6 animate-fade-in">
      <h1 className="text-2xl font-bold mb-6">Meu Perfil</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="p-6 col-span-1">
          <div className="flex flex-col items-center text-center">
            <Avatar className="h-24 w-24 mb-4">
              <AvatarImage src="/placeholder.svg" alt="Foto do perfil" />
              <AvatarFallback>JS</AvatarFallback>
            </Avatar>
            
            <h2 className="text-xl font-semibold">João Silva</h2>
            <p className="text-gray-500">Gerente de Vendas</p>
            
            <Separator className="my-4" />
            
            <div className="w-full space-y-3">
              <div className="flex items-center">
                <Mail className="h-4 w-4 mr-2 text-gray-500" />
                <span className="text-sm">joao.silva@email.com</span>
              </div>
              <div className="flex items-center">
                <Phone className="h-4 w-4 mr-2 text-gray-500" />
                <span className="text-sm">(11) 98765-4321</span>
              </div>
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                <span className="text-sm">Entrou em Janeiro 2022</span>
              </div>
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                <span className="text-sm">São Paulo, SP</span>
              </div>
            </div>
            
            <Separator className="my-4" />
            
            <Button variant="outline" className="mt-2">
              <PenLine className="h-4 w-4 mr-2" />
              Editar Perfil
            </Button>
          </div>
        </Card>
        
        <Card className="p-6 col-span-1 lg:col-span-2">
          <h2 className="text-xl font-semibold mb-4">Atividades Recentes</h2>
          <Separator className="mb-4" />
          
          <div className="space-y-4">
            <div className="border-l-2 border-doIt-primary pl-4 py-1">
              <p className="text-sm text-gray-500">Hoje, 14:30</p>
              <p>Concluiu um negócio com Cliente ABC</p>
            </div>
            
            <div className="border-l-2 border-doIt-primary pl-4 py-1">
              <p className="text-sm text-gray-500">Ontem, 10:15</p>
              <p>Adicionou 3 novos leads ao pipeline</p>
            </div>
            
            <div className="border-l-2 border-doIt-primary pl-4 py-1">
              <p className="text-sm text-gray-500">28/04/2025, 16:45</p>
              <p>Atualizou proposta para Cliente XYZ</p>
            </div>
            
            <div className="border-l-2 border-doIt-primary pl-4 py-1">
              <p className="text-sm text-gray-500">27/04/2025, 09:20</p>
              <p>Agendou reunião com novo prospecto</p>
            </div>
          </div>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        <Card className="p-6 col-span-1 lg:col-span-3">
          <h2 className="text-xl font-semibold mb-4">Metas Pessoais</h2>
          <Separator className="mb-4" />
          
          <div className="space-y-6">
            <div>
              <div className="flex justify-between mb-2">
                <span>Meta de vendas mensal</span>
                <span className="font-medium">85%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div className="bg-doIt-primary h-2.5 rounded-full" style={{ width: "85%" }}></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between mb-2">
                <span>Novos leads adquiridos</span>
                <span className="font-medium">62%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div className="bg-doIt-primary h-2.5 rounded-full" style={{ width: "62%" }}></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between mb-2">
                <span>Taxa de conversão</span>
                <span className="font-medium">45%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div className="bg-doIt-primary h-2.5 rounded-full" style={{ width: "45%" }}></div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
