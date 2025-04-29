import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Building, Monitor, Calendar, CalendarCheck, LucideIcon, MapPin, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface PlanProps {
  title: string;
  description: string;
  icon: LucideIcon;
  features: string[];
  highlight?: boolean;
}

interface ServiceCategoryProps {
  title: string;
  description: string;
  icon: LucideIcon;
  planTypes: PlanProps[];
  availableUnits?: number;
  info?: string;
}

const Plan = ({ title, description, icon: Icon, features, highlight }: PlanProps) => {
  return (
    <Card className={`h-full ${highlight ? "border-doIt-primary" : ""}`}>
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <Icon className="h-5 w-5 text-doIt-primary" />
          <CardTitle className="text-lg">{title}</CardTitle>
        </div>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2 text-sm">
          {features.map((feature, i) => (
            <li key={i} className="flex items-start gap-2">
              <span className="text-doIt-primary text-lg leading-none">•</span>
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};

const ServiceCategory = ({ title, description, icon: Icon, planTypes, availableUnits, info }: ServiceCategoryProps) => {
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Icon className="h-6 w-6 text-doIt-primary" />
          <h2 className="text-2xl font-semibold">{title}</h2>
        </div>
        
        {availableUnits && (
          <Badge variant="outline" className="w-fit">
            {availableUnits} unidades disponíveis
          </Badge>
        )}
      </div>
      
      <p className="text-muted-foreground">{description}</p>
      
      {info && <p className="text-sm italic text-muted-foreground">{info}</p>}
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {planTypes.map((plan, i) => (
          <Plan key={i} {...plan} />
        ))}
      </div>
    </div>
  );
};

export default function PlansAndServices() {
  // Service categories with their respective plans
  const serviceCategories: ServiceCategoryProps[] = [
    {
      title: "Salas Privativas",
      description: "Espaços exclusivos para sua empresa com toda infraestrutura necessária",
      icon: Building,
      availableUnits: 40,
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

  return (
    <div className="animate-fade-in space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Planos e Serviços</h1>
        <p className="text-gray-500">Conheça todas as opções disponíveis em nosso coworking</p>
      </div>
      
      <div className="space-y-12">
        {serviceCategories.map((category, i) => (
          <ServiceCategory key={i} {...category} />
        ))}
      </div>
    </div>
  );
}
