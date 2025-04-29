
import { Button } from "@/components/ui/button";
import { Calendar, DoorClosed } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Schedule() {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto py-6 animate-fade-in">
      <h1 className="text-2xl font-bold mb-6">Agendamentos</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="p-6 bg-white rounded-lg border shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="h-5 w-5 text-doIt-primary" />
            <h2 className="text-lg font-semibold">Agendamentos Gerais</h2>
          </div>
          <p className="text-gray-500 mb-4">Gerencie seus agendamentos com clientes e prospects.</p>
          <Button variant="outline" className="w-full">
            Ver Agendamentos
          </Button>
        </div>
        
        <div className="p-6 bg-white rounded-lg border shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <DoorClosed className="h-5 w-5 text-doIt-primary" />
            <h2 className="text-lg font-semibold">Salas de Reunião e Auditório</h2>
          </div>
          <p className="text-gray-500 mb-4">
            Gerencie reservas e disponibilidade das salas de reunião e auditório.
          </p>
          <Button className="w-full" onClick={() => navigate("/salas-reuniao")}>
            Gerenciar Salas
          </Button>
        </div>
      </div>
    </div>
  );
}
