
import { OccupancyStatus } from "./OccupancyReport";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Filter } from "lucide-react";

interface OccupancyFiltersProps {
  occupancyStatus: OccupancyStatus;
  onOccupancyStatusChange: (status: OccupancyStatus) => void;
}

export function OccupancyFilters({ 
  occupancyStatus, 
  onOccupancyStatusChange 
}: OccupancyFiltersProps) {
  
  const handleOccupancyStatusChange = (value: string) => {
    onOccupancyStatusChange(value as OccupancyStatus);
  };

  return (
    <Card className="p-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium">Filtros</span>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full sm:w-auto">
          <div className="flex flex-col gap-1">
            <label htmlFor="occupancy-status" className="text-sm text-muted-foreground">
              Status de Ocupação
            </label>
            <Select 
              value={occupancyStatus} 
              onValueChange={handleOccupancyStatusChange}
            >
              <SelectTrigger id="occupancy-status" className="w-[180px]">
                <SelectValue placeholder="Selecionar status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="high">Alta Ocupação (≥70%)</SelectItem>
                <SelectItem value="medium">Média Ocupação (40-69%)</SelectItem>
                <SelectItem value="low">Baixa Ocupação (<40%)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </Card>
  );
}
