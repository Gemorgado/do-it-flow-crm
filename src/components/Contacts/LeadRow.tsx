
import React from "react";
import { Button } from "@/components/ui/button";
import { Lead, LeadStatus, LeadSource } from "@/types";
import { FileText, MessageSquare, MoreHorizontal, Mail, Phone } from "lucide-react";

interface LeadRowProps {
  lead: Lead;
}

export function LeadRow({ lead }: LeadRowProps) {
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
