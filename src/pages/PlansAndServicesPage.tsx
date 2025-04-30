
import { useCatalog } from "@/hooks/useCatalog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlanVariantsTable } from "@/components/PlansAndServices/PlanVariantsTable";
import { PlanBenefitsList } from "@/components/PlansAndServices/PlanBenefitsList";

export default function PlansAndServicesPage() {
  const plans = useCatalog();
  
  return (
    <div className="animate-fade-in space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Planos e Serviços</h1>
        <p className="text-gray-500">Conheça todas as opções disponíveis em nosso coworking</p>
      </div>
      
      <Tabs defaultValue={plans[0].id} className="space-y-4">
        <TabsList>
          {plans.map(p => (
            <TabsTrigger key={p.id} value={p.id}>
              {p.title}
            </TabsTrigger>
          ))}
        </TabsList>
        {plans.map(p => (
          <TabsContent key={p.id} value={p.id} className="space-y-6">
            <PlanVariantsTable plan={p} />
            <PlanBenefitsList benefits={p.benefits} />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
