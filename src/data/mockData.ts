export interface Lead {
  id: string;
  name: string;
  company?: string;
  email: string;
  phone: string;
  status: LeadStatus;
  source: LeadSource;
  createdAt: string;
  updatedAt: string;
  stage: PipelineStage;
  assignedTo?: string;
  notes?: string;
  value?: number;
  lastContact?: string;
  nextFollowUp?: string;
  meetingScheduled?: string;
}

export type LeadStatus = 
  | "novo" 
  | "contatado" 
  | "qualificado" 
  | "proposta" 
  | "negociação" 
  | "fechado" 
  | "perdido";

export type LeadSource = 
  | "site_organico" 
  | "google_ads" 
  | "meta_ads" 
  | "instagram" 
  | "indicacao" 
  | "visita_presencial" 
  | "eventos" 
  | "outros";

export interface Client {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  address?: string;
  contractStart?: string;
  contractEnd?: string;
  contractValue: number;
  plan: string;
  status: "ativo" | "inativo" | "inadimplente" | "cancelado";
  createdAt: string;
  updatedAt: string;
  notes?: string;
  assignedTo?: string;
}

export interface Interaction {
  id: string;
  contactId: string;
  type: "email" | "call" | "meeting" | "whatsapp" | "visit" | "other";
  date: string;
  notes: string;
  createdBy: string;
  followUpNeeded: boolean;
  followUpDate?: string;
}

export interface Task {
  id: string;
  contactId?: string;
  title: string;
  description?: string;
  dueDate: string;
  priority: "baixa" | "média" | "alta";
  status: "pendente" | "em_progresso" | "concluída" | "cancelada";
  assignedTo: string;
  createdAt: string;
  updatedAt: string;
}

export interface PipelineStage {
  id: string;
  name: string;
  order: number;
  color: string;
}

export interface Proposal {
  id: string;
  leadId: string;
  title: string;
  value: number;
  createdAt: string;
  expiresAt: string;
  status: "enviada" | "visualizada" | "aceita" | "rejeitada" | "expirada" | "em_negociacao";
  notes?: string;
  products: ProposalItem[];
}

export interface ProposalItem {
  id: string;
  name: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "comercial" | "atendimento" | "gerente" | "diretor";
  avatar?: string;
  createdAt: string;
  active: boolean;
}

export interface DashboardStats {
  newLeads: number;
  activeClients: number;
  revenueMTD: number;
  leadsConversion: number;
  pendingTasks: number;
  upcomingRenewals: number;
  meetingsScheduled: number;
}

export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string | string[];
    borderColor?: string;
    borderWidth?: number;
  }[];
}

export const dashboardStats: DashboardStats = {
  newLeads: 256,
  activeClients: 187,
  revenueMTD: 1420000,
  leadsConversion: 23.5,
  pendingTasks: 12,
  upcomingRenewals: 8,
  meetingsScheduled: 3
};

export const leadsChartData: ChartData = {
  labels: ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho"],
  datasets: [
    {
      label: "Leads",
      data: [120, 150, 180, 200, 220, 256],
      borderColor: "rgba(54, 162, 235, 1)",
      backgroundColor: "rgba(54, 162, 235, 0.2)",
      borderWidth: 2,
    },
  ],
};

export const conversionChartData: ChartData = {
  labels: ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho"],
  datasets: [
    {
      label: "Conversão",
      data: [20, 25, 30, 35, 40, 60],
      borderColor: "rgba(75, 192, 192, 1)",
      backgroundColor: "rgba(75, 192, 192, 0.2)",
      borderWidth: 2,
    },
  ],
};

export const revenueChartData: ChartData = {
  labels: ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho"],
  datasets: [
    {
      label: "Receita",
      data: [5000, 6000, 7500, 8200, 9800, 14200],
      borderColor: "rgba(255, 99, 132, 1)",
      backgroundColor: "rgba(255, 99, 132, 0.2)",
      borderWidth: 2,
    },
  ],
};

export const leadSourceChartData: ChartData = {
  labels: ["Orgânico", "Google Ads", "Meta Ads", "Indicação"],
  datasets: [
    {
      label: "Origem dos Leads",
      data: [40, 30, 20, 10],
      backgroundColor: [
        "rgba(255, 99, 132, 0.7)",
        "rgba(54, 162, 235, 0.7)",
        "rgba(255, 206, 86, 0.7)",
        "rgba(75, 192, 192, 0.7)",
      ],
      borderWidth: 1,
    },
  ],
};

