
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DateRange } from "react-day-picker";
import { subDays } from "date-fns";
import { DateRangePicker } from "@/components/ui/date-range-picker";

// Import report components
import { OccupancyReport } from "@/components/Reports/OccupancyReport";
import { ContractsReport } from "@/components/Reports/ContractsReport";
import { RevenueReport } from "@/components/Reports/RevenueReport";
import { AnalyticsOverview } from "@/components/Reports/AnalyticsOverview";

export default function GrowthReports() {
  // Initialize date range to last 30 days
  const [dateRange, setDateRange] = useState<DateRange>({
    from: subDays(new Date(), 30),
    to: new Date()
  });

  const handleDateRangeChange = (range: DateRange) => {
    setDateRange(range);
  };

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Relatórios</h1>
          <p className="text-gray-500">Análise detalhada de ocupação, contratos e receitas com dados reais</p>
        </div>
        <DateRangePicker
          value={dateRange}
          onValueChange={handleDateRangeChange}
          align="end"
        />
      </div>
      
      <Tabs defaultValue="occupancy" className="space-y-6">
        <TabsList className="mb-4">
          <TabsTrigger value="occupancy">Ocupação</TabsTrigger>
          <TabsTrigger value="contracts">Contratos</TabsTrigger>
          <TabsTrigger value="revenue">Receita</TabsTrigger>
          <TabsTrigger value="analytics">Análise</TabsTrigger>
        </TabsList>
        
        <TabsContent value="occupancy" className="space-y-6">
          <OccupancyReport dateRange={dateRange} />
        </TabsContent>
        
        <TabsContent value="contracts" className="space-y-6">
          <ContractsReport dateRange={dateRange} />
        </TabsContent>
        
        <TabsContent value="revenue" className="space-y-6">
          <RevenueReport dateRange={dateRange} />
        </TabsContent>
        
        <TabsContent value="analytics" className="space-y-6">
          <AnalyticsOverview dateRange={dateRange} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
