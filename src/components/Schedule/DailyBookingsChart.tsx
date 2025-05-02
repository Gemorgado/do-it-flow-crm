
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useReservations } from "@/hooks/useReservations";
import { BarChart } from "@/components/ui/chart";
import { eachDayOfInterval, format, parseISO, subDays } from "date-fns";
import { Resource } from "@/types/schedule";
import { getResourceColor, getResourceLabel } from "./util";

export function DailyBookingsChart() {
  const { data: reservations = [] } = useReservations();

  // Get last 7 days
  const today = new Date();
  const from = subDays(today, 6);
  const daysArr = eachDayOfInterval({ start: from, end: today });
  
  // Initialize counts per day
  const countsPerDay: Record<string, Record<Resource, number>> = {};
  daysArr.forEach(d => {
    const dayKey = format(d, 'dd/MM');
    countsPerDay[dayKey] = {
      meet1: 0,
      meet2: 0,
      meet3: 0,
      meet4: 0,
      auditorio: 0
    };
  });
  
  // Count reservations per day and resource
  reservations.forEach(r => {
    const day = format(parseISO(r.start), 'dd/MM');
    if (countsPerDay[day] && countsPerDay[day][r.resource as Resource] !== undefined) {
      countsPerDay[day][r.resource as Resource]++;
    }
  });
  
  // Format data for chart
  const labels = daysArr.map(d => format(d, 'dd/MM'));
  
  const resources: Resource[] = ['meet1', 'meet2', 'meet3', 'meet4', 'auditorio'];
  
  // Fix: Convert to the format expected by the BarChart component
  const chartData = [
    {
      labels: labels,
      datasets: resources.map(resource => ({
        label: getResourceLabel(resource),
        data: labels.map(label => countsPerDay[label][resource]),
        backgroundColor: getResourceColor(resource),
        borderColor: getResourceColor(resource),
      }))
    }
  ];
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl">Reservas Diárias por Recurso</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[400px]">
          <BarChart 
            data={chartData} 
            config={{
              meet1: { color: getResourceColor('meet1') },
              meet2: { color: getResourceColor('meet2') },
              meet3: { color: getResourceColor('meet3') },
              meet4: { color: getResourceColor('meet4') },
              auditorio: { color: getResourceColor('auditorio') }
            }}
          />
        </div>
      </CardContent>
    </Card>
  );
}
