
import { Button } from "@/components/ui/button";
import { TaskList } from "@/components/Dashboard/TaskList";
import { LeadsList } from "@/components/Dashboard/LeadsList";
import { Task, Lead } from "@/types";

interface TasksLeadsSectionProps {
  tasks: Task[];
  leads: Lead[];
}

export function TasksLeadsSection({ tasks, leads }: TasksLeadsSectionProps) {
  // Filter tasks to show only pending and in progress tasks
  const activeTasks = tasks.filter(task => task.status !== "concluída" && task.status !== "cancelada");
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
      <div className="space-y-6">
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">Tarefas Pendentes</h3>
            <Button variant="outline" size="sm">
              Ver todas
            </Button>
          </div>
          <TaskList tasks={activeTasks} />
        </div>
      </div>
      
      <div className="space-y-6">
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">Leads Recentes</h3>
            <Button variant="outline" size="sm">
              Ver todos
            </Button>
          </div>
          <LeadsList leads={leads} />
        </div>
      </div>
    </div>
  );
}
