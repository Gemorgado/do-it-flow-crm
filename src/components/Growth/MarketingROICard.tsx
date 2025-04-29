
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { HelpCircle } from "lucide-react";

interface ROIItem {
  channel: string;
  spend: number;
  revenue: number;
  roi: number;
  leads: number;
  customers: number;
  cpl: number;
  cac: number;
}

interface MarketingROICardProps {
  title: string;
  roiData: ROIItem[];
  className?: string;
}

export function MarketingROICard({ title, roiData, className }: MarketingROICardProps) {
  // Calculate totals
  const totals = roiData.reduce(
    (acc, item) => {
      return {
        spend: acc.spend + item.spend,
        revenue: acc.revenue + item.revenue,
        leads: acc.leads + item.leads,
        customers: acc.customers + item.customers,
      };
    },
    { spend: 0, revenue: 0, leads: 0, customers: 0 }
  );

  const totalROI = Number(((totals.revenue - totals.spend) / totals.spend * 100).toFixed(1));
  const totalCPL = totals.leads > 0 ? Number((totals.spend / totals.leads).toFixed(2)) : 0;
  const totalCAC = totals.customers > 0 ? Number((totals.spend / totals.customers).toFixed(2)) : 0;

  // Calculate maximum ROI for progress bar scaling
  const maxROI = Math.max(...roiData.map(item => item.roi), totalROI);

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-md font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Canal</TableHead>
                <TableHead className="text-right">Investimento</TableHead>
                <TableHead className="text-right">Receita</TableHead>
                <TableHead className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    <span>ROAS</span>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger className="cursor-help">
                          <HelpCircle size={14} className="text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent side="top" className="bg-gray-800 text-white">
                          Retorno sobre Investimento em Publicidade
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </TableHead>
                <TableHead className="text-right">Leads</TableHead>
                <TableHead className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    <span>CPL</span>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger className="cursor-help">
                          <HelpCircle size={14} className="text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent side="top" className="bg-gray-800 text-white">
                          Custo por Lead
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </TableHead>
                <TableHead className="text-right">Clientes</TableHead>
                <TableHead className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    <span>CAC</span>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger className="cursor-help">
                          <HelpCircle size={14} className="text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent side="top" className="bg-gray-800 text-white">
                          Custo de Aquisição de Cliente
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {roiData.map((item, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{item.channel}</TableCell>
                  <TableCell className="text-right">R$ {item.spend.toLocaleString()}</TableCell>
                  <TableCell className="text-right">R$ {item.revenue.toLocaleString()}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Progress 
                        value={(item.roi / maxROI) * 100} 
                        className="h-2 w-16" 
                        indicatorClassName={item.roi >= 200 ? "bg-green-500" : item.roi >= 100 ? "bg-green-300" : "bg-amber-500"}
                      />
                      <span className={`text-sm ${
                        item.roi >= 200 ? "text-green-600" : 
                        item.roi >= 100 ? "text-green-500" : 
                        "text-amber-600"
                      }`}>
                        {item.roi}%
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">{item.leads}</TableCell>
                  <TableCell className="text-right">R$ {item.cpl.toFixed(2)}</TableCell>
                  <TableCell className="text-right">{item.customers}</TableCell>
                  <TableCell className="text-right">R$ {item.cac.toFixed(2)}</TableCell>
                </TableRow>
              ))}
              <TableRow className="bg-muted/50 font-medium">
                <TableCell>TOTAL</TableCell>
                <TableCell className="text-right">R$ {totals.spend.toLocaleString()}</TableCell>
                <TableCell className="text-right">R$ {totals.revenue.toLocaleString()}</TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Progress 
                      value={(totalROI / maxROI) * 100} 
                      className="h-2 w-16" 
                      indicatorClassName={totalROI >= 200 ? "bg-green-500" : totalROI >= 100 ? "bg-green-300" : "bg-amber-500"}
                    />
                    <span className={`text-sm ${
                      totalROI >= 200 ? "text-green-600" : 
                      totalROI >= 100 ? "text-green-500" : 
                      "text-amber-600"
                    }`}>
                      {totalROI}%
                    </span>
                  </div>
                </TableCell>
                <TableCell className="text-right">{totals.leads}</TableCell>
                <TableCell className="text-right">R$ {totalCPL.toFixed(2)}</TableCell>
                <TableCell className="text-right">{totals.customers}</TableCell>
                <TableCell className="text-right">R$ {totalCAC.toFixed(2)}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