export const tasks = [
  {
    id: "1",
    title: "Ligar para o lead João",
    dueDate: "2024-08-10",
    priority: "alta",
    status: "pendente",
    assignedTo: "Maria",
    createdAt: "2024-07-25",
    updatedAt: "2024-07-25",
  },
  {
    id: "2",
    title: "Enviar proposta para a empresa XPTO",
    dueDate: "2024-08-12",
    priority: "média",
    status: "em_progresso",
    assignedTo: "Maria",
    createdAt: "2024-07-25",
    updatedAt: "2024-07-25",
  },
  {
    id: "3",
    title: "Agendar reunião com o cliente ABC",
    dueDate: "2024-08-15",
    priority: "baixa",
    status: "concluída",
    assignedTo: "Maria",
    createdAt: "2024-07-25",
    updatedAt: "2024-07-25",
  },
  {
    id: "4",
    title: "Aprovar campanha de marketing",
    dueDate: "2024-08-18",
    priority: "alta",
    status: "cancelada",
    assignedTo: "José",
    createdAt: "2024-07-25",
    updatedAt: "2024-07-25",
  },
  {
    id: "5",
    title: "Revisar contrato com o cliente XYZ",
    dueDate: "2024-08-20",
    priority: "média",
    status: "pendente",
    assignedTo: "José",
    createdAt: "2024-07-25",
    updatedAt: "2024-07-25",
  },
];

export const leads = [
  {
    id: "1",
    name: "João Silva",
    company: "Empresa A",
    email: "joao@empresaA.com",
    phone: "11999999999",
    status: "novo",
    source: "site_organico",
    createdAt: "2024-07-25",
    updatedAt: "2024-07-25",
    stage: {
      id: "1",
      name: "Novo",
      order: 1,
      color: "#f00",
    },
  },
  {
    id: "2",
    name: "Maria Souza",
    company: "Empresa B",
    email: "maria@empresaB.com",
    phone: "11999999999",
    status: "contatado",
    source: "google_ads",
    createdAt: "2024-07-25",
    updatedAt: "2024-07-25",
    stage: {
      id: "2",
      name: "Qualificado",
      order: 2,
      color: "#0f0",
    },
  },
  {
    id: "3",
    name: "José Santos",
    company: "Empresa C",
    email: "jose@empresaC.com",
    phone: "11999999999",
    status: "qualificado",
    source: "meta_ads",
    createdAt: "2024-07-25",
    updatedAt: "2024-07-25",
    stage: {
      id: "3",
      name: "Proposta",
      order: 3,
      color: "#00f",
    },
  },
  {
    id: "4",
    name: "Ana Oliveira",
    company: "Empresa D",
    email: "ana@empresaD.com",
    phone: "11999999999",
    status: "proposta",
    source: "indicacao",
    createdAt: "2024-07-25",
    updatedAt: "2024-07-25",
    stage: {
      id: "4",
      name: "Negociação",
      order: 4,
      color: "#ff0",
    },
  },
  {
    id: "5",
    name: "Carlos Pereira",
    company: "Empresa E",
    email: "carlos@empresaE.com",
    phone: "11999999999",
    status: "negociação",
    source: "instagram",
    createdAt: "2024-07-25",
    updatedAt: "2024-07-25",
    stage: {
      id: "5",
      name: "Fechado",
      order: 5,
      color: "#f0f",
    },
  },
];

// Marketing and Growth data
export const leadSourceData = {
  labels: ["Google Ads", "Meta Ads", "Orgânico", "Referência", "Indicação", "Outros"],
  datasets: [
    {
      label: "Lead Sources",
      data: [35, 25, 18, 12, 8, 2],
      backgroundColor: [
        "rgba(54, 162, 235, 0.7)",
        "rgba(102, 102, 255, 0.7)",
        "rgba(75, 192, 192, 0.7)",
        "rgba(255, 206, 86, 0.7)",
        "rgba(255, 159, 64, 0.7)",
        "rgba(201, 203, 207, 0.7)"
      ],
      borderWidth: 1
    }
  ]
};

