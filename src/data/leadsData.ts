
import { Lead, LeadStatus, LeadSource, PipelineStage } from "@/types";

export const pipelineStages: PipelineStage[] = [
  {
    id: "1",
    name: "Novo",
    order: 1,
    color: "#3b82f6" // blue-500
  },
  {
    id: "2",
    name: "Qualificado",
    order: 2,
    color: "#8b5cf6" // violet-500
  },
  {
    id: "3",
    name: "Proposta",
    order: 3,
    color: "#10b981" // emerald-500
  },
  {
    id: "4",
    name: "Negociação",
    order: 4,
    color: "#f59e0b" // amber-500
  },
  {
    id: "5",
    name: "Fechado",
    order: 5,
    color: "#22c55e" // green-500
  }
];

export const leads = [
  {
    id: "1",
    name: "João Silva",
    company: "Empresa A",
    email: "joao@empresaA.com",
    phone: "11999999999",
    status: "novo" as LeadStatus,
    source: "site_organico" as LeadSource,
    createdAt: "2024-07-25",
    updatedAt: "2024-07-25",
    stage: {
      id: "1",
      name: "Novo",
      order: 1,
      color: "#f00",
    },
    assignedTo: "1"
  },
  {
    id: "2",
    name: "Maria Souza",
    company: "Empresa B",
    email: "maria@empresaB.com",
    phone: "11999999999",
    status: "contatado" as LeadStatus,
    source: "google_ads" as LeadSource,
    createdAt: "2024-07-25",
    updatedAt: "2024-07-25",
    stage: {
      id: "2",
      name: "Qualificado",
      order: 2,
      color: "#0f0",
    },
    assignedTo: "2"
  },
  {
    id: "3",
    name: "José Santos",
    company: "Empresa C",
    email: "jose@empresaC.com",
    phone: "11999999999",
    status: "qualificado" as LeadStatus,
    source: "meta_ads" as LeadSource,
    createdAt: "2024-07-25",
    updatedAt: "2024-07-25",
    stage: {
      id: "3",
      name: "Proposta",
      order: 3,
      color: "#00f",
    },
    assignedTo: "1"
  },
  {
    id: "4",
    name: "Ana Oliveira",
    company: "Empresa D",
    email: "ana@empresaD.com",
    phone: "11999999999",
    status: "proposta" as LeadStatus,
    source: "indicacao" as LeadSource,
    createdAt: "2024-07-25",
    updatedAt: "2024-07-25",
    stage: {
      id: "4",
      name: "Negociação",
      order: 4,
      color: "#ff0",
    },
    assignedTo: "3"
  },
  {
    id: "5",
    name: "Carlos Pereira",
    company: "Empresa E",
    email: "carlos@empresaE.com",
    phone: "11999999999",
    status: "negociação" as LeadStatus,
    source: "instagram" as LeadSource,
    createdAt: "2024-07-25",
    updatedAt: "2024-07-25",
    stage: {
      id: "5",
      name: "Fechado",
      order: 5,
      color: "#f0f",
    },
    assignedTo: "2"
  },
];
