
import { useEffect, useState } from "react";
import { privateRooms, workstations, meetingRooms } from "@/data/locations";
import { useQuery } from "@tanstack/react-query";

export interface OccupancyData {
  totalRooms: number;
  occupiedRooms: number;
  availableRooms: number;
  roomOccupancyRate: number;
  totalWorkstations: number;
  occupiedWorkstations: number;
  availableWorkstations: number;
  workstationOccupancyRate: number;
}

export interface OccupancyDetails {
  type: string;
  total: number;
  occupied: number;
  available: number;
  occupancyRate: string;
}

export function useOccupancyReportData() {
  // State for storing calculated occupancy data
  const [occupancyData, setOccupancyData] = useState<OccupancyData>({
    totalRooms: 0,
    occupiedRooms: 0,
    availableRooms: 0,
    roomOccupancyRate: 0,
    totalWorkstations: 0,
    occupiedWorkstations: 0,
    availableWorkstations: 0,
    workstationOccupancyRate: 0
  });

  // Calculate occupancy statistics
  useEffect(() => {
    // Calculate room statistics
    const totalRooms = privateRooms.length;
    const availableRooms = privateRooms.filter(room => room.available).length;
    const occupiedRooms = totalRooms - availableRooms;
    const roomOccupancyRate = Math.round((occupiedRooms / totalRooms) * 100);

    // Calculate workstation statistics
    const totalWorkstations = workstations.length;
    const availableWorkstations = workstations.filter(station => station.available).length;
    const occupiedWorkstations = totalWorkstations - availableWorkstations;
    const workstationOccupancyRate = Math.round((occupiedWorkstations / totalWorkstations) * 100);
    
    setOccupancyData({
      totalRooms,
      occupiedRooms,
      availableRooms,
      roomOccupancyRate,
      totalWorkstations,
      occupiedWorkstations,
      availableWorkstations,
      workstationOccupancyRate
    });
  }, []);

  // Generate occupancy metrics from the calculated data
  const occupancyMetrics = [
    { label: "Total de Salas", value: occupancyData.totalRooms.toString(), tooltipText: "Total de salas privativas disponíveis" },
    { label: "Salas Ocupadas", value: occupancyData.occupiedRooms.toString(), tooltipText: "Número de salas com contratos ativos", changeValue: `${occupancyData.roomOccupancyRate}%`, changeDirection: "up" as const },
    { label: "Salas Disponíveis", value: occupancyData.availableRooms.toString(), tooltipText: "Número de salas sem contratos ativos" },
    { label: "Total de Estações", value: occupancyData.totalWorkstations.toString(), tooltipText: "Total de estações de trabalho disponíveis" },
    { label: "Estações Ocupadas", value: occupancyData.occupiedWorkstations.toString(), tooltipText: "Número de estações com contratos ativos", changeValue: `${occupancyData.workstationOccupancyRate}%`, changeDirection: "up" as const },
    { label: "Estações Disponíveis", value: occupancyData.availableWorkstations.toString(), tooltipText: "Número de estações sem contratos ativos" },
  ];

  // Generate detailed occupancy table data
  const generateOccupancyDetails = (): OccupancyDetails[] => {
    // Get real counts for each type
    const privateRoomsTotal = privateRooms.length;
    const privateRoomsOccupied = privateRooms.filter(room => !room.available).length;
    const privateRoomsRate = Math.round((privateRoomsOccupied / privateRoomsTotal) * 100);
    
    const fixedStationsTotal = workstations.filter(ws => ws.identifier.includes("F")).length;
    const fixedStationsOccupied = workstations.filter(ws => ws.identifier.includes("F") && !ws.available).length;
    const fixedStationsRate = Math.round((fixedStationsOccupied / fixedStationsTotal) * 100);
    
    const flexStationsTotal = workstations.filter(ws => !ws.identifier.includes("F")).length;
    const flexStationsOccupied = workstations.filter(ws => !ws.identifier.includes("F") && !ws.available).length;
    const flexStationsRate = Math.round((flexStationsOccupied / flexStationsTotal) * 100);
    
    const meetingRoomsTotal = meetingRooms.length;
    const meetingRoomsOccupied = meetingRooms.filter(room => !room.available).length;
    const meetingRoomsRate = Math.round((meetingRoomsOccupied / meetingRoomsTotal) * 100);
    
    return [
      { type: "Sala Privativa", total: privateRoomsTotal, occupied: privateRoomsOccupied, available: privateRoomsTotal - privateRoomsOccupied, occupancyRate: `${privateRoomsRate}%` },
      { type: "Estação Fixa", total: fixedStationsTotal, occupied: fixedStationsOccupied, available: fixedStationsTotal - fixedStationsOccupied, occupancyRate: `${fixedStationsRate}%` },
      { type: "Estação Flexível", total: flexStationsTotal, occupied: flexStationsOccupied, available: flexStationsTotal - flexStationsOccupied, occupancyRate: `${flexStationsRate}%` },
      { type: "Sala de Reunião", total: meetingRoomsTotal, occupied: meetingRoomsOccupied, available: meetingRoomsTotal - meetingRoomsOccupied, occupancyRate: `${meetingRoomsRate}%` },
    ];
  };

  const occupancyDetails = generateOccupancyDetails();

  return {
    occupancyData,
    occupancyMetrics,
    occupancyDetails
  };
}