export const campaignPerformanceData = {
  labels: ["Campanha A", "Campanha B", "Campanha C", "Campanha D", "Campanha E"],
  datasets: [
    {
      label: "CPL (R$)",
      data: [45.20, 67.80, 32.50, 89.30, 51.70],
      backgroundColor: "rgba(54, 162, 235, 0.7)",
    },
    {
      label: "CAC (R$)",
      data: [320.50, 475.40, 290.30, 610.80, 380.20],
      backgroundColor: "rgba(255, 99, 132, 0.7)",
    }
  ]
};

export const marketingROIData = [
  {
    channel: "Google Ads",
    spend: 12500,
    revenue: 36000,
    roi: 188.0,
    leads: 275,
    customers: 32,
    cpl: 45.45,
    cac: 390.63
  },
  {
    channel: "Meta Ads",
    spend: 9800,
    revenue: 28000,
    roi: 185.7,
    leads: 210,
    customers: 25,
    cpl: 46.67,
    cac: 392.00
  },
  {
    channel: "E-mail Marketing",
    spend: 2800,
    revenue: 14500,
    roi: 417.9,
    leads: 98,
    customers: 18,
    cpl: 28.57,
    cac: 155.56
  },
  {
    channel: "LinkedIn Ads",
    spend: 6500,
    revenue: 18500,
    roi: 184.6,
    leads: 85,
    customers: 12,
    cpl: 76.47,
    cac: 541.67
  }
];

export const trafficSourceData = {
  labels: ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun"],
  datasets: [
    {
      label: "Visitas",
      data: [2800, 3200, 3600, 4100, 4500, 5100],
      borderColor: "rgba(75, 192, 192, 1)",
      backgroundColor: "rgba(75, 192, 192, 0.2)",
      borderWidth: 2,
      fill: true,
    },
    {
      label: "Leads",
      data: [120, 145, 160, 190, 210, 245],
      borderColor: "rgba(54, 162, 235, 1)",
      backgroundColor: "rgba(54, 162, 235, 0.2)",
      borderWidth: 2,
      fill: true,
    }
  ]
};

export const metaVsGoogleData = {
  labels: ["Cliques", "Conv.", "CPL", "CPC", "CTR", "ROI"],
  datasets: [
    {
      label: "Google Ads",
      data: [8742, 325, 45.20, 2.34, 4.66, 188],
      backgroundColor: "rgba(54, 162, 235, 0.7)",
    },
    {
      label: "Meta Ads",
      data: [10543, 278, 46.67, 1.87, 3.37, 185],
      backgroundColor: "rgba(102, 102, 255, 0.7)",
    }
  ]
};

export const growthMetrics = [
  { 
    label: "CPL Médio",
    value: "R$ 48,32",
    change: "12.4%",
    changeDirection: "down",
    badgeText: "Meta: R$ 50,00",
    badgeVariant: "outline",
    description: "Último período: R$ 55,12"
  },
  { 
    label: "CAC Médio",
    value: "R$ 392,15",
    change: "8.7%",
    changeDirection: "down",
    badgeText: "Meta: R$ 400,00",
    badgeVariant: "outline",
    description: "Último período: R$ 429,45"
  },
  { 
    label: "ROAS",
    value: "248%",
    change: "15.8%",
    changeDirection: "up",
    badgeText: "Meta: 200%",
    badgeVariant: "outline",
    description: "Retorno sobre investimento em ads"
  },
  { 
    label: "Leads Gerados",
    value: "754",
    change: "23.5%",
    changeDirection: "up",
    badgeText: "Este mês",
    badgeVariant: "secondary",
    description: "Mês anterior: 611 leads"
  },
  { 
    label: "Taxa de Conversão",
    value: "3.8%",
    change: "0.5%",
    changeDirection: "up",
    badgeText: "Meta: 3.5%",
    badgeVariant: "outline",
    description: "Leads que se tornaram clientes"
  },
  { 
    label: "Valor Médio",
    value: "R$ 1.850",
    change: "5.2%",
    changeDirection: "up",
    badgeText: "Por cliente",
    badgeVariant: "secondary",
    description: "Valor médio da primeira venda"
  }
];
