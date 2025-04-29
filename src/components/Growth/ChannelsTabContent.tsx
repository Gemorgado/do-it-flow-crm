
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export function ChannelsTabContent() {
  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Google Ads</CardTitle>
            <CardDescription>Métricas de campanhas do Google</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between">
                <div className="text-sm">Investimento</div>
                <div className="font-medium">R$ 12.500,00</div>
              </div>
              <div className="flex justify-between">
                <div className="text-sm">Leads</div>
                <div className="font-medium">275</div>
              </div>
              <div className="flex justify-between">
                <div className="text-sm">CPL</div>
                <div className="font-medium">R$ 45,45</div>
              </div>
              <div className="flex justify-between">
                <div className="text-sm">Clientes</div>
                <div className="font-medium">32</div>
              </div>
              <div className="flex justify-between">
                <div className="text-sm">CAC</div>
                <div className="font-medium">R$ 390,63</div>
              </div>
              <div className="flex justify-between">
                <div className="text-sm">ROAS</div>
                <div className="font-medium text-green-600">288%</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Meta Ads</CardTitle>
            <CardDescription>Métricas de campanhas do Facebook e Instagram</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between">
                <div className="text-sm">Investimento</div>
                <div className="font-medium">R$ 9.800,00</div>
              </div>
              <div className="flex justify-between">
                <div className="text-sm">Leads</div>
                <div className="font-medium">210</div>
              </div>
              <div className="flex justify-between">
                <div className="text-sm">CPL</div>
                <div className="font-medium">R$ 46,67</div>
              </div>
              <div className="flex justify-between">
                <div className="text-sm">Clientes</div>
                <div className="font-medium">25</div>
              </div>
              <div className="flex justify-between">
                <div className="text-sm">CAC</div>
                <div className="font-medium">R$ 392,00</div>
              </div>
              <div className="flex justify-between">
                <div className="text-sm">ROAS</div>
                <div className="font-medium text-green-600">285%</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
