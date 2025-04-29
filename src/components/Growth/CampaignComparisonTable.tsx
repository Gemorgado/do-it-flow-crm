
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ComparisonBadge } from "./ComparisonBadge";

interface CampaignMetrics {
  clicks: number;
  impressions: number;
  ctr: number;
  cpc: number;
  conversions: number;
  convRate: number;
  cost: number;
}

interface CampaignComparisonTableProps {
  googleMetrics: CampaignMetrics;
  metaMetrics: CampaignMetrics;
}

export function CampaignComparisonTable({ googleMetrics, metaMetrics }: CampaignComparisonTableProps) {
  return (
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
            <TableCell>{googleMetrics.clicks.toLocaleString()}</TableCell>
            <TableCell>{metaMetrics.clicks.toLocaleString()}</TableCell>
            <TableCell>
              <ComparisonBadge 
                value={((metaMetrics.clicks - googleMetrics.clicks) / googleMetrics.clicks * 100)}
                higherIsBetter={true}
              />
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">Impressões</TableCell>
            <TableCell>{googleMetrics.impressions.toLocaleString()}</TableCell>
            <TableCell>{metaMetrics.impressions.toLocaleString()}</TableCell>
            <TableCell>
              <ComparisonBadge 
                value={((metaMetrics.impressions - googleMetrics.impressions) / googleMetrics.impressions * 100)}
                higherIsBetter={true}
              />
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">CTR</TableCell>
            <TableCell>{googleMetrics.ctr.toFixed(2)}%</TableCell>
            <TableCell>{metaMetrics.ctr.toFixed(2)}%</TableCell>
            <TableCell>
              <ComparisonBadge 
                value={((metaMetrics.ctr - googleMetrics.ctr) / googleMetrics.ctr * 100)}
                higherIsBetter={true}
              />
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">CPC Médio</TableCell>
            <TableCell>R$ {googleMetrics.cpc.toFixed(2)}</TableCell>
            <TableCell>R$ {metaMetrics.cpc.toFixed(2)}</TableCell>
            <TableCell>
              <ComparisonBadge 
                value={((metaMetrics.cpc - googleMetrics.cpc) / googleMetrics.cpc * 100)}
                higherIsBetter={false}
              />
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">Conversões</TableCell>
            <TableCell>{googleMetrics.conversions}</TableCell>
            <TableCell>{metaMetrics.conversions}</TableCell>
            <TableCell>
              <ComparisonBadge 
                value={((metaMetrics.conversions - googleMetrics.conversions) / googleMetrics.conversions * 100)}
                higherIsBetter={true}
              />
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">Taxa de Conversão</TableCell>
            <TableCell>{googleMetrics.convRate.toFixed(2)}%</TableCell>
            <TableCell>{metaMetrics.convRate.toFixed(2)}%</TableCell>
            <TableCell>
              <ComparisonBadge 
                value={((metaMetrics.convRate - googleMetrics.convRate) / googleMetrics.convRate * 100)}
                higherIsBetter={true}
              />
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">Custo Total</TableCell>
            <TableCell>R$ {googleMetrics.cost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</TableCell>
            <TableCell>R$ {metaMetrics.cost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</TableCell>
            <TableCell>
              <ComparisonBadge 
                value={((metaMetrics.cost - googleMetrics.cost) / googleMetrics.cost * 100)}
                higherIsBetter={false}
              />
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
}
