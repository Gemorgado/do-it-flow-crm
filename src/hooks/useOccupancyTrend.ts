
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";
import { resetOccupancyTrend } from "@/utils/resetOccupancyTrend";

export interface OccupancyTrendItem {
  name: string;
  Salas: number;
  Estações: number;
}

export function useOccupancyTrend(roomOccupancyRate: number, workstationOccupancyRate: number) {
  // Check if local storage has occupancy trend data
  const getStoredTrendData = (): OccupancyTrendItem[] | null => {
    const storedTrendData = localStorage.getItem('occupancy_trend');
    if (storedTrendData) {
      try {
        return JSON.parse(storedTrendData);
      } catch (e) {
        console.error("Error parsing stored trend data:", e);
        return null;
      }
    }
    return null;
  };
  
  // Generate initial trend data if none exists
  const generateInitialTrendData = (): OccupancyTrendItem[] => {
    return [
      { name: "Jan", "Salas": Math.max(60, roomOccupancyRate - 20), "Estações": Math.max(50, workstationOccupancyRate - 20) },
      { name: "Fev", "Salas": Math.max(65, roomOccupancyRate - 15), "Estações": Math.max(55, workstationOccupancyRate - 15) },
      { name: "Mar", "Salas": Math.max(70, roomOccupancyRate - 10), "Estações": Math.max(60, workstationOccupancyRate - 10) },
      { name: "Abr", "Salas": Math.max(75, roomOccupancyRate - 5), "Estações": Math.max(65, workstationOccupancyRate - 5) },
      { name: "Mai", "Salas": roomOccupancyRate, "Estações": workstationOccupancyRate },
      { name: "Jun", "Salas": Math.min(100, roomOccupancyRate + 5), "Estações": Math.min(100, workstationOccupancyRate + 5) },
    ];
  };

  // Get trend data from cache or generate new
  const { data: occupancyOverTimeData = [] } = useQuery({
    queryKey: ["occupancy_trend"],
    queryFn: async () => {
      const storedData = getStoredTrendData();
      if (storedData && storedData.length > 0) {
        return storedData;
      } else {
        const newData = generateInitialTrendData();
        localStorage.setItem('occupancy_trend', JSON.stringify(newData));
        return newData;
      }
    }
  });

  // Handle reset of occupancy trend data
  const handleResetTrend = () => {
    if (window.confirm('Zerar histórico da taxa de ocupação?')) {
      resetOccupancyTrend();
      toast({ 
        title: 'Histórico zerado ✅',
        description: 'Os dados da evolução de ocupação foram resetados'
      });
      // Reload the page to show empty state
      window.location.reload();
    }
  };

  return {
    occupancyOverTimeData,
    handleResetTrend,
    hasData: occupancyOverTimeData && occupancyOverTimeData.length > 0
  };
}
