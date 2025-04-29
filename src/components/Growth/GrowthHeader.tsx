
import { DateRange } from "react-day-picker";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { trackGTMEvent } from "@/utils/trackingUtils";
import { format } from "date-fns";

interface GrowthHeaderProps {
  dateRange: DateRange;
  onDateRangeChange: (range: DateRange) => void;
}

export function GrowthHeader({ dateRange, onDateRangeChange }: GrowthHeaderProps) {
  const handleDateRangeChange = (range: DateRange) => {
    if (range?.from) {
      onDateRangeChange(range);
      
      // Track date range change
      trackGTMEvent("marketing_date_filter_change", {
        from_date: range.from ? format(range.from, "yyyy-MM-dd") : undefined,
        to_date: range.to ? format(range.to, "yyyy-MM-dd") : undefined,
        days_range: range.from && range.to 
          ? Math.round((range.to.getTime() - range.from.getTime()) / (1000 * 60 * 60 * 24))
          : undefined
      });
    }
  };

  return (
    <div className="flex flex-col md:flex-row justify-between gap-4 items-start">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Growth Dashboard</h1>
        <p className="text-gray-500">Monitore suas campanhas de marketing e analise o ROI</p>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-3">
        <DateRangePicker
          value={dateRange}
          onValueChange={handleDateRangeChange}
          align="end"
        />
        
        <Select defaultValue="all">
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Origem" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas as origens</SelectItem>
            <SelectItem value="google">Google Ads</SelectItem>
            <SelectItem value="meta">Meta Ads</SelectItem>
            <SelectItem value="organic">Orgânico</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
