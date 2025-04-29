
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";

interface FunnelStageProps {
  stage: string;
  count: number;
  conversionRate: number;
  dropoffRate: number;
  isFirst?: boolean;
  isLast?: boolean;
}

const FunnelStage = ({ stage, count, conversionRate, dropoffRate, isFirst, isLast }: FunnelStageProps) => {
  const stageHeight = 50 + (isFirst || isLast ? 0 : 20);
  
  return (
    <div className="relative my-1">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">{stage}</span>
        <span className="text-sm">{count}</span>
      </div>
      <div className="mt-1 h-2 w-full bg-gray-100 rounded-full overflow-hidden">
        <div 
          className="bg-doIt-primary h-2 rounded-full" 
          style={{ width: `${conversionRate}%` }}
        ></div>
      </div>
      <div className="flex justify-between text-xs text-muted-foreground mt-1">
        <span>Conversão: {conversionRate}%</span>
        <span>Drop-off: {dropoffRate}%</span>
      </div>
      {!isLast && (
        <div className="h-6 border-l border-dashed border-gray-300 ml-2 my-1"></div>
      )}
    </div>
  );
};

interface ConversionFunnelCardProps {
  title: string;
  funnelData: FunnelStageProps[];
  className?: string;
}

export function ConversionFunnelCard({ title, funnelData, className }: ConversionFunnelCardProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-md font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-1">
          {funnelData.map((stage, index) => (
            <FunnelStage 
              key={index} 
              {...stage} 
              isFirst={index === 0} 
              isLast={index === funnelData.length - 1} 
            />
          ))}
        </div>
        
        <Separator className="my-4" />
        
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Indicador</TableHead>
              <TableHead className="text-right">Valor</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>Taxa de conversão geral</TableCell>
              <TableCell className="text-right font-medium">
                {Math.round((funnelData[funnelData.length - 1].count / funnelData[0].count) * 100)}%
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Tempo médio de conversão</TableCell>
              <TableCell className="text-right font-medium">14 dias</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Leads ativos</TableCell>
              <TableCell className="text-right font-medium">
                {funnelData.slice(0, -1).reduce((sum, stage) => sum + stage.count, 0)}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
