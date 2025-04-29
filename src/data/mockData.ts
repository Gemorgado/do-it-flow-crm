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

export const users = [
  {
    id: "1",
    name: "Amanda Silva",
    email: "amanda@doit.com",
    role: "comercial" as const,
    avatar: "/avatars/amanda.png",
    createdAt: "2023-01-10",
    active: true
  },
  {
    id: "2",
    name: "Ricardo Barros",
    email: "ricardo@doit.com",
    role: "comercial" as const,
    avatar: "/avatars/ricardo.png",
    createdAt: "2023-02-15",
    active: true
  },
  {
    id: "3",
    name: "Camila Costa",
    email: "camila@doit.com",
    role: "gerente" as const,
    avatar: "/avatars/camila.png",
    createdAt: "2022-11-05",
    active: true
  },
  {
    id: "4",
    name: "João Oliveira",
    email: "joao@doit.com",
    role: "diretor" as const,
    avatar: "/avatars/joao.png",
    createdAt: "2022-08-20",
    active: true
  }
];

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

export const locations: Location[] = [
  {
    id: "loc-101",
    name: "Sala 101",
    type: "sala_privativa",
    identifier: "101",
    available: false,
    area: 15
  },
  {
    id: "loc-102",
    name: "Sala 102",
    type: "sala_privativa",
    identifier: "102",
    available: true,
    area: 20
  },
  {
    id: "loc-201",
    name: "Sala de Reunião 201",
    type: "sala_reuniao",
    identifier: "201",
    available: true,
    capacity: 8
  },
  {
    id: "est-01",
    name: "Estação 01",
    type: "estacao",
    identifier: "01",
    available: false
  },
  {
    id: "est-02",
    name: "Estação 02",
    type: "estacao",
    identifier: "02",
    available: false
  },
  {
    id: "est-03",
    name: "Estação 03",
    type: "estacao",
    identifier: "03",
    available: true
  },
  {
    id: "end-fiscal",
    name: "Endereço Fiscal",
    type: "endereco_fiscal",
    identifier: "EF-001",
    available: true
  }
];

export const clientServices = [
  {
    id: "srv-001",
    clientId: "1",
    type: "sala_privativa" as ServiceType,
    description: "Sala Privativa 15m² - Plano Anual",
    locationId: "loc-101",
    contractStart: "2024-01-15",
    contractEnd: "2025-01-15",
    value: 3500,
    billingCycle: "mensal" as const,
    status: "ativo" as ServiceStatus,
    createdAt: "2023-12-20",
    updatedAt: "2024-01-15"
  },
  {
    id: "srv-002",
    clientId: "1",
    type: "endereco_fiscal" as ServiceType,
    description: "Endereço Fiscal - Plano Anual",
    locationId: "end-fiscal",
    contractStart: "2024-01-15",
    contractEnd: "2025-01-15",
    value: 200,
    billingCycle: "mensal" as const,
    status: "ativo" as ServiceStatus,
    createdAt: "2023-12-20",
    updatedAt: "2024-01-15"
  },
  {
    id: "srv-003",
    clientId: "2",
    type: "estacao" as ServiceType,
    description: "Estação Flexível - Mensal",
    locationId: "est-01",
    contractStart: "2024-03-10",
    contractEnd: "2025-03-10",
    value: 800,
    billingCycle: "mensal" as const,
    status: "ativo" as ServiceStatus,
    createdAt: "2024-02-28",
    updatedAt: "2024-03-10"
  },
  {
    id: "srv-004",
    clientId: "3",
    type: "sala_privativa" as ServiceType,
    description: "Sala Privativa 20m² - Plano Anual",
    locationId: "loc-102",
    contractStart: "2023-11-05",
    contractEnd: "2024-11-05",
    value: 4500,
    billingCycle: "mensal" as const,
    status: "em_renovacao" as ServiceStatus,
    createdAt: "2023-10-25",
    updatedAt: "2024-04-10"
  },
  {
    id: "srv-005",
    clientId: "4",
    type: "estacao" as ServiceType,
    description: "Estação Dedicada - Anual",
    locationId: "est-02",
    contractStart: "2023-08-15",
    contractEnd: "2024-08-15",
    value: 700,
    billingCycle: "mensal" as const,
    status: "ativo" as ServiceStatus,
    createdAt: "2023-08-10",
    updatedAt: "2024-02-15"
  },
  {
    id: "srv-006",
    clientId: "4",
    type: "sala_reuniao" as ServiceType,
    description: "Sala de Reunião - Pacote 10h/mês",
    locationId: "loc-201",
    contractStart: "2023-08-15",
    contractEnd: "2024-08-15",
    value: 300,
    billingCycle: "mensal" as const,
    status: "ativo" as ServiceStatus,
    createdAt: "2023-08-10",
    updatedAt: "2024-02-15"
  },
  {
    id: "srv-007",
    clientId: "5",
    type: "endereco_fiscal" as ServiceType,
    description: "Endereço Fiscal - Plano Anual",
    locationId: "end-fiscal",
    contractStart: "2024-02-01",
    contractEnd: "2025-02-01",
    value: 200,
    billingCycle: "mensal" as const,
    status: "cancelado" as ServiceStatus,
    createdAt: "2024-01-25",
    updatedAt: "2024-05-10"
  }
];

export const clients = [
  {
    id: "1",
    name: "Empresa XYZ",
    company: "Tecnologia XYZ Ltda",
    email: "contato@xyz.com",
    phone: "11987654321",
    address: "Av. Paulista, 1000",
    services: clientServices.filter(service => service.clientId === "1"),
    status: "ativo" as const,
    createdAt: "2023-12-20",
    updatedAt: "2024-01-15",
    notes: "Cliente desde 2023",
    assignedTo: "1"
  },
  {
    id: "2",
    name: "Comércio ABC",
    company: "ABC Comércio e Serviços",
    email: "contato@abc.com",
    phone: "11976543210",
    services: clientServices.filter(service => service.clientId === "2"),
    status: "ativo" as const,
    createdAt: "2024-02-28",
    updatedAt: "2024-03-10",
    assignedTo: "2"
  },
  {
    id: "3",
    name: "Consultoria 123",
    company: "123 Consultoria Empresarial",
    email: "atendimento@123consultoria.com",
    phone: "11965432109",
    address: "Rua Augusta, 500",
    services: clientServices.filter(service => service.clientId === "3"),
    status: "inadimplente" as const,
    createdAt: "2023-10-25",
    updatedAt: "2024-04-10",
    notes: "Pagamento em atraso",
    assignedTo: "3"
  },
  {
    id: "4",
    name: "Indústria QWE",
    company: "QWE Indústria Alimentícia",
    email: "comercial@qwe.com.br",
    phone: "11954321098",
    services: clientServices.filter(service => service.clientId === "4"),
    status: "ativo" as const,
    createdAt: "2023-08-10",
    updatedAt: "2024-02-15",
    assignedTo: "1"
  },
  {
    id: "5",
    name: "Serviços RTY",
    company: "RTY Serviços Digitais",
    email: "atendimento@rty.com",
    phone: "11943210987",
    address: "Rua Vergueiro, 1500",
    services: clientServices.filter(service => service.clientId === "5"),
    status: "cancelado" as const,
    createdAt: "2024-01-25",
    updatedAt: "2024-05-10",
    notes: "Cancelou após 3 meses",
    assignedTo: "2"
  }
];

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
