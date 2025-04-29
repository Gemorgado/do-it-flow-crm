
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface DelinquentCardProps {
  count: number;
  rate: number;
}

export const DelinquentCard: React.FC<DelinquentCardProps> = ({ count, rate }) => {
  // Format number as percentage
  const formatPercent = (value: number) => `${(value * 100).toFixed(1)}%`;

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">Inadimplentes</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-red-500">
          {count}
          <span className="text-sm text-gray-500 ml-2">
            ({formatPercent(rate)})
          </span>
        </div>
      </CardContent>
    </Card>
  );
};
