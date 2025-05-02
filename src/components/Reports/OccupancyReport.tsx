
import { DateRange } from "react-day-picker";
import { CRMMetricsCard } from "@/components/Dashboard/CRMMetricsCard";
import { useOccupancyReportData } from "@/hooks/useOccupancyReportData";
import { useOccupancyTrend } from "@/hooks/useOccupancyTrend";
import { OccupancyChart } from "@/components/Reports/OccupancyChart";
import { OccupancyDetailsTable } from "@/components/Reports/OccupancyDetailsTable";

interface OccupancyReportProps {
  dateRange: DateRange;
}

export function OccupancyReport({ dateRange }: OccupancyReportProps) {
  // Get occupancy data from custom hook
  const { occupancyData, occupancyMetrics, occupancyDetails } = useOccupancyReportData();
  
  // Get trend data from custom hook
  const { occupancyOverTimeData, handleResetTrend, hasData } = useOccupancyTrend(
    occupancyData.roomOccupancyRate,
    occupancyData.workstationOccupancyRate
  );

  return (
    <div className="space-y-6">
      {/* Ocupação atual em números */}
      <CRMMetricsCard 
        title="Ocupação Atual" 
        metrics={occupancyMetrics}
      />

      {/* Gráfico de evolução da ocupação ao longo do tempo */}
      <OccupancyChart 
        occupancyOverTimeData={occupancyOverTimeData}
        hasData={hasData}
        onResetTrend={handleResetTrend}
      />

      {/* Tabela detalhada de ocupação por tipo */}
      <OccupancyDetailsTable 
        occupancyDetails={occupancyDetails} 
        itemsPerPage={3} 
      />
    </div>
  );
}
