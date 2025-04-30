
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Plan } from "@/integrations/catalog/types";

export const PlanVariantsTable = ({ plan }: { plan: Plan }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Opções de Contratação</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Periodicidade</TableHead>
              <TableHead>Valor</TableHead>
              <TableHead>Observações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {plan.variants.map((variant, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">{variant.label}</TableCell>
                <TableCell>{variant.price}</TableCell>
                <TableCell>
                  {variant.note && (
                    <Badge variant="outline" className="text-doIt-primary">
                      {variant.note}
                    </Badge>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
