
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Plus, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface PlanBenefitsListProps {
  benefits: string[];
  isEditing?: boolean;
  onUpdate?: (benefits: string[]) => void;
}

export const PlanBenefitsList = ({ benefits: initialBenefits, isEditing = false, onUpdate }: PlanBenefitsListProps) => {
  const [benefits, setBenefits] = useState<string[]>(initialBenefits);
  
  const handleBenefitChange = (index: number, value: string) => {
    const updatedBenefits = [...benefits];
    updatedBenefits[index] = value;
    setBenefits(updatedBenefits);
    
    if (onUpdate) {
      onUpdate(updatedBenefits);
    }
  };
  
  const addBenefit = () => {
    const updatedBenefits = [...benefits, "Novo benefício"];
    setBenefits(updatedBenefits);
    
    if (onUpdate) {
      onUpdate(updatedBenefits);
    }
  };
  
  const removeBenefit = (index: number) => {
    const updatedBenefits = benefits.filter((_, i) => i !== index);
    setBenefits(updatedBenefits);
    
    if (onUpdate) {
      onUpdate(updatedBenefits);
    }
  };
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Benefícios Inclusos</CardTitle>
        {isEditing && (
          <Button onClick={addBenefit} variant="outline" size="sm">
            <Plus className="h-4 w-4 mr-1" /> Adicionar Benefício
          </Button>
        )}
      </CardHeader>
      <CardContent>
        <ul className="space-y-3">
          {benefits.map((benefit, index) => (
            <li key={index} className="flex items-center gap-2">
              {!isEditing && (
                <div className="h-5 w-5 rounded-full bg-doIt-primary flex items-center justify-center flex-shrink-0">
                  <Check className="h-3 w-3 text-white" />
                </div>
              )}
              
              {isEditing ? (
                <div className="flex items-center gap-2 w-full">
                  <Input 
                    value={benefit} 
                    onChange={(e) => handleBenefitChange(index, e.target.value)}
                  />
                  <Button 
                    onClick={() => removeBenefit(index)} 
                    variant="ghost" 
                    size="sm"
                    className="h-8 w-8 p-0 flex-shrink-0"
                    disabled={benefits.length <= 1}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <span>{benefit}</span>
              )}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};
