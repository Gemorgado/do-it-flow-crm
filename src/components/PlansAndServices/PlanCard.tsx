
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface PlanProps {
  title: string;
  description: string;
  icon: LucideIcon;
  features: string[];
  highlight?: boolean;
}

export const PlanCard = ({ title, description, icon: Icon, features, highlight }: PlanProps) => {
  return (
    <Card className={`h-full ${highlight ? "border-doIt-primary" : ""}`}>
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <Icon className="h-5 w-5 text-doIt-primary" />
          <CardTitle className="text-lg">{title}</CardTitle>
        </div>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2 text-sm">
          {features.map((feature, i) => (
            <li key={i} className="flex items-start gap-2">
              <span className="text-doIt-primary text-lg leading-none">•</span>
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};
