
import { useState } from "react";
import { useCatalog } from "@/hooks/useCatalog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlanVariantsTable } from "@/components/PlansAndServices/PlanVariantsTable";
import { PlanBenefitsList } from "@/components/PlansAndServices/PlanBenefitsList";
import { Button } from "@/components/ui/button";
import { Edit, Save } from "lucide-react";
import { Plan, Variant } from "@/integrations/catalog/types";
import { toast } from "sonner";

export default function PlansAndServicesPage() {
  const catalogData = useCatalog();
  const [plans, setPlans] = useState<Plan[]>(catalogData);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState(plans[0]?.id || "");
  
  const handleSave = () => {
    // In a real application, this would save to a database or API
    toast.success("Alterações salvas com sucesso!");
    setIsEditing(false);
  };
  
  const updatePlan = (updatedPlan: Plan) => {
    setPlans(plans.map(p => p.id === updatedPlan.id ? updatedPlan : p));
  };
  
  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Planos e Serviços</h1>
          <p className="text-gray-500">Conheça todas as opções disponíveis em nosso coworking</p>
        </div>
        <div>
          {isEditing ? (
            <Button onClick={handleSave} variant="default">
              <Save className="mr-2 h-4 w-4" />
              Salvar Alterações
            </Button>
          ) : (
            <Button onClick={() => setIsEditing(true)} variant="outline">
              <Edit className="mr-2 h-4 w-4" />
              Editar Planos
            </Button>
          )}
        </div>
      </div>
      
      <Tabs 
        value={activeTab} 
        onValueChange={setActiveTab}
        className="space-y-4"
      >
        <TabsList>
          {plans.map(p => (
            <TabsTrigger key={p.id} value={p.id}>
              {p.title}
            </TabsTrigger>
          ))}
        </TabsList>
        {plans.map(p => (
          <TabsContent key={p.id} value={p.id} className="space-y-6">
            <PlanVariantsTable 
              plan={p} 
              isEditing={isEditing} 
              onUpdate={(variants) => {
                const updatedPlan = { ...p, variants };
                updatePlan(updatedPlan);
              }} 
            />
            <PlanBenefitsList 
              benefits={p.benefits} 
              isEditing={isEditing}
              onUpdate={(benefits) => {
                const updatedPlan = { ...p, benefits };
                updatePlan(updatedPlan);
              }}
            />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
