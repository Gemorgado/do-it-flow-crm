
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useReservations } from "@/hooks/useReservations";
import { BarChart } from "@/components/ui/chart";
import { eachDayOfInterval, format, parseISO, isWithinInterval } from "date-fns";
import { Resource } from "@/types/schedule";
import { getResourceColor, getResourceLabel } from "@/components/Schedule/util";
import { DateRange } from "react-day-picker";

interface DailyBookingsReportChartProps {
  dateRange: DateRange;
}

export function DailyBookingsReportChart({ dateRange }: DailyBookingsReportChartProps) {
  const { data: reservations = [] } = useReservations();

  // If dates are not selected, return null
  if (!dateRange.from || !dateRange.to) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-xl">Reservas por Período</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-[400px]">
          <p className="text-muted-foreground">Selecione um intervalo de datas para visualizar os dados</p>
        </CardContent>
      </Card>
    );
  }

  // Get days in selected range
  const daysArr = eachDayOfInterval({ start: dateRange.from, end: dateRange.to });
  
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
  
  // Count reservations per day and resource within the date range
  reservations.forEach(r => {
    const reservationDate = parseISO(r.start);
    
    if (dateRange.from && dateRange.to && 
        isWithinInterval(reservationDate, { start: dateRange.from, end: dateRange.to })) {
      const day = format(reservationDate, 'dd/MM');
      if (countsPerDay[day] && countsPerDay[day][r.resource as Resource] !== undefined) {
        countsPerDay[day][r.resource as Resource]++;
      }
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
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl">Reservas por Período</CardTitle>
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
