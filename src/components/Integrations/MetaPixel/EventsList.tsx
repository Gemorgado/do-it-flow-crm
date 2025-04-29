
import { Badge } from "@/components/ui/badge";
import { PixelEvent } from "@/hooks/usePixelIntegration";

interface EventsListProps {
  events: PixelEvent[];
}

export function EventsList({ events }: EventsListProps) {
  return (
    <div>
      <h4 className="text-sm font-medium mb-3">Eventos Rastreados</h4>
      <div className="space-y-3">
        {events.map((event) => (
          <div key={event.name} className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-medium">{event.name}</span>
                {event.custom && (
                  <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-100 text-xs">
                    Personalizado
                  </Badge>
                )}
              </div>
              <p className="text-sm text-gray-500">{event.description}</p>
            </div>
            <div className="text-right">
              <span className="text-sm font-medium">{event.tracked}</span>
              <p className="text-xs text-gray-500">Registros</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
