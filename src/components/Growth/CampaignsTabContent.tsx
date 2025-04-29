
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { CampaignComparisonCard } from "@/components/Growth/CampaignComparisonCard";
import { Badge } from "@/components/ui/badge";

interface CampaignsTabContentProps {
  metaVsGoogleData: any[];
  googleData: any;
  metaData: any;
}

export function CampaignsTabContent({ 
  metaVsGoogleData,
  googleData,
  metaData
}: CampaignsTabContentProps) {
  return (
    <div className="space-y-6">
      <CampaignComparisonCard
        title="Google Ads vs Meta Ads"
        data={metaVsGoogleData}
        googleData={googleData}
        metaData={metaData}
      />
      
      <Card>
        <CardHeader>
          <CardTitle>Desempenho de Campanhas</CardTitle>
          <CardDescription>Métricas detalhadas de cada campanha</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-8">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="font-medium">Campanha A - Google Search</div>
                <Badge variant="secondary" className="font-normal">
                  Ativa
                </Badge>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <div className="text-gray-500">Custo</div>
                  <div>R$ 5.250,00</div>
                </div>
                <div>
                  <div className="text-gray-500">Leads</div>
                  <div>112</div>
                </div>
                <div>
                  <div className="text-gray-500">CPL</div>
                  <div>R$ 46,87</div>
                </div>
                <div>
                  <div className="text-gray-500">CAC</div>
                  <div>R$ 375,00</div>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="font-medium">Campanha B - Facebook Feed</div>
                <Badge variant="secondary" className="font-normal">
                  Ativa
                </Badge>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <div className="text-gray-500">Custo</div>
                  <div>R$ 4.800,00</div>
                </div>
                <div>
                  <div className="text-gray-500">Leads</div>
                  <div>98</div>
                </div>
                <div>
                  <div className="text-gray-500">CPL</div>
                  <div>R$ 48,97</div>
                </div>
                <div>
                  <div className="text-gray-500">CAC</div>
                  <div>R$ 400,00</div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
