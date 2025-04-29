
import { 
  Lead, 
  Client, 
  PipelineStage, 
  Task, 
  Interaction,
  Proposal,
  User,
  DashboardStats,
  ChartData
} from "@/types";
import { formatDistanceToNow, subDays, addDays } from "date-fns";
import { ptBR } from "date-fns/locale";

// Pipeline Stages
export const pipelineStages: PipelineStage[] = [
  { id: "1", name: "Novo Lead", order: 1, color: "#e0e7ff" },
  { id: "2", name: "Contato Inicial", order: 2, color: "#dbeafe" },
  { id: "3", name: "Agendado", order: 3, color: "#bfdbfe" },
  { id: "4", name: "Visita Realizada", order: 4, color: "#93c5fd" },
  { id: "5", name: "Proposta", order: 5, color: "#60a5fa" },
  { id: "6", name: "Negociação", order: 6, color: "#3b82f6" },
  { id: "7", name: "Contrato", order: 7, color: "#2563eb" },
  { id: "8", name: "Fechado", order: 8, color: "#1d4ed8" },
];

// Users
export const users: User[] = [
  { 
    id: "1", 
    name: "Amanda Silva", 
    email: "amanda@doitcoworking.com.br", 
    role: "comercial", 
    avatar: "https://i.pravatar.cc/150?img=1", 
    createdAt: subDays(new Date(), 90).toISOString(),
    active: true
  },
  { 
    id: "2", 
    name: "Ricardo Barros", 
    email: "ricardo@doitcoworking.com.br", 
    role: "gerente", 
    avatar: "https://i.pravatar.cc/150?img=3", 
    createdAt: subDays(new Date(), 120).toISOString(),
    active: true
  },
  { 
    id: "3", 
    name: "Camila Costa", 
    email: "camila@doitcoworking.com.br", 
    role: "atendimento", 
    avatar: "https://i.pravatar.cc/150?img=5", 
    createdAt: subDays(new Date(), 60).toISOString(),
    active: true
  },
  { 
    id: "4", 
    name: "Lucas Mendes", 
    email: "lucas@doitcoworking.com.br", 
    role: "diretor", 
    avatar: "https://i.pravatar.cc/150?img=7", 
    createdAt: subDays(new Date(), 200).toISOString(),
    active: true
  },
  { 
    id: "5", 
    name: "Juliana Freitas", 
    email: "juliana@doitcoworking.com.br", 
    role: "admin", 
    avatar: "https://i.pravatar.cc/150?img=9", 
    createdAt: subDays(new Date(), 150).toISOString(),
    active: true
  },
];

