
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { LineChart } from "@/components/ui/chart";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";

interface LeadsTimeChartProps {
  dailyData: { name: string; Leads: number }[];
  weeklyData: { name: string; Leads: number }[];
  monthlyTotal: number;
}

export function LeadsTimeChart({ dailyData, weeklyData, monthlyTotal }: LeadsTimeChartProps) {
  const [timeView, setTimeView] = useState<"daily" | "weekly">("weekly");

  return (
    <Card className="col-span-2">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Leads dos Últimos 30 Dias</CardTitle>
            <CardDescription>Total: {monthlyTotal} leads</CardDescription>
          </div>
          <Tabs defaultValue="weekly" value={timeView} onValueChange={(value) => setTimeView(value as "daily" | "weekly")}>
            <TabsList className="grid grid-cols-2 w-[200px]">
              <TabsTrigger value="weekly">Semanal</TabsTrigger>
              <TabsTrigger value="daily">Diário</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>
      <CardContent className="pt-2">
        {timeView === "weekly" ? (
          <LineChart 
            className="h-80" 
            data={weeklyData} 
            config={{}}
          />
        ) : (
          <LineChart 
            className="h-80" 
            data={dailyData} 
            config={{}}
          />
        )}
      </CardContent>
    </Card>
  );
}
