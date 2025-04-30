
import React from "react";
import { Badge } from "@/components/ui/badge";

interface OccupancyStatsProps {
  stats: {
    totalSpaces: number;
    occupiedSpaces: number;
    occupancyRate: number;
    availableSpaces: number;
    boundSpaces?: number;
    availableByType: Record<string, number>;
    availableByFloor: Record<string, { rooms: number; stations: number }>;
  };
}

export function OccupancyStats({ stats }: OccupancyStatsProps) {
  // Map service types to human-readable names
  const serviceTypeNames = {
    sala_privativa: "Salas Privativas",
    estacao: "Estações de Trabalho",
    sala_reuniao: "Salas de Reunião",
    endereco_fiscal: "Endereços Fiscais"
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Visão Geral</h3>
        
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-sm text-gray-500">Total de espaços</span>
            <span className="font-medium">{stats.totalSpaces}</span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-sm text-gray-500">Ocupados</span>
            <div className="flex items-center">
              <span className="font-medium">{stats.occupiedSpaces}</span>
              {stats.boundSpaces !== undefined && (
                <Badge variant="outline" className="ml-2 text-xs">
                  {stats.boundSpaces} vinculados
                </Badge>
              )}
            </div>
          </div>
          
          <div className="flex justify-between">
            <span className="text-sm text-gray-500">Disponíveis</span>
            <span className="font-medium">{stats.availableSpaces}</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500">Taxa de ocupação</span>
            <div className="flex items-center">
              <div className="w-24 h-2 bg-gray-200 rounded-full mr-2">
                <div 
                  className="h-2 bg-green-500 rounded-full" 
                  style={{ width: `${stats.occupancyRate}%` }}
                />
              </div>
              <span className="font-medium">{stats.occupancyRate}%</span>
            </div>
          </div>
        </div>
      </div>
      
      <div>
        <h3 className="text-lg font-semibold mb-2">Disponibilidade por Tipo</h3>
        
        <div className="space-y-2">
          {Object.entries(stats.availableByType).map(([type, count]) => (
            <div key={type} className="flex justify-between">
              <span className="text-sm text-gray-500">
                {serviceTypeNames[type as keyof typeof serviceTypeNames] || type}
              </span>
              <span className="font-medium">{count}</span>
            </div>
          ))}
          
          {Object.keys(stats.availableByType).length === 0 && (
            <p className="text-sm text-gray-500">Sem dados disponíveis</p>
          )}
        </div>
      </div>
      
      <div>
        <h3 className="text-lg font-semibold mb-2">Disponibilidade por Andar</h3>
        
        <div className="space-y-2">
          {Object.entries(stats.availableByFloor)
            .sort((a, b) => Number(a[0]) - Number(b[0]))
            .map(([floor, data]) => (
              <div key={floor} className="flex justify-between">
                <span className="text-sm text-gray-500">{floor}º Andar</span>
                <span className="font-medium">
                  {data.rooms > 0 && `${data.rooms} sala${data.rooms > 1 ? 's' : ''}`}
                  {data.rooms > 0 && data.stations > 0 && ', '}
                  {data.stations > 0 && `${data.stations} estação${data.stations > 1 ? 'ões' : ''}`}
                </span>
              </div>
            ))}
          
          {Object.keys(stats.availableByFloor).length === 0 && (
            <p className="text-sm text-gray-500">Sem dados disponíveis</p>
          )}
        </div>
      </div>
    </div>
  );
}