// Leads
export const leads: Lead[] = [
  {
    id: "1",
    name: "João Paulo Silva",
    company: "TechSoft Solutions",
    email: "joao@techsoft.com",
    phone: "(91) 98765-4321",
    status: "novo",
    source: "google_ads",
    createdAt: subDays(new Date(), 2).toISOString(),
    updatedAt: subDays(new Date(), 2).toISOString(),
    stage: pipelineStages[0],
    assignedTo: "1",
    notes: "Interessado em sala privativa para equipe de 8 pessoas",
    value: 5500,
    lastContact: subDays(new Date(), 2).toISOString(),
    nextFollowUp: addDays(new Date(), 1).toISOString(),
  },
  {
    id: "2",
    name: "Maria Souza",
    company: "Design Creative",
    email: "maria@designcreative.com",
    phone: "(91) 99876-5432",
    status: "contatado",
    source: "meta_ads",
    createdAt: subDays(new Date(), 5).toISOString(),
    updatedAt: subDays(new Date(), 1).toISOString(),
    stage: pipelineStages[1],
    assignedTo: "3",
    notes: "Precisa de espaço flexível para reuniões semanais",
    value: 2000,
    lastContact: subDays(new Date(), 1).toISOString(),
    nextFollowUp: addDays(new Date(), 2).toISOString(),
  },
  {
    id: "3",
    name: "Pedro Almeida",
    company: "Legal Associados",
    email: "pedro@legalassociados.com",
    phone: "(91) 97654-3210",
    status: "qualificado",
    source: "indicacao",
    createdAt: subDays(new Date(), 10).toISOString(),
    updatedAt: subDays(new Date(), 3).toISOString(),
    stage: pipelineStages[2],
    assignedTo: "1",
    notes: "Procurando espaço para escritório de advocacia com 3 salas",
    value: 8000,
    lastContact: subDays(new Date(), 3).toISOString(),
    nextFollowUp: new Date().toISOString(),
    meetingScheduled: addDays(new Date(), 1).toISOString(),
  },
  {
    id: "4",
    name: "Ana Beatriz",
    email: "ana@gmail.com",
    phone: "(91) 96543-2109",
    status: "proposta",
    source: "site_organico",
    createdAt: subDays(new Date(), 15).toISOString(),
    updatedAt: subDays(new Date(), 2).toISOString(),
    stage: pipelineStages[4],
    assignedTo: "3",
    notes: "Freelancer procurando estação de trabalho flexível",
    value: 750,
    lastContact: subDays(new Date(), 2).toISOString(),
  },
  {
    id: "5",
    name: "Carlos Eduardo",
    company: "Startup Innovation",
    email: "carlos@startupinnovation.com",
    phone: "(91) 95432-1098",
    status: "negociação",
    source: "eventos",
    createdAt: subDays(new Date(), 20).toISOString(),
    updatedAt: subDays(new Date(), 1).toISOString(),
    stage: pipelineStages[5],
    assignedTo: "1",
    notes: "Startup em fase de expansão, precisa de ambiente colaborativo",
    value: 12000,
    lastContact: subDays(new Date(), 1).toISOString(),
    nextFollowUp: addDays(new Date(), 3).toISOString(),
  },
  {
    id: "6",
    name: "Fernanda Lima",
    company: "Marketing Digital",
    email: "fernanda@marketingdigital.com",
    phone: "(91) 94321-0987",
    status: "fechado",
    source: "instagram",
    createdAt: subDays(new Date(), 30).toISOString(),
    updatedAt: new Date().toISOString(),
    stage: pipelineStages[7],
    assignedTo: "2",
    notes: "Fechou contrato para sala privativa pequena",
    value: 3500,
    lastContact: new Date().toISOString(),
  },
  {
    id: "7",
    name: "Roberto Gomes",
    company: "Consultoria Financeira",
    email: "roberto@consultoria.com",
    phone: "(91) 93210-9876",
    status: "perdido",
    source: "google_ads",
    createdAt: subDays(new Date(), 25).toISOString(),
    updatedAt: subDays(new Date(), 5).toISOString(),
    stage: pipelineStages[3],
    assignedTo: "3",
    notes: "Desistiu por valor. Achou caro comparado à concorrência",
    value: 4500,
    lastContact: subDays(new Date(), 5).toISOString(),
  },
];

// Clients
export const clients: Client[] = [
  {
    id: "1",
    name: "Fernanda Lima",
    company: "Marketing Digital Ltda",
    email: "fernanda@marketingdigital.com",
    phone: "(91) 94321-0987",
    address: "Av. Presidente Vargas, 1000, Belém-PA",
    contractStart: subDays(new Date(), 10).toISOString(),
    contractEnd: addDays(new Date(), 355).toISOString(),
    contractValue: 3500,
    plan: "Sala Privativa Pequena",
    status: "ativo",
    createdAt: subDays(new Date(), 10).toISOString(),
    updatedAt: subDays(new Date(), 10).toISOString(),
    assignedTo: "2",
  },
  {
    id: "2",
    name: "Rafael Costa",
    company: "Tech Solutions Belém",
    email: "rafael@techsolutions.com",
    phone: "(91) 98765-5678",
    address: "Tv. WE 16, 500, Belém-PA",
    contractStart: subDays(new Date(), 60).toISOString(),
    contractEnd: addDays(new Date(), 305).toISOString(),
    contractValue: 7500,
    plan: "Sala Privativa Grande",
    status: "ativo",
    createdAt: subDays(new Date(), 60).toISOString(),
    updatedAt: subDays(new Date(), 30).toISOString(),
    notes: "Cliente VIP, sempre paga em dia",
    assignedTo: "1",
  },
  {
    id: "3",
    name: "Mariana Santos",
    company: "Design Studio Criativo",
    email: "mariana@designstudio.com",
    phone: "(91) 97654-4321",
    address: "Av. Nazaré, 350, Belém-PA",
    contractStart: subDays(new Date(), 120).toISOString(),
    contractEnd: addDays(new Date(), 60).toISOString(),
    contractValue: 2800,
    plan: "Estações de Trabalho (4)",
    status: "ativo",
    createdAt: subDays(new Date(), 120).toISOString(),
    updatedAt: subDays(new Date(), 45).toISOString(),
    notes: "Renova a cada 6 meses",
    assignedTo: "3",
  },
  {
    id: "4",
    name: "Gustavo Mendes",
    company: "Arquitetura Moderna",
    email: "gustavo@arquitetura.com",
    phone: "(91) 96543-7890",
    address: "Tv. Djalma Dutra, 200, Belém-PA",
    contractStart: subDays(new Date(), 200).toISOString(),
    contractEnd: subDays(new Date(), 20).toISOString(),
    contractValue: 5000,
    plan: "Sala Privativa Média",
    status: "inativo",
    createdAt: subDays(new Date(), 200).toISOString(),
    updatedAt: subDays(new Date(), 20).toISOString(),
    notes: "Não renovou contrato",
    assignedTo: "2",
  },
  {
    id: "5",
    name: "Patricia Vasconcelos",
    company: "Contabilidade Empresarial",
    email: "patricia@contabilidade.com",
    phone: "(91) 95432-8765",
    address: "Av. Almirante Barroso, 750, Belém-PA",
    contractStart: subDays(new Date(), 45).toISOString(),
    contractEnd: addDays(new Date(), 320).toISOString(),
    contractValue: 4200,
    plan: "Sala Privativa Pequena",
    status: "ativo",
    createdAt: subDays(new Date(), 45).toISOString(),
    updatedAt: subDays(new Date(), 15).toISOString(),
    assignedTo: "1",
  },
];

