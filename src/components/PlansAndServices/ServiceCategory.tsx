
import { Badge } from "@/components/ui/badge";
import { LucideIcon } from "lucide-react";
import { PlanCard } from "./PlanCard";

interface PlanProps {
  title: string;
  description: string;
  icon: LucideIcon;
  features: string[];
  highlight?: boolean;
}

interface ServiceCategoryProps {
  title: string;
  description: string;
  icon: LucideIcon;
  planTypes: PlanProps[];
  availableUnits?: number;
  info?: string;
}

export const ServiceCategory = ({ title, description, icon: Icon, planTypes, availableUnits, info }: ServiceCategoryProps) => {
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Icon className="h-6 w-6 text-doIt-primary" />
          <h2 className="text-2xl font-semibold">{title}</h2>
        </div>
        
        {availableUnits && (
          <Badge variant="outline" className="w-fit">
            {availableUnits} unidades disponíveis
          </Badge>
        )}
      </div>
      
      <p className="text-muted-foreground">{description}</p>
      
      {info && <p className="text-sm italic text-muted-foreground">{info}</p>}
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {planTypes.map((plan, i) => (
          <PlanCard key={i} {...plan} />
        ))}
      </div>
    </div>
  );
};
