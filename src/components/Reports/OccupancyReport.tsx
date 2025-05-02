
import { Card, CardContent } from "@/components/ui/card";
import { OccupancyChart } from "./OccupancyChart";
import { OccupancyDetailsTable } from "./OccupancyDetailsTable";
import { useOccupancyTrend } from "@/hooks/useOccupancyTrend";
import { resetOccupancyTrend } from "@/utils/resetOccupancyTrend";
import { DateRange } from "react-day-picker";
import { DailyBookingsReportChart } from "./DailyBookingsReportChart";
import { OccupancyFilters } from "./OccupancyFilters";
import { useState } from "react";
import { useOccupancyReportData } from "@/hooks/useOccupancyReportData";

export type OccupancyStatus = 'all' | 'high' | 'medium' | 'low';

interface OccupancyReportProps {
  dateRange: DateRange;
}

export function OccupancyReport({ dateRange }: OccupancyReportProps) {
  const { occupancyOverTimeData, hasData } = useOccupancyTrend();
  const [occupancyStatus, setOccupancyStatus] = useState<OccupancyStatus>('all');
  const { filteredOccupancyDetails } = useOccupancyReportData(occupancyStatus);
  
  const handleResetTrend = () => {
    resetOccupancyTrend();
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <OccupancyChart
          occupancyOverTimeData={occupancyOverTimeData}
          hasData={hasData}
          onResetTrend={handleResetTrend}
        />
        <DailyBookingsReportChart dateRange={dateRange} />
      </div>
      <OccupancyFilters 
        occupancyStatus={occupancyStatus} 
        onOccupancyStatusChange={setOccupancyStatus}
      />
      <OccupancyDetailsTable occupancyDetails={filteredOccupancyDetails} />
    </div>
  );
}