// Tasks
export const tasks: Task[] = [
  {
    id: "1",
    contactId: "1",
    title: "Ligar para João Paulo",
    description: "Follow-up sobre interesse em sala privativa",
    dueDate: addDays(new Date(), 1).toISOString(),
    priority: "alta",
    status: "pendente",
    assignedTo: "1",
    createdAt: subDays(new Date(), 2).toISOString(),
    updatedAt: subDays(new Date(), 2).toISOString(),
  },
  {
    id: "2",
    contactId: "3",
    title: "Agendar visita com Pedro",
    description: "Mostrar as opções de salas para escritório de advocacia",
    dueDate: new Date().toISOString(),
    priority: "média",
    status: "em_progresso",
    assignedTo: "1",
    createdAt: subDays(new Date(), 3).toISOString(),
    updatedAt: subDays(new Date(), 1).toISOString(),
  },
  {
    id: "3",
    contactId: "4",
    title: "Enviar proposta para Ana",
    description: "Proposta para estação de trabalho flexível",
    dueDate: addDays(new Date(), 2).toISOString(),
    priority: "média",
    status: "pendente",
    assignedTo: "3",
    createdAt: subDays(new Date(), 2).toISOString(),
    updatedAt: subDays(new Date(), 2).toISOString(),
  },
  {
    id: "4",
    contactId: "5",
    title: "Reunião de negociação com Carlos",
    description: "Discutir condições contratuais e descontos",
    dueDate: addDays(new Date(), 3).toISOString(),
    priority: "alta",
    status: "pendente",
    assignedTo: "2",
    createdAt: subDays(new Date(), 1).toISOString(),
    updatedAt: subDays(new Date(), 1).toISOString(),
  },
  {
    id: "5",
    contactId: "3",
    title: "Preparar contrato para Pedro",
    description: "Elaborar contrato para as 3 salas solicitadas",
    dueDate: addDays(new Date(), 5).toISOString(),
    priority: "baixa",
    status: "pendente",
    assignedTo: "2",
    createdAt: subDays(new Date(), 3).toISOString(),
    updatedAt: subDays(new Date(), 3).toISOString(),
  },
  {
    id: "6",
    title: "Reunião de equipe semanal",
    description: "Revisão de metas e resultados da semana",
    dueDate: addDays(new Date(), 2).toISOString(),
    priority: "média",
    status: "pendente",
    assignedTo: "4",
    createdAt: subDays(new Date(), 5).toISOString(),
    updatedAt: subDays(new Date(), 5).toISOString(),
  },
];

// Interactions
export const interactions: Interaction[] = [
  {
    id: "1",
    contactId: "1",
    type: "call",
    date: subDays(new Date(), 2).toISOString(),
    notes: "Expliquei os planos disponíveis. Cliente mostrou interesse em sala para 8 pessoas.",
    createdBy: "1",
    followUpNeeded: true,
    followUpDate: addDays(new Date(), 1).toISOString(),
  },
  {
    id: "2",
    contactId: "2",
    type: "email",
    date: subDays(new Date(), 1).toISOString(),
    notes: "Enviei detalhes dos planos de estações flexíveis. Cliente solicitou mais informações sobre uso de sala de reunião.",
    createdBy: "3",
    followUpNeeded: true,
    followUpDate: addDays(new Date(), 2).toISOString(),
  },
  {
    id: "3",
    contactId: "3",
    type: "meeting",
    date: subDays(new Date(), 3).toISOString(),
    notes: "Reunião presencial. Cliente visitou o espaço e gostou das instalações. Mostrei as salas disponíveis.",
    createdBy: "1",
    followUpNeeded: true,
    followUpDate: new Date().toISOString(),
  },
  {
    id: "4",
    contactId: "4",
    type: "whatsapp",
    date: subDays(new Date(), 2).toISOString(),
    notes: "Cliente perguntou sobre preços para estação individual. Enviei tabela de valores.",
    createdBy: "3",
    followUpNeeded: false,
  },
  {
    id: "5",
    contactId: "5",
    type: "visit",
    date: subDays(new Date(), 1).toISOString(),
    notes: "Cliente visitou o espaço com toda equipe de 12 pessoas. Muito interessados na sala grande do 2º andar.",
    createdBy: "1",
    followUpNeeded: true,
    followUpDate: addDays(new Date(), 3).toISOString(),
  },
];

