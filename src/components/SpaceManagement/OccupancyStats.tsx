
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface OccupancyStatsProps {
  stats: {
    totalSpaces: number;
    occupiedSpaces: number;
    occupancyRate: number;
    availableSpaces: number;
    availableByType: Record<string, number>;
    availableByFloor: Record<string, {
      rooms: number;
      stations: number;
    }>;
  };
}

export function OccupancyStats({ stats }: OccupancyStatsProps) {
  const spaceTypeLabel = {
    sala_privativa: "Salas Privativas",
    estacao: "Estações",
    endereco_fiscal: "Endereços Fiscais"
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Taxa de Ocupação</h3>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-sm text-gray-500">Ocupação</span>
            <span className="font-medium">{stats.occupancyRate}%</span>
          </div>
          <Progress value={stats.occupancyRate} className="h-2" />
          <div className="flex justify-between text-xs text-gray-500">
            <span>0%</span>
            <span>100%</span>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-3">Visão Geral</h3>
        <Card className="bg-gray-50">
          <CardContent className="p-3">
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm">Total de Espaços</span>
                <span className="font-semibold">{stats.totalSpaces}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Espaços Ocupados</span>
                <span className="font-semibold">{stats.occupiedSpaces}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Espaços Disponíveis</span>
                <span className="font-semibold text-green-600">{stats.availableSpaces}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-3">Disponibilidade por Tipo</h3>
        <div className="space-y-3">
          {Object.entries(stats.availableByType)
            .filter(([type]) => type !== "sala_reuniao") // Filtrar para remover salas de reunião
            .map(([type, count]) => (
              <div key={type} className="flex justify-between">
                <span className="text-sm">{spaceTypeLabel[type as keyof typeof spaceTypeLabel]}</span>
                <span className="font-semibold text-green-600">{count} disponível{count > 1 ? "is" : ""}</span>
              </div>
            ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-3">Disponibilidade por Andar</h3>
        <Card className="bg-gray-50">
          <CardContent className="p-3">
            <div className="space-y-4">
              {Object.entries(stats.availableByFloor).map(([floor, counts]) => (
                <div key={floor} className="space-y-2">
                  <div className="font-medium text-base">{floor}º Andar</div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Salas</span>
                      <span className="font-semibold text-green-600">{counts.rooms} sala{counts.rooms !== 1 ? "s" : ""}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Estações</span>
                      <span className="font-semibold text-green-600">{counts.stations} estação{counts.stations !== 1 ? "ões" : ""}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
