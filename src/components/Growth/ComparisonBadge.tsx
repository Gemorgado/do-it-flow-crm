
import { Badge } from "@/components/ui/badge";

interface ComparisonBadgeProps {
  value: number;
  higherIsBetter: boolean;
}

export function ComparisonBadge({ value, higherIsBetter }: ComparisonBadgeProps) {
  const isPositive = value > 0;
  const isGood = (isPositive && higherIsBetter) || (!isPositive && !higherIsBetter);
  
  return (
    <Badge variant="outline" className={`
      ${isGood 
        ? "bg-green-50 text-green-700 border-green-200" 
        : "bg-red-50 text-red-700 border-red-200"
      }
    `}>
      {isPositive ? '+' : ''}{value.toFixed(1)}%
    </Badge>
  );
}
