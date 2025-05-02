
import { Card, CardContent } from "@/components/ui/card";
import { OccupancyFilters } from "./OccupancyFilters";
import { OccupancyChart } from "./OccupancyChart";
import { OccupancyDetailsTable } from "./OccupancyDetailsTable";
import { useOccupancyTrend } from "@/hooks/useOccupancyTrend";
import { resetOccupancyTrend } from "@/utils/resetOccupancyTrend";
import { DateRange } from "react-day-picker";
import { DailyBookingsReportChart } from "./DailyBookingsReportChart";

interface OccupancyReportProps {
  dateRange: DateRange;
}

export function OccupancyReport({ dateRange }: OccupancyReportProps) {
  const { data, isLoading, hasData, refetch } = useOccupancyTrend();
  
  const handleResetTrend = () => {
    resetOccupancyTrend();
    refetch();
  };

  if (isLoading) {
    return <p>Carregando dados de ocupação...</p>;
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <OccupancyChart
          occupancyOverTimeData={data}
          hasData={hasData}
          onResetTrend={handleResetTrend}
        />
        <DailyBookingsReportChart dateRange={dateRange} />
      </div>
      <OccupancyFilters />
      <OccupancyDetailsTable />
    </div>
  );
}
