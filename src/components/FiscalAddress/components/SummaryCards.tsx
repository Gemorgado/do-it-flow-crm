
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TotalCounts, DelinquencyMetrics } from "../types";

interface SummaryCardsProps {
  counts: TotalCounts;
  delinquency: DelinquencyMetrics;
  expiringCount: number;
}

export const SummaryCards: React.FC<SummaryCardsProps> = ({ 
  counts, 
  delinquency, 
  expiringCount 
}) => {
  // Format number as percentage
  const formatPercent = (value: number) => `${(value * 100).toFixed(1)}%`;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Total de Endereços Fiscais</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{counts.total}</div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Por Periodicidade</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col">
            <div className="flex justify-between">
              <span>Anuais</span>
              <span className="font-bold">{counts.annual}</span>
            </div>
            <div className="flex justify-between">
              <span>Semestrais</span>
              <span className="font-bold">{counts.semiannual}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Inadimplentes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-500">
            {delinquency.delinquent}
            <span className="text-sm text-gray-500 ml-2">
              ({formatPercent(delinquency.rate)})
            </span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">A Vencer em 90 dias</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{expiringCount}</div>
        </CardContent>
      </Card>
    </div>
  );
};
