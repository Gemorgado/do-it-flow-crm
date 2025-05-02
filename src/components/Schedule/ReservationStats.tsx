
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useReservations } from "@/hooks/useReservations";
import { Resource } from "@/types/schedule";
import { getResourceColor, getResourceLabel } from "./util";
import { parseISO, format, startOfWeek, endOfWeek } from "date-fns";

export function ReservationStats() {
  const { data: reservations = [] } = useReservations();
  
  // Get this week's range
  const today = new Date();
  const weekStart = startOfWeek(today, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(today, { weekStartsOn: 1 });
  
  // Count total reservations per resource
  const resources: Resource[] = ['meet1', 'meet2', 'meet3', 'meet4', 'auditorio'];
  const resourceCounts = resources.reduce((acc, resource) => {
    acc[resource] = 0;
    return acc;
  }, {} as Record<Resource, number>);
  
  // Count this week's reservations
  const weeklyResourceCounts = { ...resourceCounts };
  
  reservations.forEach(r => {
    const reservationDate = parseISO(r.start);
    
    // Count total
    if (r.resource in resourceCounts) {
      resourceCounts[r.resource as Resource]++;
    }
    
    // Count this week
    if (reservationDate >= weekStart && reservationDate <= weekEnd) {
      if (r.resource in weeklyResourceCounts) {
        weeklyResourceCounts[r.resource as Resource]++;
      }
    }
  });
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl">Estatísticas de Uso</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div>
            <h3 className="font-medium mb-2">Total de Reservas</h3>
            <div className="space-y-2">
              {resources.map((resource) => (
                <div key={resource} className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div 
                      className="w-3 h-3 rounded-full mr-2"
                      style={{ backgroundColor: getResourceColor(resource) }}
                    ></div>
                    <span>{getResourceLabel(resource)}</span>
                  </div>
                  <span className="font-medium">{resourceCounts[resource]}</span>
                </div>
              ))}
              <div className="flex justify-between items-center border-t pt-2 mt-2">
                <span className="font-medium">Total Geral</span>
                <span className="font-medium">
                  {Object.values(resourceCounts).reduce((sum, count) => sum + count, 0)}
                </span>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="font-medium mb-2">Reservas desta Semana</h3>
            <div className="text-xs text-muted-foreground mb-2">
              {format(weekStart, "dd/MM/yyyy")} - {format(weekEnd, "dd/MM/yyyy")}
            </div>
            <div className="space-y-2">
              {resources.map((resource) => (
                <div key={`weekly-${resource}`} className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div 
                      className="w-3 h-3 rounded-full mr-2"
                      style={{ backgroundColor: getResourceColor(resource) }}
                    ></div>
                    <span>{getResourceLabel(resource)}</span>
                  </div>
                  <span className="font-medium">{weeklyResourceCounts[resource]}</span>
                </div>
              ))}
              <div className="flex justify-between items-center border-t pt-2 mt-2">
                <span className="font-medium">Total Semanal</span>
                <span className="font-medium">
                  {Object.values(weeklyResourceCounts).reduce((sum, count) => sum + count, 0)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
