
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
