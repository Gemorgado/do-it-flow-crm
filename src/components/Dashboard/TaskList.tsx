
import { Task } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { formatDistanceToNow, isPast, isToday, isTomorrow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { users } from "@/data/mockData";
import { ReactNode } from "react";

interface TaskListProps {
  tasks: Task[];
  className?: string;
}

function getStatusColor(status: Task["status"]): string {
  switch (status) {
    case "pendente":
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "em_progresso":
      return "bg-blue-100 text-blue-800 border-blue-200";
    case "concluída":
      return "bg-green-100 text-green-800 border-green-200";
    case "cancelada":
      return "bg-gray-100 text-gray-800 border-gray-200";
    default:
      return "bg-gray-100 text-gray-800";
  }
}

function getPriorityColor(priority: Task["priority"]): string {
  switch (priority) {
    case "alta":
      return "bg-red-100 text-red-800 border-red-200";
    case "média":
      return "bg-amber-100 text-amber-800 border-amber-200";
    case "baixa":
      return "bg-green-100 text-green-800 border-green-200";
    default:
      return "bg-gray-100 text-gray-800";
  }
}

function formatDate(dateString: string): ReactNode {
  const date = new Date(dateString);

  if (isPast(date) && !isToday(date)) {
    return <span className="text-red-500 font-medium">Atrasado</span>;
  }
  
  if (isToday(date)) {
    return <span className="text-amber-500 font-medium">Hoje</span>;
  }
  
  if (isTomorrow(date)) {
    return <span className="text-emerald-500 font-medium">Amanhã</span>;
  }
  
  return formatDistanceToNow(date, { addSuffix: true, locale: ptBR });
}

function getAssignedToName(assignedTo: string): string {
  const user = users.find(user => user.id === assignedTo);
  return user ? user.name : "Não atribuído";
}

export function TaskList({ tasks, className = "" }: TaskListProps) {
  return (
    <div className={`space-y-4 ${className}`}>
      {tasks.map((task) => (
        <div key={task.id} className="flex items-start p-3 bg-white border rounded-md shadow-sm">
          <Checkbox 
            id={`task-${task.id}`} 
            className="mt-1 mr-3"
            disabled={task.status === "cancelada" || task.status === "concluída"} 
          />
          <div className="flex-1">
            <div className="flex gap-2 flex-wrap">
              <h4 className="font-medium">{task.title}</h4>
              <Badge variant="outline" className={getPriorityColor(task.priority)}>
                {task.priority === "alta" ? "Alta" : task.priority === "média" ? "Média" : "Baixa"}
              </Badge>
              <Badge variant="outline" className={getStatusColor(task.status)}>
                {task.status === "pendente" 
                  ? "Pendente" 
                  : task.status === "em_progresso" 
                    ? "Em Progresso" 
                    : task.status === "concluída" 
                      ? "Concluída" 
                      : "Cancelada"}
              </Badge>
            </div>
            {task.description && (
              <p className="text-sm text-gray-600 mt-1">{task.description}</p>
            )}
            <div className="flex justify-between mt-2 text-xs text-gray-500">
              <span>Responsável: {getAssignedToName(task.assignedTo)}</span>
              <span>{formatDate(task.dueDate)}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
