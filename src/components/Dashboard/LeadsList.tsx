
import { Lead } from "@/types";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { users } from "@/data/mockData";

interface LeadsListProps {
  leads: Lead[];
  className?: string;
}

function getStatusColor(status: Lead["status"]): string {
  switch (status) {
    case "novo":
      return "bg-blue-100 text-blue-800 border-blue-200";
    case "contatado":
      return "bg-sky-100 text-sky-800 border-sky-200";
    case "qualificado":
      return "bg-indigo-100 text-indigo-800 border-indigo-200";
    case "proposta":
      return "bg-violet-100 text-violet-800 border-violet-200";
    case "negociação":
      return "bg-purple-100 text-purple-800 border-purple-200";
    case "fechado":
      return "bg-green-100 text-green-800 border-green-200";
    case "perdido":
      return "bg-gray-100 text-gray-800 border-gray-200";
    default:
      return "bg-gray-100 text-gray-800";
  }
}

function getSourceLabel(source: Lead["source"]): string {
  switch (source) {
    case "site_organico":
      return "Site Orgânico";
    case "google_ads":
      return "Google Ads";
    case "meta_ads":
      return "Meta Ads";
    case "instagram":
      return "Instagram";
    case "indicacao":
      return "Indicação";
    case "visita_presencial":
      return "Visita Presencial";
    case "eventos":
      return "Eventos";
    case "outros":
      return "Outros";
    default:
      return "Desconhecido";
  }
}

function formatValue(value?: number): string {
  if (!value) return "Não informado";
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function getAssignedToName(assignedTo?: string): string {
  if (!assignedTo) return "Não atribuído";
  const user = users.find(user => user.id === assignedTo);
  return user ? user.name : "Não atribuído";
}

export function LeadsList({ leads, className = "" }: LeadsListProps) {
  return (
    <div className={`space-y-4 ${className}`}>
      {leads.slice(0, 5).map((lead) => (
        <div key={lead.id} className="flex flex-col p-3 bg-white border rounded-md shadow-sm">
          <div className="flex justify-between items-start">
            <h4 className="font-medium">{lead.name}</h4>
            <Badge variant="outline" className={getStatusColor(lead.status)}>
              {lead.status.charAt(0).toUpperCase() + lead.status.slice(1)}
            </Badge>
          </div>
          
          {lead.company && (
            <p className="text-sm text-gray-600">{lead.company}</p>
          )}
          
          <div className="grid grid-cols-2 gap-x-4 gap-y-1 mt-2 text-xs">
            <div>
              <span className="text-gray-500">E-mail:</span> {lead.email}
            </div>
            <div>
              <span className="text-gray-500">Telefone:</span> {lead.phone}
            </div>
            <div>
              <span className="text-gray-500">Origem:</span> {getSourceLabel(lead.source)}
            </div>
            <div>
              <span className="text-gray-500">Valor:</span> {formatValue(lead.value)}
            </div>
            <div>
              <span className="text-gray-500">Responsável:</span> {getAssignedToName(lead.assignedTo)}
            </div>
            <div>
              <span className="text-gray-500">Criado:</span> {formatDistanceToNow(new Date(lead.createdAt), { addSuffix: true, locale: ptBR })}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
