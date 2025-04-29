
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface PeriodicitySplitCardProps {
  annual: number;
  semiannual: number;
}

export const PeriodicitySplitCard: React.FC<PeriodicitySplitCardProps> = ({ annual, semiannual }) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">Por Periodicidade</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col">
          <div className="flex justify-between">
            <span>Anuais</span>
            <span className="font-bold">{annual}</span>
          </div>
          <div className="flex justify-between">
            <span>Semestrais</span>
            <span className="font-bold">{semiannual}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
