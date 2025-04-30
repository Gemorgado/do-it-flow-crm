
import { Building, Monitor, Calendar, CalendarCheck, MapPin, Users } from "lucide-react";

// Define the plan and service category types
export interface PlanProps {
  title: string;
  description: string;
  icon: any; // Using any since LucideIcon type isn't available in all contexts
  features: string[];
  highlight?: boolean;
}

export interface ServiceCategoryProps {
  title: string;
  description: string;
  icon: any; // Using any since LucideIcon type isn't available in all contexts
  planTypes: PlanProps[];
  availableUnits?: number;
  info?: string;
}

// Service categories with their respective plans
export const getServiceCategories = (availablePrivateRooms: number = 40): ServiceCategoryProps[] => [
  {
    title: "Salas Privativas",
    description: "Espaços exclusivos para sua empresa com toda infraestrutura necessária",
    icon: Building,
    availableUnits: availablePrivateRooms,
    info: "Salas identificadas por números únicos (Sala 101, Sala 102... Sala 140)",
    planTypes: [
      {
        title: "Contrato Mensal",
        icon: Calendar,
        description: "Flexibilidade para seu negócio",
        features: [
          "Acesso 24/7 ao espaço",
          "Preço definido de acordo com o tamanho da sala",
          "Sem compromisso de longo prazo",
          "Mobiliário completo incluso",
          "Internet de alta velocidade"
        ]
      },
      {
        title: "Contrato Anual",
        icon: CalendarCheck,
        description: "Melhor custo-benefício para longo prazo",
        features: [
          "Preço promocional para fidelização",
          "Estabilidade para seu negócio",
          "Personalização do espaço",
          "2 horas gratuitas em salas de reunião por mês",
          "Internet dedicada"
        ],
        highlight: true
      }
    ]
  },
  {
    title: "Estações de Trabalho",
    description: "Posições de trabalho para profissionais autônomos e pequenas equipes",
    icon: Monitor,
    planTypes: [
      {
        title: "Estação Flexível – Mensal",
        icon: Users,
        description: "Trabalhe de onde quiser dentro do espaço",
        features: [
          "Uso livre, sem mesa fixa",
          "Acesso ao espaço em horário comercial",
          "Internet de alta velocidade",
          "Café e água inclusos",
          "Utilização das áreas comuns"
        ]
      },
      {
        title: "Estação Fixa – Mensal",
        icon: MapPin,
        description: "Sua própria mesa permanente",
        features: [
          "Mesa exclusiva",
          "Possibilidade de personalização",
          "Armário com chave",
          "Acesso 24/7 ao espaço",
          "Internet de alta velocidade"
        ],
        highlight: true
      }
    ]
  },
  {
    title: "Endereço Fiscal",
    description: "Utilize nosso endereço comercial para sua empresa",
    icon: Building,
    planTypes: [
      {
        title: "Plano Semestral",
        icon: Calendar,
        description: "6 meses de contrato",
        features: [
          "Endereço comercial para correspondências",
          "Recebimento de correspondências",
          "Notificação por e-mail ao receber correspondências",
          "Utilização do endereço em cartões e materiais"
        ]
      },
      {
        title: "Plano Anual",
        icon: CalendarCheck,
        description: "12 meses de contrato",
        features: [
          "Preço promocional para contrato anual",
          "Endereço comercial para correspondências",
          "Recebimento e armazenamento de correspondências",
          "Notificação por e-mail e/ou Whatsapp",
          "Utilização do endereço em cartões e materiais"
        ],
        highlight: true
      }
    ]
  },
  {
    title: "Salas de Reunião e Auditório",
    description: "Espaços equipados para reuniões, treinamentos e eventos",
    icon: Users,
    planTypes: [
      {
        title: "Uso por Hora",
        icon: Calendar,
        description: "Pague apenas pelo tempo utilizado",
        features: [
          "Reserva sob demanda",
          "Equipamentos audiovisuais inclusos",
          "Capacidade para 2-6 pessoas (sala pequena)",
          "Capacidade para 6-12 pessoas (sala média)",
          "Capacidade para 20-40 pessoas (auditório)"
        ]
      },
      {
        title: "Pacote de Horas",
        icon: CalendarCheck,
        description: "Pacotes pré-pagos com desconto",
        features: [
          "Pacote de 10h/mês",
          "Economia de até 20% em comparação ao uso avulso",
          "Validade de 30 dias",
          "Reserva com prioridade",
          "Controle de consumo por cliente"
        ],
        highlight: true
      }
    ]
  }
];
