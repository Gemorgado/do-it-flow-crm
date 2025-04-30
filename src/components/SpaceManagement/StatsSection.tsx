
import React from "react";
import { Card } from "@/components/ui/card";
import { OccupancyStats } from "./OccupancyStats";

interface StatsSectionProps {
  stats: {
    totalSpaces: number;
    occupiedSpaces: number;
    occupancyRate: number;
    availableSpaces: number;
    availableByType: Record<string, number>;
    availableByFloor: Record<string, { rooms: number; stations: number }>;
    boundSpaces: number;
  };
}

export function StatsSection({ stats }: StatsSectionProps) {
  return (
    <Card className="lg:col-span-1 p-4">
      <OccupancyStats stats={stats} />
    </Card>
  );
}
