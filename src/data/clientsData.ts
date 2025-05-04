
import { Client, ClientService, ServiceType, ServiceStatus } from "@/types";
import { locations } from "./locationsData";

export const clientServices: ClientService[] = [
  {
    id: "srv-001",
    clientId: "1",
    type: "sala_privativa" as ServiceType,
    description: "Sala Privativa 15m² - Plano Anual",
    locationId: "loc-101",
    contractStart: "2024-01-15",
    contractEnd: "2025-01-15",
    value: 3500,
    billingCycle: "mensal",
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
    billingCycle: "mensal",
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
    billingCycle: "mensal",
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
    billingCycle: "mensal",
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
    billingCycle: "mensal",
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
    billingCycle: "mensal",
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
    billingCycle: "mensal",
    status: "cancelado" as ServiceStatus,
    createdAt: "2024-01-25",
    updatedAt: "2024-05-10"
  }
];

export const clients: Client[] = [
  {
    id: "1",
    name: "Empresa XYZ",
    company: "Tecnologia XYZ Ltda",
    email: "contato@xyz.com",
    phone: "11987654321",
    address: "Av. Paulista, 1000",
    services: clientServices.filter(service => service.clientId === "1"),
    status: "ativo",
    createdAt: "2023-12-20",
    updatedAt: "2024-01-15",
    notes: "Cliente desde 2023",
    assignedTo: "1",
    isActive: true
  },
  {
    id: "2",
    name: "Comércio ABC",
    company: "ABC Comércio e Serviços",
    email: "contato@abc.com",
    phone: "11976543210",
    services: clientServices.filter(service => service.clientId === "2"),
    status: "ativo",
    createdAt: "2024-02-28",
    updatedAt: "2024-03-10",
    assignedTo: "2",
    isActive: true
  },
  {
    id: "3",
    name: "Consultoria 123",
    company: "123 Consultoria Empresarial",
    email: "atendimento@123consultoria.com",
    phone: "11965432109",
    address: "Rua Augusta, 500",
    services: clientServices.filter(service => service.clientId === "3"),
    status: "inadimplente",
    createdAt: "2023-10-25",
    updatedAt: "2024-04-10",
    notes: "Pagamento em atraso",
    assignedTo: "3",
    isActive: false
  },
  {
    id: "4",
    name: "Indústria QWE",
    company: "QWE Indústria Alimentícia",
    email: "comercial@qwe.com.br",
    phone: "11954321098",
    services: clientServices.filter(service => service.clientId === "4"),
    status: "ativo",
    createdAt: "2023-08-10",
    updatedAt: "2024-02-15",
    assignedTo: "1",
    isActive: true
  },
  {
    id: "5",
    name: "Serviços RTY",
    company: "RTY Serviços Digitais",
    email: "atendimento@rty.com",
    phone: "11943210987",
    address: "Rua Vergueiro, 1500",
    services: clientServices.filter(service => service.clientId === "5"),
    status: "cancelado",
    createdAt: "2024-01-25",
    updatedAt: "2024-05-10",
    notes: "Cancelou após 3 meses",
    assignedTo: "2",
    isActive: false
  }
];
