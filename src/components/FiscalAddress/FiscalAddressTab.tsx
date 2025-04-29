
import React, { useMemo } from "react";
import { getDashboardMetrics } from "./addressUtils";
import { useFiscalAddressData } from "./hooks/useFiscalAddressData";
import { SummaryCards } from "./components/SummaryCards";
import { ChartSection } from "./components/ChartSection";
import { DelinquentTable } from "./components/DelinquentTable";
import { ExpiringTable } from "./components/ExpiringTable";
import { SkeletonLoader } from "./components/SkeletonLoader";

export const FiscalAddressTab: React.FC = () => {
  const { data: contracts, isLoading } = useFiscalAddressData();
  
  const metrics = useMemo(() => {
    return getDashboardMetrics(contracts || []);
  }, [contracts]);

  const delinquentContracts = useMemo(() => {
    return contracts?.filter(contract => contract.isDelinquent) || [];
  }, [contracts]);

  if (isLoading) {
    return <SkeletonLoader />;
  }
  
  // Prepare data for pie charts
  const cyclePieData = [
    { name: "Anuais", value: metrics.counts.annual, color: "#4f46e5" },
    { name: "Semestrais", value: metrics.counts.semiannual, color: "#8b5cf6" }
  ];
  
  const delinquencyPieData = [
    { 
      name: "Adimplentes", 
      value: metrics.counts.total - metrics.delinquency.delinquent, 
      color: "#10b981" 
    },
    { 
      name: "Inadimplentes", 
      value: metrics.delinquency.delinquent, 
      color: "#ef4444" 
    }
  ];

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <SummaryCards 
        counts={metrics.counts} 
        delinquency={metrics.delinquency} 
        expiringCount={metrics.expiringCount} 
      />

      {/* Charts */}
      <ChartSection 
        cyclePieData={cyclePieData} 
        delinquencyPieData={delinquencyPieData} 
      />

      {/* Delinquent Contracts Table */}
      <DelinquentTable contracts={delinquentContracts} />

      {/* Expiring Contracts Table */}
      <ExpiringTable contracts={metrics.expiring} />
    </div>
  );
};
