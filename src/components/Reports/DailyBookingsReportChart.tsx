
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useReservations } from "@/hooks/useReservations";
import { BarChart } from "@/components/ui/chart";
import { DateRange } from "react-day-picker";
import { eachDayOfInterval, format, parseISO, subDays } from "date-fns";
import { Resource } from "@/types/schedule";
import { getResourceColor, getResourceLabel } from "@/components/Schedule/util";

interface DailyBookingsReportChartProps {
  dateRange?: DateRange;
}

export function DailyBookingsReportChart({ dateRange }: DailyBookingsReportChartProps) {
  const { data: reservations = [] } = useReservations();

  // Get date range or last 7 days if not provided
  const today = new Date();
  const from = dateRange?.from || subDays(today, 6);
  const to = dateRange?.to || today;
  const daysArr = eachDayOfInterval({ start: from, end: to });
  
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
  
  // Filter and count reservations by date range
  const filteredReservations = dateRange
    ? reservations.filter(r => {
        const date = parseISO(r.start);
        return (
          (!dateRange.from || date >= dateRange.from) &&
          (!dateRange.to || date <= dateRange.to)
        );
      })
    : reservations;
  
  // Count reservations per day and resource
  filteredReservations.forEach(r => {
    const day = format(parseISO(r.start), 'dd/MM');
    if (countsPerDay[day] && countsPerDay[day][r.resource as Resource] !== undefined) {
      countsPerDay[day][r.resource as Resource]++;
    }
  });
  
  // Format data for chart
  const labels = daysArr.map(d => format(d, 'dd/MM'));
  
  const resources: Resource[] = ['meet1', 'meet2', 'meet3', 'meet4', 'auditorio'];
  
  const chartData = {
    labels: labels,
    datasets: resources.map(resource => ({
      label: getResourceLabel(resource),
      data: labels.map(label => countsPerDay[label][resource]),
      backgroundColor: getResourceColor(resource),
      borderColor: getResourceColor(resource),
    }))
  };
  
  return (
    <Card className="w-full h-full">
      <CardHeader>
        <CardTitle className="text-xl">Reservas Diárias por Recurso</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[400px]">
          <BarChart 
            data={[chartData]} 
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
