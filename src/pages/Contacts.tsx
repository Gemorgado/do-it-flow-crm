
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Plus, 
  Filter, 
  Search, 
  UserPlus, 
  Calendar,
  MessageSquare,
  FileText,
  MoreHorizontal,
  Mail,
  Phone,
  Briefcase,
  Building,
  MapPin
} from "lucide-react";
import { leads, clients } from "@/data/mockData";
import { Lead, Client, LeadStatus, LeadSource, ServiceType, ServiceStatus } from "@/types";

export default function Contacts() {
  const [searchTerm, setSearchTerm] = useState("");
  
  // Simple filtering by name, email, or company
  const filteredLeads = leads.filter(lead => 
    lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (lead.company && lead.company.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  
  const filteredClients = clients.filter(client => 
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.company.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Leads e Clientes</h1>
          <p className="text-gray-500">Gerencie todos os seus contatos em um só lugar</p>
        </div>
        <Button className="bg-doIt-primary hover:bg-doIt-dark">
          <Plus className="mr-2 h-4 w-4" /> Novo Contato
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="flex flex-1 gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Buscar contatos..."
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <Button variant="outline" className="gap-2">
            <Filter className="h-4 w-4" /> Filtros
          </Button>
        </div>
      </div>

      <Tabs defaultValue="leads" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="leads">Leads ({filteredLeads.length})</TabsTrigger>
          <TabsTrigger value="clients">Clientes ({filteredClients.length})</TabsTrigger>
        </TabsList>
        
        <TabsContent value="leads" className="mt-0">
          <div className="bg-white rounded-md border shadow">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-gray-50">
                    <th className="p-3 text-left font-medium text-gray-500 text-sm">Nome</th>
                    <th className="p-3 text-left font-medium text-gray-500 text-sm">Empresa</th>
                    <th className="p-3 text-left font-medium text-gray-500 text-sm">Contato</th>
                    <th className="p-3 text-left font-medium text-gray-500 text-sm">Status</th>
                    <th className="p-3 text-left font-medium text-gray-500 text-sm">Fonte</th>
                    <th className="p-3 text-left font-medium text-gray-500 text-sm">Valor</th>
                    <th className="p-3 text-center font-medium text-gray-500 text-sm">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLeads.map((lead) => (
                    <LeadRow key={lead.id} lead={lead} />
                  ))}
                </tbody>
              </table>
            </div>
            
            {filteredLeads.length === 0 && (
              <div className="p-8 text-center">
                <p className="text-gray-500">Nenhum lead encontrado</p>
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="clients" className="mt-0">
          <div className="bg-white rounded-md border shadow">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-gray-50">
                    <th className="p-3 text-left font-medium text-gray-500 text-sm">Nome</th>
                    <th className="p-3 text-left font-medium text-gray-500 text-sm">Empresa</th>
                    <th className="p-3 text-left font-medium text-gray-500 text-sm">Contato</th>
                    <th className="p-3 text-left font-medium text-gray-500 text-sm">Status</th>
                    <th className="p-3 text-left font-medium text-gray-500 text-sm">Serviços</th>
                    <th className="p-3 text-left font-medium text-gray-500 text-sm">Valor Total</th>
                    <th className="p-3 text-center font-medium text-gray-500 text-sm">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredClients.map((client) => (
                    <ClientRow key={client.id} client={client} />
                  ))}
                </tbody>
              </table>
            </div>
            
            {filteredClients.length === 0 && (
              <div className="p-8 text-center">
                <p className="text-gray-500">Nenhum cliente encontrado</p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

interface LeadRowProps {
  lead: Lead;
}

function LeadRow({ lead }: LeadRowProps) {
  function getStatusColor(status: LeadStatus): string {
    switch (status) {
      case "novo": return "bg-blue-100 text-blue-800";
      case "contatado": return "bg-sky-100 text-sky-800";
      case "qualificado": return "bg-indigo-100 text-indigo-800";
      case "proposta": return "bg-violet-100 text-violet-800";
      case "negociação": return "bg-purple-100 text-purple-800";
      case "fechado": return "bg-green-100 text-green-800";
      case "perdido": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  }

  function getSourceLabel(source: LeadSource): string {
    switch (source) {
      case "site_organico": return "Site Orgânico";
      case "google_ads": return "Google Ads";
      case "meta_ads": return "Meta Ads";
      case "instagram": return "Instagram";
      case "indicacao": return "Indicação";
      case "visita_presencial": return "Visita";
      case "eventos": return "Eventos";
      case "outros": return "Outros";
      default: return "Desconhecido";
    }
  }

  function formatValue(value?: number): string {
    if (!value) return "Não informado";
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }

  return (
    <tr className="border-b hover:bg-gray-50">
      <td className="p-3">
        <div className="font-medium">{lead.name}</div>
      </td>
      <td className="p-3">
        <div className="text-sm text-gray-700">{lead.company || "-"}</div>
      </td>
      <td className="p-3">
        <div className="flex flex-col gap-1">
          <div className="text-sm text-gray-700 flex items-center gap-1">
            <Mail className="h-3 w-3" /> {lead.email}
          </div>
          <div className="text-sm text-gray-700 flex items-center gap-1">
            <Phone className="h-3 w-3" /> {lead.phone}
          </div>
        </div>
      </td>
      <td className="p-3">
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(lead.status)}`}>
          {lead.status.charAt(0).toUpperCase() + lead.status.slice(1)}
        </span>
      </td>
      <td className="p-3">
        <div className="text-sm text-gray-700">{getSourceLabel(lead.source)}</div>
      </td>
      <td className="p-3">
        <div className="text-sm font-medium">{formatValue(lead.value)}</div>
      </td>
      <td className="p-3">
        <div className="flex justify-center space-x-1">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <FileText className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <MessageSquare className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </td>
    </tr>
  );
}

interface ClientRowProps {
  client: Client;
}

function ClientRow({ client }: ClientRowProps) {
  function getStatusColor(status: Client["status"]): string {
    switch (status) {
      case "ativo": return "bg-green-100 text-green-800";
      case "inativo": return "bg-gray-100 text-gray-800";
      case "inadimplente": return "bg-red-100 text-red-800";
      case "cancelado": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  }

  function formatValue(value: number): string {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }

  function formatDate(dateString?: string): string {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR').format(date);
  }

  const getServiceTypeName = (type: ServiceType): string => {
    switch (type) {
      case "sala_privativa": return "Sala Privativa";
      case "estacao": return "Estação";
      case "endereco_fiscal": return "Endereço Fiscal";
      case "sala_reuniao": return "Sala de Reunião";
      default: return "Desconhecido";
    }
  };

  // Calculate total contract value from all services
  const calculateTotalValue = (client: Client): number => {
    if (!client.services || client.services.length === 0) return 0;
    return client.services.reduce((total, service) => {
      return total + service.value;
    }, 0);
  };

  // Count active services
  const activeServicesCount = client.services ? 
    client.services.filter(service => service.status === "ativo").length : 0;

  return (
    <tr className="border-b hover:bg-gray-50">
      <td className="p-3">
        <div className="font-medium">{client.name}</div>
      </td>
      <td className="p-3">
        <div className="text-sm text-gray-700">{client.company}</div>
      </td>
      <td className="p-3">
        <div className="flex flex-col gap-1">
          <div className="text-sm text-gray-700 flex items-center gap-1">
            <Mail className="h-3 w-3" /> {client.email}
          </div>
          <div className="text-sm text-gray-700 flex items-center gap-1">
            <Phone className="h-3 w-3" /> {client.phone}
          </div>
        </div>
      </td>
      <td className="p-3">
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(client.status)}`}>
          {client.status.charAt(0).toUpperCase() + client.status.slice(1)}
        </span>
      </td>
      <td className="p-3">
        {client.services && client.services.length > 0 ? (
          <div className="flex flex-col gap-1">
            <div className="text-sm font-medium">{activeServicesCount} serviço(s) ativo(s)</div>
            {client.services.slice(0, 2).map((service, index) => (
              <div key={index} className="text-xs text-gray-500 flex items-center gap-1">
                {service.type === "sala_privativa" && <Building className="h-3 w-3" />}
                {service.type === "estacao" && <Briefcase className="h-3 w-3" />}
                {service.type === "endereco_fiscal" && <MapPin className="h-3 w-3" />}
                {service.type === "sala_reuniao" && <Calendar className="h-3 w-3" />}
                {service.description} ({formatDate(service.contractEnd)})
              </div>
            ))}
            {client.services.length > 2 && (
              <div className="text-xs text-gray-500">+ {client.services.length - 2} serviços</div>
            )}
          </div>
        ) : (
          <div className="text-sm text-gray-500">Nenhum serviço</div>
        )}
      </td>
      <td className="p-3">
        <div className="text-sm font-medium">{formatValue(calculateTotalValue(client))}</div>
        <div className="text-xs text-gray-500">
          {client.services && client.services.length > 0 && client.services[0].billingCycle === "mensal" ? "Mensal" : "Anual"}
        </div>
      </td>
      <td className="p-3">
        <div className="flex justify-center space-x-1">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <FileText className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <MessageSquare className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </td>
    </tr>
  );
}
