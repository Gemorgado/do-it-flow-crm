
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
  };
}

export function OccupancyStats({ stats }: OccupancyStatsProps) {
  const spaceTypeLabel = {
    sala_privativa: "Salas Privativas",
    estacao: "Estações",
    sala_reuniao: "Salas de Reunião",
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
          {Object.entries(stats.availableByType).map(([type, count]) => (
            <div key={type} className="flex justify-between">
              <span className="text-sm">{spaceTypeLabel[type as keyof typeof spaceTypeLabel]}</span>
              <span className="font-semibold text-green-600">{count} disponível{count > 1 ? "is" : ""}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
