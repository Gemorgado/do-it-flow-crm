
import { User } from "@/types";
import { Task } from "@/types";

export const users: User[] = [
  {
    id: "1",
    name: "Amanda Silva",
    email: "amanda@doit.com",
    role: "comercial",
    avatar: "/avatars/amanda.png",
    createdAt: "2023-01-10",
    active: true
  },
  {
    id: "2",
    name: "Ricardo Barros",
    email: "ricardo@doit.com",
    role: "comercial",
    avatar: "/avatars/ricardo.png",
    createdAt: "2023-02-15",
    active: true
  },
  {
    id: "3",
    name: "Camila Costa",
    email: "camila@doit.com",
    role: "gerente",
    avatar: "/avatars/camila.png",
    createdAt: "2022-11-05",
    active: true
  },
  {
    id: "4",
    name: "João Oliveira",
    email: "joao@doit.com",
    role: "diretor",
    avatar: "/avatars/joao.png",
    createdAt: "2022-08-20",
    active: true
  }
];

export const tasks: Task[] = [
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
