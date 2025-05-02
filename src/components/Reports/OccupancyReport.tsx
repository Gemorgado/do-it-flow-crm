
import { DateRange } from "react-day-picker";
import { CRMMetricsCard } from "@/components/Dashboard/CRMMetricsCard";
import { useOccupancyReportData } from "@/hooks/useOccupancyReportData";
import { useOccupancyTrend } from "@/hooks/useOccupancyTrend";
import { OccupancyChart } from "@/components/Reports/OccupancyChart";
import { OccupancyDetailsTable } from "@/components/Reports/OccupancyDetailsTable";
import { OccupancyFilters } from "@/components/Reports/OccupancyFilters";
import { useState } from "react";

interface OccupancyReportProps {
  dateRange: DateRange;
}

export type OccupancyStatus = "all" | "high" | "medium" | "low";

export function OccupancyReport({ dateRange }: OccupancyReportProps) {
  // Filter state
  const [occupancyStatus, setOccupancyStatus] = useState<OccupancyStatus>("all");
  
  // Get occupancy data from custom hook
  const { occupancyData, occupancyMetrics, occupancyDetails } = useOccupancyReportData();
  
  // Get trend data from custom hook
  const { occupancyOverTimeData, handleResetTrend, hasData } = useOccupancyTrend(
    occupancyData.roomOccupancyRate,
    occupancyData.workstationOccupancyRate
  );

  // Filter occupancy details based on selected status
  const filteredOccupancyDetails = occupancyDetails.filter(item => {
    const occupancyRate = parseInt(item.occupancyRate);
    
    if (occupancyStatus === "all") return true;
    if (occupancyStatus === "high" && occupancyRate >= 70) return true;
    if (occupancyStatus === "medium" && occupancyRate >= 40 && occupancyRate < 70) return true;
    if (occupancyStatus === "low" && occupancyRate < 40) return true;
    
    return false;
  });

  return (
    <div className="space-y-6">
      {/* Filters */}
      <OccupancyFilters 
        occupancyStatus={occupancyStatus} 
        onOccupancyStatusChange={setOccupancyStatus} 
      />
      
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
        occupancyDetails={filteredOccupancyDetails} 
        itemsPerPage={3} 
      />
    </div>
  );
}
