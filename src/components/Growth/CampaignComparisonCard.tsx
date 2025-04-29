
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart } from "@/components/ui/chart";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

interface CampaignComparisonCardProps {
  title: string;
  description?: string;
  data: any[];
  className?: string;
}

export function CampaignComparisonCard({ 
  title, 
  description, 
  data, 
  className 
}: CampaignComparisonCardProps) {
  const [view, setView] = useState<"chart" | "table">("chart");
  
  // Define empty config object for charts
  const chartConfig = {};
  
  // Calculate metrics for the table summary
  const metrics = {
    google: {
      clicks: 8742,
      impressions: 187654,
      ctr: 4.66,
      cpc: 2.34,
      conversions: 325,
      convRate: 3.72,
      cost: 20456.28
    },
    meta: {
      clicks: 10543,
      impressions: 312456,
      ctr: 3.37,
      cpc: 1.87,
      conversions: 278,
      convRate: 2.64,
      cost: 19715.41
    }
  };

  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle className="text-md font-medium">
            {title}
          </CardTitle>
          {description && (
            <p className="text-xs text-muted-foreground">{description}</p>
          )}
        </div>
        <div>
          <TabsList className="grid grid-cols-2 h-8 w-32">
            <TabsTrigger value="chart" onClick={() => setView("chart")}>Gráfico</TabsTrigger>
            <TabsTrigger value="table" onClick={() => setView("table")}>Tabela</TabsTrigger>
          </TabsList>
        </div>
      </CardHeader>
      <CardContent>
        {view === "chart" ? (
          <BarChart
            className="h-72"
            data={data}
            config={chartConfig}
          />
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Métrica</TableHead>
                  <TableHead>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                      <span>Google Ads</span>
                    </div>
                  </TableHead>
                  <TableHead>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-indigo-500"></div>
                      <span>Meta Ads</span>
                    </div>
                  </TableHead>
                  <TableHead>Comparação</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">Cliques</TableCell>
                  <TableCell>{metrics.google.clicks.toLocaleString()}</TableCell>
                  <TableCell>{metrics.meta.clicks.toLocaleString()}</TableCell>
                  <TableCell>
                    <ComparisonBadge 
                      value={((metrics.meta.clicks - metrics.google.clicks) / metrics.google.clicks * 100)}
                      higherIsBetter={true}
                    />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Impressões</TableCell>
                  <TableCell>{metrics.google.impressions.toLocaleString()}</TableCell>
                  <TableCell>{metrics.meta.impressions.toLocaleString()}</TableCell>
                  <TableCell>
                    <ComparisonBadge 
                      value={((metrics.meta.impressions - metrics.google.impressions) / metrics.google.impressions * 100)}
                      higherIsBetter={true}
                    />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">CTR</TableCell>
                  <TableCell>{metrics.google.ctr.toFixed(2)}%</TableCell>
                  <TableCell>{metrics.meta.ctr.toFixed(2)}%</TableCell>
                  <TableCell>
                    <ComparisonBadge 
                      value={((metrics.meta.ctr - metrics.google.ctr) / metrics.google.ctr * 100)}
                      higherIsBetter={true}
                    />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">CPC Médio</TableCell>
                  <TableCell>R$ {metrics.google.cpc.toFixed(2)}</TableCell>
                  <TableCell>R$ {metrics.meta.cpc.toFixed(2)}</TableCell>
                  <TableCell>
                    <ComparisonBadge 
                      value={((metrics.meta.cpc - metrics.google.cpc) / metrics.google.cpc * 100)}
                      higherIsBetter={false}
                    />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Conversões</TableCell>
                  <TableCell>{metrics.google.conversions}</TableCell>
                  <TableCell>{metrics.meta.conversions}</TableCell>
                  <TableCell>
                    <ComparisonBadge 
                      value={((metrics.meta.conversions - metrics.google.conversions) / metrics.google.conversions * 100)}
                      higherIsBetter={true}
                    />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Taxa de Conversão</TableCell>
                  <TableCell>{metrics.google.convRate.toFixed(2)}%</TableCell>
                  <TableCell>{metrics.meta.convRate.toFixed(2)}%</TableCell>
                  <TableCell>
                    <ComparisonBadge 
                      value={((metrics.meta.convRate - metrics.google.convRate) / metrics.google.convRate * 100)}
                      higherIsBetter={true}
                    />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Custo Total</TableCell>
                  <TableCell>R$ {metrics.google.cost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</TableCell>
                  <TableCell>R$ {metrics.meta.cost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</TableCell>
                  <TableCell>
                    <ComparisonBadge 
                      value={((metrics.meta.cost - metrics.google.cost) / metrics.google.cost * 100)}
                      higherIsBetter={false}
                    />
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

interface ComparisonBadgeProps {
  value: number;
  higherIsBetter: boolean;
}

function ComparisonBadge({ value, higherIsBetter }: ComparisonBadgeProps) {
  const isPositive = value > 0;
  const isGood = (isPositive && higherIsBetter) || (!isPositive && !higherIsBetter);
  
  return (
    <Badge variant="outline" className={`
      ${isGood 
        ? "bg-green-50 text-green-700 border-green-200" 
        : "bg-red-50 text-red-700 border-red-200"
      }
    `}>
      {isPositive ? '+' : ''}{value.toFixed(1)}%
    </Badge>
  );
}
