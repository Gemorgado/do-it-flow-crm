
import { useState, useEffect } from "react";
import { OccupancyStatus } from "@/components/Reports/OccupancyReport";

export interface OccupancyDetails {
  type: string;
  total: number;
  occupied: number;
  available: number;
  occupancyRate: string;
}

// Mock data for occupancy details
const mockOccupancyDetails: OccupancyDetails[] = [
  {
    type: "Sala de Reunião",
    total: 5,
    occupied: 3,
    available: 2,
    occupancyRate: "60%"
  },
  {
    type: "Estação de Trabalho",
    total: 30,
    occupied: 25,
    available: 5,
    occupancyRate: "83%"
  },
  {
    type: "Escritório Privativo",
    total: 12,
    occupied: 10,
    available: 2,
    occupancyRate: "83%"
  },
  {
    type: "Sala Compartilhada",
    total: 8,
    occupied: 2,
    available: 6,
    occupancyRate: "25%"
  }
];

export function useOccupancyReportData(status: OccupancyStatus = 'all') {
  const [filteredOccupancyDetails, setFilteredOccupancyDetails] = useState<OccupancyDetails[]>(mockOccupancyDetails);
  
  useEffect(() => {
    if (status === 'all') {
      setFilteredOccupancyDetails(mockOccupancyDetails);
      return;
    }
    
    const filtered = mockOccupancyDetails.filter(item => {
      const rate = parseInt(item.occupancyRate);
      
      if (status === 'high') return rate >= 70;
      if (status === 'medium') return rate >= 40 && rate < 70;
      if (status === 'low') return rate < 40;
      
      return true;
    });
    
    setFilteredOccupancyDetails(filtered);
  }, [status]);
  
  return { filteredOccupancyDetails };
}
