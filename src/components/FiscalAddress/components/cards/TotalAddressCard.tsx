
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface TotalAddressCardProps {
  total: number;
}

export const TotalAddressCard: React.FC<TotalAddressCardProps> = ({ total }) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">Total de Endereços Fiscais</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{total}</div>
      </CardContent>
    </Card>
  );
};
