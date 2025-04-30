
import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, X } from "lucide-react";
import type { Plan, Variant } from "@/integrations/catalog/types";

interface PlanVariantsTableProps {
  plan: Plan;
  isEditing?: boolean;
  onUpdate?: (variants: Variant[]) => void;
}

export const PlanVariantsTable = ({ plan, isEditing = false, onUpdate }: PlanVariantsTableProps) => {
  const [variants, setVariants] = useState<Variant[]>(plan.variants);
  
  const handleVariantChange = (index: number, field: keyof Variant, value: string) => {
    const updatedVariants = [...variants];
    updatedVariants[index] = { ...updatedVariants[index], [field]: value };
    setVariants(updatedVariants);
    
    if (onUpdate) {
      onUpdate(updatedVariants);
    }
  };
  
  const addVariant = () => {
    const newVariant: Variant = { label: "Nova opção", price: "R$ 0,00" };
    const updatedVariants = [...variants, newVariant];
    setVariants(updatedVariants);
    
    if (onUpdate) {
      onUpdate(updatedVariants);
    }
  };
  
  const removeVariant = (index: number) => {
    const updatedVariants = variants.filter((_, i) => i !== index);
    setVariants(updatedVariants);
    
    if (onUpdate) {
      onUpdate(updatedVariants);
    }
  };
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Opções de Contratação</CardTitle>
        {isEditing && (
          <Button onClick={addVariant} variant="outline" size="sm">
            <Plus className="h-4 w-4 mr-1" /> Adicionar Opção
          </Button>
        )}
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Periodicidade</TableHead>
              <TableHead>Valor</TableHead>
              <TableHead>Observações</TableHead>
              {isEditing && <TableHead className="w-[100px]">Ações</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {variants.map((variant, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">
                  {isEditing ? (
                    <Input 
                      value={variant.label} 
                      onChange={(e) => handleVariantChange(index, "label", e.target.value)}
                      className="max-w-[200px]"
                    />
                  ) : (
                    variant.label
                  )}
                </TableCell>
                <TableCell>
                  {isEditing ? (
                    <Input 
                      value={variant.price} 
                      onChange={(e) => handleVariantChange(index, "price", e.target.value)}
                      className="max-w-[200px]"
                    />
                  ) : (
                    variant.price
                  )}
                </TableCell>
                <TableCell>
                  {isEditing ? (
                    <Input 
                      value={variant.note || ''} 
                      onChange={(e) => handleVariantChange(index, "note", e.target.value)}
                      placeholder="Observação opcional"
                      className="max-w-[200px]"
                    />
                  ) : (
                    variant.note && (
                      <Badge variant="outline" className="text-doIt-primary">
                        {variant.note}
                      </Badge>
                    )
                  )}
                </TableCell>
                {isEditing && (
                  <TableCell>
                    <Button 
                      onClick={() => removeVariant(index)} 
                      variant="ghost" 
                      size="sm"
                      className="h-8 w-8 p-0"
                      disabled={variants.length <= 1}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
