
import React from "react";
import { TotalCounts, DelinquencyMetrics } from "../types";
import { TotalAddressCard } from "./cards/TotalAddressCard";
import { PeriodicitySplitCard } from "./cards/PeriodicitySplitCard";
import { DelinquentCard } from "./cards/DelinquentCard";
import { ExpiringCard } from "./cards/ExpiringCard";

interface SummaryCardsProps {
  counts: TotalCounts;
  delinquency: DelinquencyMetrics;
  expiringCount: number;
}

export const SummaryCards: React.FC<SummaryCardsProps> = ({ 
  counts, 
  delinquency, 
  expiringCount 
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <TotalAddressCard total={counts.total} />
      
      <PeriodicitySplitCard 
        annual={counts.annual} 
        semiannual={counts.semiannual} 
      />

      <DelinquentCard 
        count={delinquency.delinquent} 
        rate={delinquency.rate} 
      />

      <ExpiringCard count={expiringCount} />
    </div>
  );
};
