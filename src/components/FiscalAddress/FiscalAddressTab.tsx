
import React, { useMemo, Suspense } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { ChartCard } from "@/components/Dashboard/ChartCard";
import { PieChart } from "@/components/ui/chart";
import { getDashboardMetrics, getDaysRemaining, getDaysPastDue } from "./addressUtils";
import { FiscalAddressContract } from "./types";
import { mockContracts } from "./mockData";

// For a real implementation, this would come from an API or context
const useFiscalAddressData = () => {
  // In a real app, this would fetch data from an API
  return { data: mockContracts, isLoading: false };
};

const SkeletonLoader = () => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {[1, 2, 3, 4].map(i => (
        <Card key={i}>
          <CardHeader className="p-4">
            <Skeleton className="h-4 w-1/2 mb-2" />
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <Skeleton className="h-8 w-1/3" />
          </CardContent>
        </Card>
      ))}
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {[1, 2].map(i => (
        <Card key={i}>
          <CardHeader className="p-4">
            <Skeleton className="h-4 w-1/3 mb-2" />
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <Skeleton className="h-[200px] w-full rounded-md" />
          </CardContent>
        </Card>
      ))}
    </div>
  </div>
);

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

  // Format number as percentage
  const formatPercent = (value: number) => `${(value * 100).toFixed(1)}%`;
  
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
      <h2 className="text-2xl font-bold">Endereços Fiscais</h2>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total de Endereços Fiscais</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.counts.total}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Por Periodicidade</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col">
              <div className="flex justify-between">
                <span>Anuais</span>
                <span className="font-bold">{metrics.counts.annual}</span>
              </div>
              <div className="flex justify-between">
                <span>Semestrais</span>
                <span className="font-bold">{metrics.counts.semiannual}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Inadimplentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">
              {metrics.delinquency.delinquent}
              <span className="text-sm text-gray-500 ml-2">
                ({formatPercent(metrics.delinquency.rate)})
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">A Vencer em 90 dias</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.expiringCount}</div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title="Distribuição por Periodicidade">
          <div className="p-6 flex justify-center">
            <PieChart data={cyclePieData} />
          </div>
        </ChartCard>

        <ChartCard title="Adimplência">
          <div className="p-6 flex justify-center">
            <PieChart data={delinquencyPieData} />
          </div>
        </ChartCard>
      </div>

      {/* Delinquent Contracts Table */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-md font-medium">Contratos Inadimplentes</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nº do Contrato</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Ciclo</TableHead>
                <TableHead>Vencimento</TableHead>
                <TableHead>Dias em Atraso</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {delinquentContracts.length > 0 ? (
                delinquentContracts.map((contract) => (
                  <TableRow key={contract.contractNo}>
                    <TableCell className="font-medium">{contract.contractNo}</TableCell>
                    <TableCell>{contract.customerName}</TableCell>
                    <TableCell>
                      <Badge variant={contract.cycle === 'annual' ? 'default' : 'secondary'}>
                        {contract.cycle === 'annual' ? 'Anual' : 'Semestral'}
                      </Badge>
                    </TableCell>
                    <TableCell>{contract.endDate}</TableCell>
                    <TableCell>
                      <Badge variant="destructive">
                        {getDaysPastDue(contract.endDate)} dias
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center">
                    Nenhum contrato inadimplente encontrado.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Expiring Contracts Table */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-md font-medium">Próximas Renovações (≤ 90 dias)</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nº do Contrato</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Ciclo</TableHead>
                <TableHead>Vencimento</TableHead>
                <TableHead>Dias Faltantes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {metrics.expiring.length > 0 ? (
                metrics.expiring.map((contract) => (
                  <TableRow key={contract.contractNo}>
                    <TableCell className="font-medium">{contract.contractNo}</TableCell>
                    <TableCell>{contract.customerName}</TableCell>
                    <TableCell>
                      <Badge variant={contract.cycle === 'annual' ? 'default' : 'secondary'}>
                        {contract.cycle === 'annual' ? 'Anual' : 'Semestral'}
                      </Badge>
                    </TableCell>
                    <TableCell>{contract.endDate}</TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {getDaysRemaining(contract.endDate)} dias
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center">
                    Nenhum contrato a vencer nos próximos 90 dias.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};