// Proposals
export const proposals: Proposal[] = [
  {
    id: "1",
    leadId: "4",
    title: "Proposta - Estação de Trabalho Flexível",
    value: 750,
    createdAt: subDays(new Date(), 2).toISOString(),
    expiresAt: addDays(new Date(), 5).toISOString(),
    status: "enviada",
    notes: "Plano mensal com 12 diárias para uso de estação individual",
    products: [
      {
        id: "1-1",
        name: "Plano Flex Mensal",
        quantity: 1,
        unitPrice: 750,
        total: 750
      }
    ]
  },
  {
    id: "2",
    leadId: "5",
    title: "Proposta - Sala Privativa Grande para Startup",
    value: 12000,
    createdAt: subDays(new Date(), 1).toISOString(),
    expiresAt: addDays(new Date(), 7).toISOString(),
    status: "enviada",
    notes: "Sala com capacidade para 15 pessoas + benefícios",
    products: [
      {
        id: "2-1",
        name: "Sala Privativa Grande (15 pessoas)",
        quantity: 1,
        unitPrice: 10000,
        total: 10000
      },
      {
        id: "2-2",
        name: "Pacote 20h/mês Sala de Reunião",
        quantity: 1,
        unitPrice: 1500,
        total: 1500
      },
      {
        id: "2-3",
        name: "Coffee Premium (diário)",
        quantity: 1,
        unitPrice: 500,
        total: 500
      }
    ]
  },
  {
    id: "3",
    leadId: "3",
    title: "Proposta - Salas para Escritório de Advocacia",
    value: 8000,
    createdAt: subDays(new Date(), 5).toISOString(),
    expiresAt: addDays(new Date(), 2).toISOString(),
    status: "visualizada",
    notes: "3 salas conectadas no mesmo andar",
    products: [
      {
        id: "3-1",
        name: "Sala Privativa Pequena",
        quantity: 3,
        unitPrice: 2500,
        total: 7500
      },
      {
        id: "3-2",
        name: "Pacote 5h/mês Auditório",
        quantity: 1,
        unitPrice: 500,
        total: 500
      }
    ]
  }
];

// Dashboard Stats
export const dashboardStats: DashboardStats = {
  newLeads: 12,
  activeClients: 21,
  revenueMTD: 78500,
  leadsConversion: 32,
  pendingTasks: 15,
  upcomingRenewals: 3,
  meetingsScheduled: 8
};

// Chart Data
export const leadsChartData: ChartData = {
  labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
  datasets: [
    {
      label: 'Leads',
      data: [18, 25, 32, 30, 42, 35],
      backgroundColor: 'rgba(99, 102, 241, 0.5)',
      borderColor: 'rgb(99, 102, 241)',
      borderWidth: 1,
    }
  ]
};

export const conversionChartData: ChartData = {
  labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
  datasets: [
    {
      label: 'Taxa de Conversão (%)',
      data: [22, 25, 28, 32, 30, 35],
      backgroundColor: 'rgba(196, 181, 253, 0.5)',
      borderColor: 'rgb(196, 181, 253)',
      borderWidth: 1,
    }
  ]
};

export const revenueChartData: ChartData = {
  labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
  datasets: [
    {
      label: 'Receita (R$)',
      data: [52000, 58000, 65000, 72000, 78000, 85000],
      backgroundColor: 'rgba(165, 180, 252, 0.5)',
      borderColor: 'rgb(165, 180, 252)',
      borderWidth: 1,
    }
  ]
};

export const leadSourceChartData: ChartData = {
  labels: ['Google Ads', 'Meta Ads', 'Instagram', 'Site Orgânico', 'Indicação', 'Eventos'],
  datasets: [
    {
      label: 'Origem dos Leads',
      data: [35, 25, 15, 10, 10, 5],
      backgroundColor: [
        '#4338ca', // Indigo
        '#6366f1', // Indigo/Purple
        '#a5b4fc', // Light indigo
        '#c4b5fd', // Lavender
        '#e0e7ff', // Very light indigo
        '#eef2ff', // Lightest indigo
      ],
    }
  ]
};
