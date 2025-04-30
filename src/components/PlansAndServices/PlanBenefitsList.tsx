
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check } from "lucide-react";

export const PlanBenefitsList = ({ benefits }: { benefits: string[] }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Benefícios Inclusos</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {benefits.map((benefit, index) => (
            <li key={index} className="flex items-center gap-2">
              <div className="h-5 w-5 rounded-full bg-doIt-primary flex items-center justify-center">
                <Check className="h-3 w-3 text-white" />
              </div>
              <span>{benefit}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};
