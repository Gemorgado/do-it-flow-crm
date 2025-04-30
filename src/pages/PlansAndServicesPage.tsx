
import { useCatalog } from "@/hooks/useCatalog";
import { useSpaceStats } from "@/hooks/conexaData";
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from "@/components/ui/accordion";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { locations } from "@/data/locations";
import { useOccupancyStats } from "@/hooks/useOccupancyStats";
import { useSpaceBindings } from "@/hooks/useSpaceBindings";

export default function PlansAndServicesPage() {
  const plans = useCatalog();
  const spaceStats = useSpaceStats();
  const { data: spaceBindings = [] } = useSpaceBindings();
  const occupancyStats = useOccupancyStats(locations, spaceBindings);
  
  return (
    <div className="animate-fade-in space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Planos e Serviços</h1>
        <p className="text-muted-foreground">Catálogo 2025 de serviços e resumo de ocupação</p>
      </div>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <h3 className="text-lg font-medium">Salas Privativas</h3>
              <div className="mt-2 flex items-center justify-center gap-2">
                <span className="text-3xl font-bold">{spaceStats.privateRooms}</span>
                <span className="text-muted-foreground text-sm">ocupadas</span>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                Total disponível: {occupancyStats.availableByType?.sala_privativa || 0}
              </p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <h3 className="text-lg font-medium">Salas de Reunião</h3>
              <div className="mt-2 flex items-center justify-center gap-2">
                <span className="text-3xl font-bold">{spaceStats.meetingRooms}</span>
                <span className="text-muted-foreground text-sm">salas</span>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                Capacidade total: {spaceStats.totalCapacity} lugares
              </p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <h3 className="text-lg font-medium">Estações de Trabalho</h3>
              <div className="mt-2 flex items-center justify-center gap-2">
                <span className="text-3xl font-bold">
                  {spaceStats.workstations.total}
                </span>
                <span className="text-muted-foreground text-sm">ocupadas</span>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                {spaceStats.workstations.flex} flex / {spaceStats.workstations.fixed} fixas
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Plans Accordion */}
      <Accordion type="single" collapsible className="w-full">
        {plans.map((plan) => (
          <AccordionItem key={plan.id} value={plan.id}>
            <AccordionTrigger className="text-xl font-medium">
              {plan.title}
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4">
                {/* Variants Table */}
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Opção</TableHead>
                        <TableHead>Preço</TableHead>
                        <TableHead>Observação</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {plan.variants.map((variant, index) => (
                        <TableRow key={`${plan.id}-${index}`}>
                          <TableCell className="font-medium">{variant.label}</TableCell>
                          <TableCell>{variant.price}</TableCell>
                          <TableCell>{variant.note || '-'}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                
                {/* Benefits List */}
                <div>
                  <h4 className="text-lg font-medium mb-2">Benefícios Inclusos</h4>
                  <ul className="space-y-1 list-disc pl-5">
                    {plan.benefits.map((benefit, index) => (
                      <li key={`${plan.id}-benefit-${index}`}>{benefit}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
